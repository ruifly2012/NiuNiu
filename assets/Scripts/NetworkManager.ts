import Game, { SessionData } from "./Game";
import { GameState } from "./MainStateMgr";
import { ButtonSetting } from "./components/MessageBoxCtr";
const { ccclass, property } = cc._decorator;
export enum ErrorAction {
    ToLobby = 0,
    ToGameEnd = 1,
    Stay = 2
}
/**
 * 網路管理物件
 */
@ccclass
export default class NetworkMgr
{
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
    private enableDebugLog: boolean = true;

    private m_error: boolean = false;
    private m_errorMessage: string = "";
    private m_errorAction: ErrorAction = 0;
    private m_hnd;

    // callback map
    constantCallbackMap = {};
    oneTimeCallbackMap = {};
    cacheCallbackMap = {};
    
    // keep alive with server
    keepAliveInterval;
    keepAliveTimeout;


    private m_WebSockets: WebSocket[] = [];
    private m_ServerURLs: string[] = [];
    private m_Name: string[] = [];
    private m_Indices = {};
    private m_Index: number = 0;
    private m_ConstantCallbackMaps = {};
    private m_OneTimeCallbackMaps = {};
    private m_CacheCallbackMaps = {};
    connectionError(){
        return this.m_error;
    }
    WebSocketIsActive(name){
        let index: any;
        index = this.m_Indices[name];
        
        if ( this.m_WebSockets[index] == null) {
            return false;
        } else {
            if ( this.m_WebSockets[index].readyState == 1){
                return true;
            } else {
                return false;
            } 
        }
        return false;
    }
    registerWebSocket(name: string, serverURL: string, token?: string, oid?: string, room?: string){
        if (this.m_WebSockets[this.m_Indices[name]] != undefined) {
            cc.log("[NetworkMgr] Duplicate register code: " + name);
        }
        let url = serverURL;
        
        if (token != undefined) {
            url += "?token=" + token;
        }
        if (oid != undefined) {
            url += "&oid=" + oid;
        }
        if (room != undefined) {
            url += "&room_no=" + room;
        }
        let websocket = null;
        this.m_WebSockets.push(websocket);
        this.m_ServerURLs.push(url);
        this.m_Name.push(name);
        this.m_ConstantCallbackMaps[this.m_Index] = [];
        this.m_CacheCallbackMaps[this.m_Index] = [];
        this.m_OneTimeCallbackMaps[this.m_Index] = [];
        this.m_Indices[name] = this.m_Index;
        
        this.m_Index ++;
    }
    connectByName(name, onOpen, onClose){
        if (this.m_error == true) {
            this.createMsgBox(this.m_errorMessage, this.m_errorAction);
            return;
        }
        if (this.m_ServerURLs[this.m_Indices[name]] != "") {
            this.reconnectByName(name, onOpen, onClose);
        } else {
            this.loadConfig(() => this.reconnectByName(name, onOpen, onClose));
        }
    }
    reconnectByName(name, onOpen, onClose){
        let index: any;
        index = this.m_Indices[name];
        this.m_WebSockets[index] = new WebSocket(this.m_ServerURLs[index]);
        this.m_WebSockets[index].onopen = (evt) => {
            //this.keepAliveInterval = window.setInterval(this.keepAlive, 5000);
            if (onOpen != null)
                onOpen(evt);
        };
        this.m_WebSockets[index].onmessage = (evt) => {
            
             this.onMessageByName(name, evt); 
        };
        this.m_WebSockets[index].onerror = (evt) => {
            this.onErrorByName(name, evt); 
        };
        this.m_WebSockets[index].onclose = (evt) => {
            //clearInterval(this.keepAliveInterval);
            if (onClose != null) {
                onClose(evt);
            }
        }
    }
    
