import StateBase from "../components/StateBase";
import * as Define from "../Define";
import Game from "../Game";
import UIMgr from "../UIMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RobBet extends StateBase {



    @property({type:cc.Enum(Define.GameState),serializable:true})
    public state:Define.GameState = Define.GameState.GrabBanker;

    private choosed: boolean = false;

    onLoad(){
    }
    
    public stateInitialize(){
        cc.warn("rob!!!");
        this.playStartGameAnim(()=>{
            UIMgr.Inst.showRobBet(true);
            this.startCountDown();
            this.registerTimeSync();
        });
    }

    public stateRelease(){
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
        UIMgr.Inst.setClockAct(Define.GameInfo.Inst.remainTime, ()=>{
            if(!this.choosed){
                cc.log("auto rob");
                
                /*
                //not tell server ==> other player cannot see
                UIMgr.Inst.players[0].setStatus(Define.BetType.RobBet,0);
                */

                //tell server ==> goto next stage immediate ==> almost can't show
                this.robBetClick(event,"0", false);
            }
            UIMgr.Inst.stopClock();
            //this.m_FSM.setState(Define.GameState.PlaceBet);
        });
    }

    /**
     * 搶莊
     * @param event 
     * @param customData rate *use string and cast to number later, or will become type string
     */
    robBetClick(event, customData: string, send2Server: boolean = true){
        let rate: number = parseInt(customData);
        this.choosed = true;
        cc.warn("[rob_bet]click"+rate);

        if(send2Server) 
            this.sendRobRate(rate);
        
        UIMgr.Inst.showRobBet(false);
        UIMgr.Inst.players[0].setStatus(Define.BetType.RobBet,rate);
        
        if(rate != 0)
            Define.GameInfo.Inst.rob_list.push(0);
    }

    /**sync time with server */
    registerTimeSync(){
        Game.Inst.EventListener.on("getTime",(data)=>{
            if(data.stage == Define.GameState.GrabBanker){
                // cc.warn("update time : " + data.time);
                UIMgr.Inst.clock.countDown = data.time;
            }
        })
    }

    sendRobRate(rate : number){
        let data= {
            "event" : "grab_banker",
            "grab_rate" : rate
        };
        Game.Inst.networkMgr.sendMessage(data);
    }


}
