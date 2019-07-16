import Game from "./Game";
import * as Define from "./Define";
import UIMgr from "./UIMgr";

export default class NetworkManager {

    // The data shown below must be sync with server (zio_engine) zio_engine/libs/imp_websocket/defination.go 
    static readonly EVENT_WEB_SOCKET = "websocket";
    static readonly EVENT_RECOVER = "recover";
    static readonly EVENT_MATCHING = "matching";
    static readonly EVENT_ECHO = "echo";
    static readonly EVENT_TEST = "test";
    static readonly EVENT_ADD_GROUP = "addGroup";
    static readonly EVENT_BROADCAST = "broadcast";
    static readonly EVENT_GET_GRP_INFO = "getGroupInfo";
    static readonly EVENT_BET = "bet";
    static readonly EVENT_KEEP_ALIVE = "keepAlive";
    static readonly EVENT_START_GAME = "startGame";
    static readonly WEB_SOCKET_TIEM_OUT_MS = 10000;
    // ******************************************************************
    
    static ServerURL: string = "";
    static Port: number = 9000;
    static Token: string = "token";
    static Oid: string = "";
    private ws: WebSocket;
    
    ////////////DEBUG MODE//////////
    private enableDebugLog: boolean = true;
    
    // callback map
    constantCallbackMap = {};
    oneTimeCallbackMap = {};
    cacheCallbackMap = {};
        
    // keep alive with server
    keepAliveInterval;
    keepAliveTimeout;
    
    // 與Server進行連線
    connect(onOpen, onClose){
        if (NetworkManager.ServerURL != ""){
            this.reconnect(onOpen, onClose);
        }
        else
            this.loadConfig(() => this.reconnect(onOpen, onClose));
    }
    
    reconnect(onOpen, onClose){
        cc.log('[NetworkMgr] connect to Server...');
        this.ws = new WebSocket("ws://" + NetworkManager.ServerURL + "/ws/game?token=" + NetworkManager.Token + "&oid=" + NetworkManager.Oid);
        this.ws.onopen = (evt) =>{
            //this.keepAliveInterval = window.setInterval(this.keepAlive, 5000);
            if (onOpen != null)
                onOpen(evt);
        };
    
        this.ws.onmessage = (evt) =>{ this.onMessage(evt); };
            
        this.ws.onerror = (evt) =>{ this.onError(evt); };
            
        this.ws.onclose = (evt) =>{
            clearInterval(this.keepAliveInterval);
            if (onClose != null)
                onClose(evt);
        }
    }
    
    // 與Server中斷連線
    disconnect(){
        if (this.ws != null)
            this.ws.close();
        clearInterval(this.keepAliveTimeout);
    }
    
    // 傳送訊息回Server端
    sendMessage(msg, func = null){
        if (this.enableDebugLog)
            cc.warn("[NetworkMgr] send: " + msg);
    
        this.ws.send(msg);   
        if (func != null){
            let data = JSON.parse(msg);
            this.oneTimeCallbackMap[data.event] = func;
        }
    }
    
    // 註冊回應委派事件
    registerEvent(code, callback){
        if (this.constantCallbackMap[code] !== undefined)
            cc.warn("[NetworkMgr] Duplicate register code: " + code);
    
        this.constantCallbackMap[code] = callback;
    
        // FIFO to execute all cache callback
        if (this.cacheCallbackMap[code] !== undefined){
            while (this.cacheCallbackMap[code].length > 0){
                let f = this.cacheCallbackMap[code].shift();
                this.constantCallbackMap[code](f);
            }
        }
    }
    
    // 註銷回應委派事件
    unregisterEvent(code){
        if (this.constantCallbackMap[code] !== undefined)
            this.constantCallbackMap[code] = undefined;
    }
    
    // 收到Server回報錯誤時的callback
    onError(evt){
        cc.error("websocket error: " + evt);
    }
    
    // 收到Server回應訊息的callback
    onMessage(evt){
        if (this.enableDebugLog)
            cc.warn("[NetworkMgr] receive: " + evt.data);
            
        let data = JSON.parse(evt.data)
        let code = data.event;
            
        if (this.constantCallbackMap[code] !== undefined){
            this.constantCallbackMap[code](data);
        }
        else {
            if (this.cacheCallbackMap[code] === undefined)
                this.cacheCallbackMap[code] = [];                
            this.cacheCallbackMap[code].push(data);
        }
    
        if (this.oneTimeCallbackMap[code] !== undefined){
            this.oneTimeCallbackMap[code](data);
            this.oneTimeCallbackMap[code] = undefined;
        }
    }