    onMessageByName(name, evt) {
        let index: any;
        index = this.m_Indices[name];
        if (this.enableDebugLog)
            cc.warn("[NetworkMgr] websocket: " + name + " receive: " + evt.data);
        
        let data = JSON.parse(evt.data)
        let code = data.event;
        
        if (data.event  == "server_error") {
            if (data.code != undefined) {
                this.handleError(data.code);
            } else {
                this.handleError(data.Code);
            }
            return;
        }

        if (this.m_ConstantCallbackMaps[index][code] !== undefined) {
            
            this.m_ConstantCallbackMaps[index][code](data);
        } else {
            if (this.m_CacheCallbackMaps[index][code] === undefined) {
                this.m_CacheCallbackMaps[index][code] = [];  
            }           
            this.m_CacheCallbackMaps[index][code].push(data);
        }
        if (this.m_OneTimeCallbackMaps[index][code] !== undefined) {
            this.m_OneTimeCallbackMaps[index][code](data);
            this.m_OneTimeCallbackMaps[index][code] = undefined;
        }
    }
    onErrorByName(name, evt) {
        cc.error("[NetworkMgr] websocket: " + name + " error: " + evt);
    }
    disconnectByName(name)
    {
        let index: any;
        index = this.m_Indices[name];
        if (this.m_WebSockets[index] != null) {
            this.m_WebSockets[index].close();
            this.m_WebSockets[index] = null;
        }
    }
    sendMessageByName(name, msg, func = null)
    {
        let index: any;
        index = this.m_Indices[name];
        if (this.enableDebugLog)
            cc.warn("[NetworkMgr] websocket: " + name + " send: " + msg);

        this.m_WebSockets[index].send(msg);  
        if (func != null){
            let data = JSON.parse(msg);
            this.oneTimeCallbackMap[index][data.event] = func;
        } 
    }
    registerEventByName(name ,code, callback)
    {
        let index: any;
        index = this.m_Indices[name];
        
        if (this.m_ConstantCallbackMaps[index][code] !== undefined) {
            cc.warn("[NetworkMgr] Duplicate register code: " + code);
        }

        this.m_ConstantCallbackMaps[index][code] = callback;
       
        //cc.log(this.m_ConstantCallbackMaps[index][code]);
        // FIFO to execute all cache callback
        if (this.m_CacheCallbackMaps[index][code] !== undefined)
        {
            while (this.m_CacheCallbackMaps[index][code].length > 0)
            {
                let f = this.m_CacheCallbackMaps[index][code].shift();
                this.m_ConstantCallbackMaps[index][code](f);
            }
        }
    }
    unregisterEventByName(code)
    {
        let index: any;
        index = this.m_Indices[name];
        if (this.m_ConstantCallbackMaps[index][code] !== undefined) {
            this.m_ConstantCallbackMaps[index][code] = undefined;
        }
    }

    // 與Server進行連線
    connect(onOpen, onClose)
    {
        if (this.m_error == true) {
            this.createMsgBox(this.m_errorMessage, this.m_errorAction);
            return;
        }
        if (NetworkMgr.ServerURL != "")
        {
            this.reconnect(onOpen, onClose);
        }
        else
            this.loadConfig(() => this.reconnect(onOpen, onClose));
    }

