import StateBase from "../components/StateBase";
import * as Define from "../Define";
import Game from "../Game";
import UIMgr from "../UIMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RobBet extends StateBase {

    @property({type:cc.Enum(Define.GameState),serializable:true})
    public state:Define.GameState = Define.GameState.RobBet;

    onLoad(){
        
    }
    
    public stateInitialize(){
        
         //init playerPoker
        this.playStartGameAnim();
    }

    public stateRelease(){
        
    }
    public stateUpdate(dt: number){
    }

    playStartGameAnim(){
        UIMgr.Inst.animMgr.playStartGame(()=>{
            //after start game
            cc.log("start game !");
        });
    }

    startCountDoen() {
        //啟動clock

    }

    // stopPokerHover(){
    //     TWUIMgr.Inst.animMgr.stopPokerHover();
    //     this.m_FSM.setState(TW.TWGameState.SortCard);
    // }
}
