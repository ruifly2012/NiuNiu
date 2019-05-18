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
        cc.warn("rob!!!");
         //init playerPoker
        this.playStartGameAnim();
        UIMgr.Inst.showRobBet(true);
        this.startCountDown();
        this.registerTimeSync();
        //listen change stage event
        Game.Inst.EventListener.on("gotoPlaceBet",()=>{
            this.m_FSM.setState(Define.GameState.PlaceBet);
        })
    }

    public stateRelease(){
        Game.Inst.EventListener.off("gotoPlaceBet");
        Game.Inst.EventListener.off("getTime");
        UIMgr.Inst.showRobBet(false);
        UIMgr.Inst.stopClock();
        UIMgr.Inst.players.forEach(element => {
            element.hideStatus();
        });
    }

    public stateUpdate(dt: number){
    }

    playStartGameAnim(){
        UIMgr.Inst.animMgr.playStartGame(()=>{
            //after start game
            cc.log("start game !");
        });
    }

    startCountDown() {
        let self = this;
        UIMgr.Inst.setClockAct(5, ()=>{
            self.m_FSM.setState(Define.GameState.PlaceBet);
        });
    }

    /**
     * 搶莊
     * @param event 
     * @param customData rate
     */
    robBetClick(event, customData: number){
        cc.warn("[rob_bet]click"+customData);
        Game.Inst.networkMgr.rob_bet(customData);
        UIMgr.Inst.showRobBet(false);
        UIMgr.Inst.players[0].setStatus(Define.BetType.RobBet,customData);
    }

    /**sync time with server */
    registerTimeSync(){
        Game.Inst.EventListener.on("getTime",(data)=>{
            if(data.stage == Define.GameState.RobBet){
                // cc.warn("update time : " + data.time);
                UIMgr.Inst.clock.countDown = data.time;
            }
        })
    }

}