    reconnect(onOpen, onClose){
        cc.log('[NetworkMgr] connect to Server...');
        this.ws = new WebSocket("ws://" + NetworkMgr.ServerURL + "/ws/game?token=" + NetworkMgr.Token + "&oid=" + NetworkMgr.Oid);

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
        if (data.event  == "server_error") {
            if (data.code != undefined) {
                this.handleError(data.code);
            } else {
                this.handleError(data.Code);
            }
            return;
        }
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
            NetworkMgr.ServerURL = JsonObj['ServerURL'];
            if (onLoaded != null)
                onLoaded();
        });
    }

    keepAlive() {
        let jsonData = {"event": NetworkMgr.EVENT_KEEP_ALIVE}

        this.keepAliveTimeout = setTimeout(() =>{
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.close()
            }
        }, NetworkMgr.WEB_SOCKET_TIEM_OUT_MS);

        Game.Inst.networkMgr.sendMessage(JSON.stringify(jsonData), ()=>{
            console.log("keep alive call back");
            window.clearTimeout(this.keepAliveTimeout)
        });
    }
    httpRequest(action: string ,url: string, accessToken: string, body: string, callback?) {
        let httpRequest = new XMLHttpRequest();
        httpRequest.open(action, url, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        if (accessToken != "") {
            httpRequest.setRequestHeader("Authorization", accessToken);
        }
        httpRequest.send(body);
        httpRequest.onload = (event) => {
            if(httpRequest.readyState == XMLHttpRequest.DONE){
                this.httpRequestResponse(httpRequest.status, JSON.parse(httpRequest.responseText), callback);
            }
        }
    }
    httpRequestResponse(httpStatus: number, data: any, callback?){
        if (httpStatus == 200) {
            if (data.code == 0) {
                if (callback != undefined) {
                    callback(data);
                }
            } else {
                this.handleError(data.code);
            }
        } else if (httpStatus == 408 || httpStatus == 504) {
            this.handleError(httpStatus);
        } else {
            this.handleError(httpStatus);
        }
    }

    handleError(code: number){
        
        this.m_errorMessage = "发生错误，请重新操作";
        this.m_errorAction = ErrorAction.ToLobby;
        switch (code){
            case 408:
                this.m_errorMessage = "联机逾时，请重新登入";
            case 504:
                this.m_errorMessage = "联机错误，请重新登入";
            case 10001:
                break;
            case 10002:
                break;
            case 10003:
                break;
            case 10004:
                break;
            case 10005:
                break;
            case 10006:      
                break;

            case 11001:
                break;
            case 11002:
                break;
            case 11003:
                break;
            case 11004:
                break;

            case 12001:
                break;
            case 12002:
                break;
            case 12003:
               break;

            case 13001:
                break;
            case 13002:
                this.m_errorMessage = "查无此账号，请重新登入或联络客服";
                this.m_errorAction = ErrorAction.ToGameEnd;
                break;
            case 13003:
                break;
            case 13004:
                this.m_errorMessage = "因违反游戏管理规章，已将此账号停权\n若有任何疑问请联络客服";
                this.m_errorAction = ErrorAction.ToGameEnd;
                break;
            case 13005:
                this.m_errorMessage = "发现账号有重复登入纪录，请确认是否为您本人\n若不是则账号可能已遭窃取，请尽速与客服联系";
                this.m_errorAction = ErrorAction.ToGameEnd;
                break;

            case 14001:
                break;
            case 14002:
                this.m_errorMessage = "您的金额不足，请重新充值\n或到低底注房间进行游戏";
                break;
            case 14003:
                break;
            case 14004:
                break;
            case 14005:
                break;
            case 14006:      
                break;

            case 15001:
                break;
            case 15002:
                break;
            case 15003:
                break;
            case 15004:
                break;
            case 15005:
                break;

            case 16001:
                break;
            case 16002:
                this.m_errorMessage = "账号异常，请重新登入";
                this.m_errorAction = ErrorAction.ToGameEnd;
                break;
            case 16003:
                this.m_errorMessage = "账号异常，请重新登入";
                this.m_errorAction = ErrorAction.ToGameEnd;
                break;
            case 16004:
                this.m_errorMessage = "查无此账号，请重新登入或联络客服";
                this.m_errorAction = ErrorAction.ToGameEnd;
                break;
            case 16005:
                break;

            case 17001:
                break;
            case 17002:
                break;
            case 17003:
                break;
            case 17004:
                this.m_errorMessage = "联机错误，请重新登入";
                break;
            case 17005:
                this.m_errorMessage = "联机错误，请重新登入";
                break;
            case 17006:      
                break;
            case 17007:
                this.m_errorMessage = "联机错误，请重新登入";      
                break;

            case 18001:
                break;
            case 18002:
                break;
            case 18003:
                break;
            case 18004:
                break;
            case 18005:
                break;
            case 18006:      
                break;
            case 18007:
                break;
            case 18008:
                break;
            case 18009:
                break;
            case 18010:
                break;
            case 18011:
                break;
            case 18012:      
                break;
            case 18013:
                break;
            case 18014:      
                break;
            case 18015:      
                break;

            case 19001:
                break;
        }
        this.createMsgBox(this.m_errorMessage, this.m_errorAction);
        if (this.m_errorAction == ErrorAction.ToLobby) {
            this.m_error = true;
            this.disconnect();
            for (let i = 0; i < this.m_Name.length; i++) {
                this.disconnectByName(this.m_Name[i]);
            }
            this.m_hnd = setTimeout(() => {
                this.toLobby();
            }, 5000);
        } else if (this.m_errorAction == ErrorAction.ToGameEnd) {
            this.m_error = true;
            this.disconnect();
            for (let i = 0; i < this.m_Name.length; i++) {
                this.disconnectByName(this.m_Name[i]);
            }
            this.m_hnd = setTimeout(() => {
                Game.Inst.currentGameMgr.release();
            }, 5000);
        } else {
            // stay
        }
    }
    createMsgBox(text: string, errorToLobby: ErrorAction) {
        let rightBtnSet: ButtonSetting = new ButtonSetting();
        rightBtnSet.originBtnBackground = Game.Inst.resourcesMgr.load("btnconfirmO");
        rightBtnSet.originBtnText = Game.Inst.resourcesMgr.load("txtconfirmO");
        rightBtnSet.clickedBtnBackground = Game.Inst.resourcesMgr.load("btnconfirmO");
        rightBtnSet.clickedBtnText = Game.Inst.resourcesMgr.load("txtconfirmO");
        rightBtnSet.callback = () => {
            if (errorToLobby == ErrorAction.ToLobby) {
                clearInterval(this.m_hnd);
                this.toLobby();
            } else if (errorToLobby == ErrorAction.ToGameEnd) {
                clearInterval(this.m_hnd);
                Game.Inst.currentGameMgr.release(); 
            } else {
                 // stay
            }
        };
        rightBtnSet.closePanel = true;
        Game.Inst.utils.createMessageBox(
            Game.Inst.resourcesMgr.load("msgBg"),
            Game.Inst.resourcesMgr.load("msgTitleText"),
            Game.Inst.resourcesMgr.load("msgTitleBg"),
            text,
            rightBtnSet
        );
    }

    toLobby(){
        var url = window.location.href
        var arr = url.split("/");
        window.open(arr[0] + '//' + arr[2] + '/index.html', '_self');
    }
}
