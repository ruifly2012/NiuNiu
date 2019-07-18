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
        Game.Inst.networkMgr.registerEvent("websocket", (msg) => { this.receiveServerConnect(msg); });
        Game.Inst.networkMgr.registerEvent("time_info", (msg) => { this.receiveTimeInfo(msg); });
        /*
        Game.Inst.networkMgr.registerEvent("recover", (msg) => { this.receiveServerRecorver(msg); });
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
            if (nowState == Define.GameState.Waiting || nowState == Define.GameState.GrabBanker || nowState == Define.GameState.PlaceBet || nowState == Define.GameState.PlayCard) {
                this.schedule(this.reconnectCallBack, 0.5);
            }
        }
    }

    onRestartGame() {
    }

    quitGame() {
        Game.Inst.networkMgr.unregisterEvent("websocket");
        Game.Inst.networkMgr.unregisterEvent("matching");
        Game.Inst.networkMgr.unregisterEvent("init_info");
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

    /**
     * 收到stage初始時間
     * @param msg 
     */
    receiveTimeInfo(msg: Define.TimeBroadcast) {
        cc.log(msg);
        //update remain time
        Define.GameInfo.Inst.remainTime = msg.seconds;
        cc.log("set clock time " + msg.seconds);
        switch(msg.cur_state){
            case "grab_banker_state":
                cc.log("switch to grab_banker_state");
                this.FSM.setState(Define.GameState.GrabBanker);
                break;
            case "bet_state":
                cc.log("switch to PlaceBet");
                this.FSM.setState(Define.GameState.PlaceBet);
                break;
            case "play_card_state":
                cc.log("switch to PlayCard");
                this.FSM.setState(Define.GameState.PlayCard);
                break;    
        }
        
    }

}
