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
            UIMgr.Inst.chooseCardUIMgr.activate();
        });
        this.registerTimeSync();
    }

    public stateRelease(){
        Game.Inst.EventListener.clear();
        UIMgr.Inst.stopClock();
        UIMgr.Inst.chooseCardUIMgr.unRegClickEvent();
    }
    public stateUpdate(dt: number){
    }

    startCountDown() {
        //啟動clock
        UIMgr.Inst.setClockAct(15);
    }

    playDistribute(callback?){
        UIMgr.Inst.animMgr.playDistributePoker(callback);
    }

    registerTimeSync(){
        Game.Inst.EventListener.on("getTime",function(event,data){
            if(data.stage == Define.GameState.ChooseCard){
                // cc.warn("update time : " + data.time);
                UIMgr.Inst.clock.countDown = data.time;
            }
        })
    }

}
