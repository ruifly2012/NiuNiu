import StateBase from "../components/StateBase";
import * as Define from "../Define";
import Game from "../Game";
import UIMgr from "../UIMgr";
import { GameState } from "../MainStateMgr";

const {ccclass, property} = cc._decorator;



@ccclass
export default class End extends StateBase {

    @property({type:cc.Enum(Define.GameState),serializable:true})
    public state:Define.GameState = Define.GameState.End;
    onLoad(){
        
    }
    
    public stateInitialize(){
        cc.warn("END!!!");
        UIMgr.Inst.continueBtn.active = true;
        Define.GameInfo.Inst.endGame = true
    }

    public stateRelease(){

    }

    public stateUpdate(dt: number){
    }
    
    continuePress(){
        //確認當前玩家資產足以在玩下一局
        let gameInfo: Define.GameInfo = Define.GameInfo.Inst;
        for (let i = 0; i < gameInfo.players.length; i++) {
            if (gameInfo.players[i].UID == gameInfo.myUID) {
                if (gameInfo.players[i].final_coin < gameInfo.coinsLimit) {
                    cc.log("current money : "+gameInfo.players[i].final_coin + ", limit : "+ gameInfo.coinsLimit);
                    //不夠則顯示MessageBox提示
                    UIMgr.Inst.onMoneyNotEnoughToBet();
                }
                else {
                    //足夠則重啟遊戲
                    // Game.Inst.currentGameMgr.restartGame();
                    Define.GameInfo.Inst.endGame = false;
                    Game.Inst.mainStateMgr.changeStage(GameState.Loading);
                }
            }
        }
    }
}
