import GameMgrBase from "./components/GameMgrBase";
import Game from "./Game";
import * as Define from "./Define";
import { ButtonSetting } from "./components/MessageBoxCtr";
import UIMgr from "./UIMgr";
import NetworkMgr from "./NetworkManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMgr extends GameMgrBase {
    private reconnectCallBack: Function;
    start() {
        this.init();
        /*
        Game.Inst.networkMgr.registerEvent("websocket", (msg) => { this.receiveServerConnect(msg); });
        Game.Inst.networkMgr.registerEvent("websocket", (msg) => { this.receiveServerRecorver(msg); });
        Game.Inst.networkMgr.registerEvent("recover", (msg) => { this.receiveServerError(msg); });
        Game.Inst.networkMgr.registerEvent("recover_info", (msg) => { this.receiveRecoverInfo(msg); });
    */
        this.reconnectCallBack = () => {
            cc.log("websocket reconnecting...");
            this.connectServer();
        };
    }

    startStateMachine() {
        this.FSM.setState(Define.GameState.Waiting);
        //BGM
        UIMgr.Inst.AudioMgr.playBGM();
    }

    quitBtnClick() {
        cc.log("QUIT");
        if (Define.GameInfo.Inst.endGame == true){
            Game.Inst.EventListener.clear();
            let data = sessionStorage.getItem("key");
            if (data != null){
                var url = window.location.href
                var arr = url.split("/");
                window.open(arr[0] + '//' + arr[2] + '/index.html','_self');
            }
            else{
                cc.director.loadScene("scene_start");
            }
        }
        else{
            UIMgr.Inst.showCantQuitMsg();
        }

    }

    
    connectServerComplete() {
        this.unschedule(this.reconnectCallBack);
    }

    disconnectServer() {
        //if not game over , reconnect.
        if (this.FSM != null) {
            let nowState: Define.GameState = this.FSM.activeState.state;
            if (nowState == Define.GameState.Waiting || nowState == Define.GameState.RobBet || nowState == Define.GameState.PlaceBet || nowState == Define.GameState.ChooseCard) {
                this.schedule(this.reconnectCallBack, 0.5);
            }
        }
    }

    onRestartGame() {
    }

    quitGame() {
        Game.Inst.networkMgr.unregisterEvent("websocket");
        Game.Inst.networkMgr.unregisterEvent("matching");
        /*
        Game.Inst.networkMgr.unregisterEvent("recover");
        Game.Inst.networkMgr.unregisterEvent("init_info");
        Game.Inst.networkMgr.unregisterEvent("deal_cards");
        Game.Inst.networkMgr.unregisterEvent("set_selected");
        Game.Inst.networkMgr.unregisterEvent("game_results");
        Game.Inst.networkMgr.unregisterEvent("server_error");
        Game.Inst.networkMgr.unregisterEvent("recover_info");
        */
        cc.log("End");
    }

    // protocol

    /**
     * 收到連線成功Respone
     * @param msg 
     */
    receiveServerConnect(msg: Define.WebSocketResp) {
        if (!msg.success) {
            cc.error("[TWGameMgr] Websocket connect fail!");
        }
    }

    /**
     * 收到斷線重連Respone
     * @param msg 
     */
    receiveServerRecorver(msg) {
    }

    /**
     * 收到連線錯誤Respone
     * @param msg 
     */
    receiveServerError(msg) {
    }


    changeState(event, customEventData) {
        switch (customEventData) {
            case "0":
                this.FSM.setState(Define.GameState.Waiting);
                break;
            case "1":
                this.FSM.setState(Define.GameState.RobBet);
                break;
            case "2":
                this.FSM.setState(Define.GameState.PlaceBet);
                break;
        }
    }



}
