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
        UIMgr.Inst.showGrabBet(true);
        this.startCountDown();
    }

    public stateRelease(){
        UIMgr.Inst.showGrabBet(false);
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
        cc.log("clock set" + Define.GameInfo.Inst.remainTime);
        UIMgr.Inst.setClockAct(Define.GameInfo.Inst.remainTime, ()=>{
            UIMgr.Inst.showGrabBet(false);
            UIMgr.Inst.stopClock();
        });
    }

    /**
     * 搶莊
     * @param event 
     * @param customData rate *use string and cast to number later, or will become type string
     */
    robBetClick(event, customData: string){
        let rate: number = parseInt(customData);
        this.choosed = true;
        cc.warn("[rob_bet]click"+rate);

        this.sendRobRate(rate);
        
        UIMgr.Inst.showGrabBet(false);
        UIMgr.Inst.players[0].setStatus(Define.BetType.RobBet,rate);
        
        if(rate != 0)
            Define.GameInfo.Inst.rob_list.push(0);
    }

    sendRobRate(rate : number){
        let data= {
            "event" : "grab_banker",
            "grab_rate" : rate
        };
        Game.Inst.networkMgr.sendMessage(data);
    }


}
