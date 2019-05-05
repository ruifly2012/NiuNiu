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

}
