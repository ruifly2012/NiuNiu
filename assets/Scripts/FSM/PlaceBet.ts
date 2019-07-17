import StateBase from "../components/StateBase";
import * as Define from "../Define";
import Game from "../Game";
import UIMgr from "../UIMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlaceBet extends StateBase {

    @property({type:cc.Enum(Define.GameState),serializable:true})
    public state:Define.GameState = Define.GameState.PlaceBet;

    onLoad(){
        
    }
    
    public stateInitialize(){
        cc.warn("place bet!!!");

        UIMgr.Inst.players.forEach(element => {
            element.hideStatus();
        });
        if(Define.GameInfo.Inst.bankerIndex != 0){
            UIMgr.Inst.showPlaceBet(true);
        }
        this.startCountDown();
       
        //change to correct rate
        UIMgr.Inst.BetUIMgr.activate();
    }

    public stateRelease(){
        UIMgr.Inst.showPlaceBet(false);
        UIMgr.Inst.stopClock();
    }
    
    public stateUpdate(dt: number){
    }

    startCountDown() {
        UIMgr.Inst.setClockAct(Define.GameInfo.Inst.remainTime, ()=>{
            if(Define.GameInfo.Inst.bankerIndex != 0){
                /*
                //not tell server ==> other player cannot see
                UIMgr.Inst.BetUIMgr.autoClick();
               */
                //tell server ==> goto next stage immediate ==> almost can't show
                UIMgr.Inst.BetUIMgr.placeBetClick(event,0, false);
            }

            UIMgr.Inst.stopClock();
        });
    }

}
