import StateBase from "../components/StateBase";
import * as Define from "../Define";
import Game from "../Game";
import UIMgr from "../UIMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RobBet extends StateBase {

    @property({type:cc.Enum(Define.GameState),serializable:true})
    public state:Define.GameState = Define.GameState.RobBet;

    private choosed: boolean = false;
    onLoad(){
        
    }
    
    public stateInitialize(){
        cc.warn("rob!!!");
         //init playerPoker
        this.playStartGameAnim(()=>{
            UIMgr.Inst.showRobBet(true);
            this.startCountDown();
            this.registerTimeSync();
        });
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
    }

    public stateUpdate(dt: number){
    }

    playStartGameAnim(callback?){
        UIMgr.Inst.animMgr.playStartGame(()=>{
            if(callback != undefined){
                callback();
            }
            //after start game
            cc.log("start game !");
        });
    }

    startCountDown() {
        UIMgr.Inst.setClockAct(2, ()=>{
            if(!this.choosed){
                cc.log("auto rob");
                
                //not tell server ==> other player cannot see
                UIMgr.Inst.players[0].setStatus(Define.BetType.RobBet,0);

                /*
                //tell server ==> goto next stage immediate ==> almost can't show
                this.robBetClick(event,0);
                */
            }
            this.m_FSM.setState(Define.GameState.PlaceBet);
        });
    }

    /**
     * 搶莊
     * @param event 
     * @param customData rate
     */
    robBetClick(event, customData: number){
        this.choosed = true;
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
