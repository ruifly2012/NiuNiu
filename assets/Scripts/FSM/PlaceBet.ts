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
         //init playerPoker
        Game.Inst.EventListener.on("startBet",()=>{
            UIMgr.Inst.showPlaceBet(true);
            this.startCountDown();
            this.registerTimeSync();
        })
        //listen change stage
        Game.Inst.EventListener.on("gotoChooseCard",()=>{
            this.m_FSM.setState(Define.GameState.ChooseCard);
        })
    }

    public stateRelease(){
        Game.Inst.EventListener.clear();
        UIMgr.Inst.showPlaceBet(false);
        UIMgr.Inst.stopClock();
        UIMgr.Inst.players.forEach(element => {
            element.hideStatus();
        });

    }
    public stateUpdate(dt: number){
    }

    startCountDown() {
        let self = this;
        //啟動clock
        UIMgr.Inst.setClockAct(5, ()=>{
            self.m_FSM.setState(Define.GameState.ChooseCard)
        });
    }

    placeBetClick(event, customData: number){
        cc.warn("[place_bet]click"+customData);
        Game.Inst.networkMgr.place_bet(customData);
        UIMgr.Inst.showPlaceBet(false);
        UIMgr.Inst.players[0].setStatus(Define.BetType.PlaceBet,customData);
    }

    registerTimeSync(){
        Game.Inst.EventListener.on("getTime",function(event,data){
            if(data.stage == Define.GameState.PlaceBet){
                // cc.warn("update time : " + data.time);
                UIMgr.Inst.clock.countDown = data.time;
            }
        })
    }

}
