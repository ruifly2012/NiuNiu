import GameMgrBase from "./components/GameMgrBase";
import Game from "./Game";
import * as Define from "./Define";
import { ButtonSetting } from "./components/MessageBoxCtr";
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
        if (Define.GameInfo.Inst.endGame == true){
            Game.Inst.EventListener.clear();
            cc.director.loadScene("scene_start");
        }
        else{
            let BtnSet: ButtonSetting = new ButtonSetting();
            BtnSet.originBtnBackground = Game.Inst.resourcesMgr.load("btnconfirmO");
            BtnSet.originBtnText = Game.Inst.resourcesMgr.load("txtconfirmO");
            BtnSet.clickedBtnBackground = Game.Inst.resourcesMgr.load("btnconfirmC");
            BtnSet.clickedBtnText = Game.Inst.resourcesMgr.load("txtconfirmC");
            BtnSet.closePanel = true;

            Game.Inst.utils.createMessageBox(
                Game.Inst.resourcesMgr.load("msgBg"),
                Game.Inst.resourcesMgr.load("msgTitleText"),
                Game.Inst.resourcesMgr.load("msgTitleBg"),
                "游戏进行中无法离开!\n请待结束后退出",
                BtnSet);

        }

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