    loadConfig(onLoaded?){
        let url = "text/config.json";
        cc.loader.loadRes(url, (err, res) =>{
            cc.log('[NetworkMgr] load'+ url +'], err' + err + '] result: ' + JSON.stringify(res));
            let JsonObj = res['json'];
            NetworkManager.ServerURL = JsonObj['ServerURL'];
    
            if (onLoaded != null)
                onLoaded();
        });
    }
    
    keepAlive() {
        let jsonData = {"event": NetworkManager.EVENT_KEEP_ALIVE}
    
        this.keepAliveTimeout = setTimeout(() =>{
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.close()
            }
        }, NetworkManager.WEB_SOCKET_TIEM_OUT_MS);
    
        Game.Inst.networkMgr.sendMessage(JSON.stringify(jsonData), ()=>{
            console.log("keep alive call back");
            window.clearTimeout(this.keepAliveTimeout)
        });
    }
    
    /*
    private _socket;
    private self = this;
    */

    /*
    ConnectServer() {
        cc.log("con server");
        if (NetworkManager.serverURL != ""){
            this._socket = io.connect(NetworkManager.serverURL);
            this.eventRegister();
            this.LogIn();
        }
        else{
            this.loadConfig(() => {
                this._socket = io.connect(NetworkManager.serverURL);
                this.eventRegister();
                this.LogIn();
            });
        }
        cc.log("connect success");
    };
    */

    // disConnect(){
    //     cc.log("disconnect");
    //     this._socket.disconnect();
    //     this.eventUnregister();
    // }

    //socket(){ return this._socket; }

    LogIn(){
        //log oid for after use
        //Define.RoomInfo.Inst.game_option_id = Number(oid);
        let token = Define.GameInfo.Inst.token;
        let json= {
            "no" : Number(6006),
            "data" : token
        };
        this._socket.emit("action",json ,(code,data)=>{
            cc.log("token callback : "+code + data);
            if(code == 0){
                this.getGameTable();
                //Game.Inst.EventListener.notify("enterGame");
            }
            
        })

       
    }

    getGameTable(){
        let tableJson= {
            "no" : 6001,
            "data" : {"oid": Define.RoomInfo.Inst.game_option_id}//13: 2player
        };//2 player
        cc.log("table req:"+tableJson); 
        this._socket.emit("action",tableJson ,function(errCode,message){
            cc.log("table req callback: "+JSON.stringify(errCode) +"," + JSON.stringify(message));
        })
    }

    /**
     * 取得時間
     */
    get_time(){
        let no:number = 6070;
        let json= {
            "no" : no
        };
        this._socket.emit("action",json ,function(code,data){
            if(code == 0) {
                Game.Inst.EventListener.notify("getTime",data);
            }
            else
                cc.warn("get time error : " + data.error);
        })
    }

    /**
     * 搶莊
     * @param rate 倍率
     */
    rob_bet(rate: number){
        let no:number = 6072;
        let json= {
            "no" : no,
            "data" : {
                "rob_bet" : rate
            }
        };
        this._socket.emit("action",json ,function(code,data){
            cc.log("code : " + code);
            if(code != 0) cc.warn("rob_bet error : " + data.error);
            else cc.log("rob_bet success");
        })
    }

    /**
     * 一般倍率下注
     * @param rate 倍率
     */
    place_bet(rate: number){
        let no:number = 6073;
        let json= {
            "no" : no,
            "data" : {
                "place_bet" : rate
            }
        };
        this._socket.emit("action",json ,function(code,data){
            if(code != 0) cc.warn("place_bet error : " + data.error);
            else cc.log("place_bet success");
        })
    }

    /**
     * 選牌完成
     */
    chooseCardComplete(){
        let no:number = 6074;
        let json= {
            "no" : no,
            "data" : {
                "deal_card" : 1
            }
        };
        this._socket.emit("action",json ,function(code,data){
            if(code != 0) cc.warn("chooseCard error : " + data.error);
            else cc.log("chooseCard success");
        })
    }

    /**
     * 罐頭訊息
     */
    sendCannedMsg(canNum: number){
        let no:number = 6011;
        let json= {
            "no" : no,
            "data" : {
                "canned_num" : canNum
            }
        };
        this._socket.emit("action",json ,function(code,data){
            if(code == 0) {
                cc.log("send can msg");
            }
            else
                cc.warn("send can msg error : " + data.error);
        })
    }

    eventRegister(){
        let self = this;

        this._socket.on("response", function (data) {
            cc.log("response : " + JSON.stringify(data));
            if(data == 6001) {
                // get table success
                Game.Inst.EventListener.notify("startGame");
                //switch to rob bet
            }
            switch(data.no){
                ///////stage info////////////
                case 6101://rob bet stage info
                    Game.Inst.EventListener.notify("startRobBetFSM",data);
                    Game.Inst.EventListener.notify("RobBetInfo",data);
                    break;
                case 6108:
                    self.receiveBanker(data);
                    break;
                case 6103://place bet stage info
                    self.placeBetStageInfo(data);
                    break;
                case 6105://all result send
                    self.receiveCard(data);
                    break;
                // //////bet///////////////    
                case 6102:
                    self.receiveRobBet(data);
                    break;
                case 6104:
                    self.receivePlaceBet(data);
                    break;
                case 6106:
                    self.receiveOtherChoose(data);
                    break;
                case 6011:
                    self.rcvCannedMsg(data);
                default:
                    break;
            }
        });
        

    }

    eventUnregister(){
        this._socket.off("response");
    }

    /**
     * 6108 莊家
     * @param data 
     */
    receiveBanker(data){
        let bankerIndex =  UIMgr.Inst.getPlayerIndexByUID(data.banker);
        Define.GameInfo.Inst.bankerIndex = bankerIndex;
        //stop clock when rob banker anime
        UIMgr.Inst.stopClock();
        UIMgr.Inst.setDealerAnime(Define.GameInfo.Inst.rob_list,bankerIndex);
    }

    /**
     * 6103  after 6108 3s
     * @param data 
     */
    placeBetStageInfo(data){
        cc.log(data);
        //set rate
        UIMgr.Inst.BetUIMgr.setRate(data.main_player.place_bet_list);
        Game.Inst.EventListener.notify("gotoPlaceBet");
        Game.Inst.EventListener.notify("startBet");
    }

    /**
     * 6102
     * @param data 
     */
    receiveRobBet(data){
        UIMgr.Inst.getPlayerByUID(data.player).setStatus(Define.BetType.RobBet,data.rob_bet);
        cc.log("push"+UIMgr.Inst.getPlayerIndexByUID(data.player));
        if(data.rob_bet != 0)
            Define.GameInfo.Inst.rob_list.push(UIMgr.Inst.getPlayerIndexByUID(data.player));
    }

    /**
     * 6104
     * @param data 
     */
    receivePlaceBet(data){
        UIMgr.Inst.getPlayerByUID(data.player).setStatus(Define.BetType.PlaceBet,data.place_bet);
    }



    /**
     * 6105
     * @param data
     */
    receiveCard(data){
        Game.Inst.EventListener.notify("gotoChooseCard");
        Define.GameInfo.Inst.players[0].finalData(data.main_player);
        cc.warn("my cards : " + Define.GameInfo.Inst.players[0].poker + "type : " + Define.GameInfo.Inst.players[0].cardType);
        //show card
        UIMgr.Inst.cardUIMgr.getCard = true;
        if(UIMgr.Inst.cardUIMgr.readyShow) UIMgr.Inst.cardUIMgr.setCard();

        //get other player data
        let playerIndex = 0;
        for (let _key in data.players) {
            playerIndex++;
            Define.GameInfo.Inst.players[playerIndex].finalData(data.players[_key]);
        }
    }

    /**other player choose card complete */
    receiveOtherChoose(data){
        let index = UIMgr.Inst.getPlayerIndexByUID(data.player)
        //cc.warn("get other complete choose");
        UIMgr.Inst.CardStatusUIMgr.setComplete(index,true);
        Game.Inst.EventListener.notify("cardChooseComplete");
    }

    /**
     * 罐頭訊息
     */
    rcvCannedMsg(data){
        let index = UIMgr.Inst.getPlayerIndexByUID(data.uid);
        UIMgr.Inst.players[index].talk(data.canned_num);
        cc.warn("player"+index+"rcv canned msg"+data.canned_num);
    }

    /**獲得注單 */
    get_record(){
        let no:number = 6007;
        let json= {
            "no" : no
        };
        this._socket.emit("action",json ,function(code,data){
            if(code != 0) cc.warn("get_record error : " + data);
            else {
                cc.log(data);
                cc.log(code);
            }
        })
    }

}
