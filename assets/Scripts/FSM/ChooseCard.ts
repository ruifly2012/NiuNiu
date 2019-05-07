import StateBase from "../components/StateBase";
import * as Define from "../Define";
import Game from "../Game";
import UIMgr from "../UIMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChooseCard extends StateBase {

    @property({type:cc.Enum(Define.GameState),serializable:true})
    public state:Define.GameState = Define.GameState.ChooseCard;

    onLoad(){
        
    }
    
    public stateInitialize(){
        cc.warn("choose card!!!");
        this.startCountDown();
        //test
        UIMgr.Inst.animMgr.playDistributePoker(()=>{
            UIMgr.Inst.showChooseCard(true);
        });
    }

    public stateRelease(){
        UIMgr.Inst.stopClock();
    }
    public stateUpdate(dt: number){
    }

    startCountDown() {
        //啟動clock
        UIMgr.Inst.setClockAct(12);
    }

    playDistribute(callback?){
        UIMgr.Inst.animMgr.playDistributePoker(callback);
    }

}
