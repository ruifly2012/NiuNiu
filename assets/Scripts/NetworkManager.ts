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
        //this.ws = new WebSocket("ws://52.193.67.26:8080/ws/game?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZl9hY2NvdW50IjoiZ3Vlc3RfMTE1NjQ2MjIyMTA3ODczNTYiLCJyb2xlX2NvZGVfaWQiOiIwIiwiZXhwIjoxNTY0NjUxMDEwfQ.veF1OMN_up_56EbrqCFWXsoDXGJgQb3r0McyTBzleNw&oid=20");
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
        Game.Inst.isNeedReconnect = false;
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
            cc.warn(msg);
    
        //parse to string to avoid "Object object" problem
        this.ws.send(JSON.stringify(msg));
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
        cc.log("[NetworkMgr] register code: "+code);
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

    /**
     * 罐頭訊息
    */
    sendCannedMsg(canNum: number){
        let data= {
            "event" : "spam_message",
            "message_index" : canNum
        };
        this.sendMessage(data);
    }
    
}
