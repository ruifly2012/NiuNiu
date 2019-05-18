import Game from "./Game";
import * as Define from "./Define";
import UIMgr from "./UIMgr";

export default class NetworkManager {
    
    private _socket;
    
    static serverURL:string = "";
    
    private self = this;


    ConnectServer() {
        cc.log("con server");
        if (NetworkManager.serverURL != ""){
            this._socket = io.connect(NetworkManager.serverURL, {
                reconnection: false
            });
        }
        else{
            this.loadConfig(() => {
                this._socket = io.connect(NetworkManager.serverURL, {
                    reconnection: false
                });
            });
        }
        cc.log("connect success");
        this.eventRegister();
        this.LogIn();
    };

    loadConfig(onLoaded?)
    {
        let url = "text/config.json";
        cc.loader.loadRes(url, (err, res) =>
        {
            cc.log('[NetworkMgr] load'+ url +'], err' + err + '] result: ' + JSON.stringify(res));
            let JsonObj = res['json'];

            NetworkManager.serverURL = JsonObj['ServerURL'];

            if (onLoaded != null)
                onLoaded();
        });
    }

    disConnect(){
        cc.log("disconnect");
        this._socket.disconnect();
        this.eventUnregister();
    }

    socket(){ return this._socket; }

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
            if(code == 200){
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
        //console.log("table req:"+tableJson); 
        this._socket.emit("action",tableJson ,function(errCode,message){
            //console.log("table req callback: "+JSON.stringify(errCode) +"," + message);
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
            if(code == 200) {
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
            if(code != 200) cc.warn("rob_bet error : " + data.error);
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
            if(code != 200) cc.warn("place_bet error : " + data.error);
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
            if(code != 200) cc.warn("chooseCard error : " + data.error);
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
            if(code == 200) {
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
            switch(data.no){
                ///////stage info////////////
                case 6101://rob bet stage info
                    Game.Inst.EventListener.notify("startGame");
                    Game.Inst.EventListener.notify("RobBetInfo",data);
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
     * 6103
     * @param data 
     */
    placeBetStageInfo(data){
        let bankerIndex =  UIMgr.Inst.getPlayerIndexByUID(data.banker);
        Define.GameInfo.Inst.bankerIndex = bankerIndex;
        UIMgr.Inst.players[bankerIndex].setBanker(true);
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

}
