import GameMgrBase from "./components/GameMgrBase";
import Game from "./Game";
import * as Define from "./Define";
import UIMgr from "./UIMgr";
import NetworkMgr from "./NetworkManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMgr extends GameMgrBase 
{
    start() 
    {
        this.init();

        //Game.Inst.networkMgr.registerEvent("gameInfo", (msg) => { this.receiveUpdate(msg); });
    }

    startStateMachine() {
        this.FSM.setState(Define.GameState.Waiting);
        //生成GameInfo物件
    }

    quitBtnClick() 
    {
        cc.log("QUIT");
        Game.Inst.EventListener.clear();
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
