import StateBase from "../components/StateBase";
import * as Define from "../Define";
import Game from "../Game";
import UIMgr from "../UIMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Calc extends StateBase {

    @property({type:cc.Enum(Define.GameState),serializable:true})
    public state:Define.GameState = Define.GameState.Calc;

    onLoad(){
        
    }
    
    public stateInitialize(){
        cc.warn("calc!!!");

        //delay time for allkill anime
        let delay: number = 0;



        UIMgr.Inst.animMgr.playShowAllCardAnim(()=>{
            if(this.isAllKill()) {
                this.allKill();
                delay = 3;
                //cc.warn("delay");
            }
            this.scheduleOnce(()=>{
                //cc.warn("money");
                this.moneyFlow(()=>{
                    if(Define.GameInfo.Inst.players[0].win_bet > 0)
                        this.victory();
                    this.scheduleOnce(()=>this.m_FSM.setState(Define.GameState.End),0.5);
                });
                
            }, delay);
            
        });
    }

    public stateRelease(){

    }

    public stateUpdate(dt: number){
    }

    //check show all kill or not
    isAllKill() : boolean{
        //show anyway if only 2 player
        if(Define.GameInfo.Inst.playerCount == 2)
            return true;
        //check if banker win all the other
        for(let index = 0;index < Define.GameInfo.Inst.playerCount;index++){
            //skip self
            if(index == Define.GameInfo.Inst.bankerIndex) continue;
            //check all kill
            let profit = Define.GameInfo.Inst.players[index].win_bet;
            if(profit > 0){
                //cc.log("not all kill by player"+index);
                return false;
            }
        }
        return true;
    }

    //show banker get and then banker give
    moneyFlow(callback?){
        this.bankerWin(Define.GameInfo.Inst.bankerIndex);
        this.scheduleOnce(()=>this.bankerLose(Define.GameInfo.Inst.bankerIndex),1.5);
        this.scheduleOnce(()=>this.showMoneyResult(),3);
        this.scheduleOnce(()=>callback(),4);
    }

    bankerWin(bankerSeat: number){
        //cc.log("win, count = "+Define.GameInfo.Inst.playerCount);
        for(let index = 0;index < Define.GameInfo.Inst.playerCount;index++){
            //skip self
            if(index == bankerSeat) continue;
            //check really lose to banker
            let profit = Define.GameInfo.Inst.players[index].win_bet;
            //cc.log("player"+index+"profit"+profit);
            if(profit < 0){
                //UIMgr.Inst.players[index].moneyChange(profit,40,Define.GameInfo.Inst.players[index].final_coin);
                UIMgr.Inst.animMgr.playCoinFlow(index, bankerSeat, ()=>{
                    UIMgr.Inst.players[bankerSeat].setShiny();
                    //UIMgr.Inst.players[bankerSeat].moneyChange(-profit,40,Define.GameInfo.Inst.players[bankerSeat].final_coin );
                });
            }
        }
    }

    bankerLose(bankerSeat: number){
        //cc.log("lose, count = "+Define.GameInfo.Inst.playerCount);
        for(let index = 0;index < Define.GameInfo.Inst.playerCount;index++){
            //skip self
            if(index == bankerSeat) continue;
            //check really lose to other
            let profit = Define.GameInfo.Inst.players[index].win_bet;
            //cc.log("player"+index+"profit"+profit);
            if(profit > 0){
                //UIMgr.Inst.players[bankerSeat].moneyChange(-profit,40, Define.GameInfo.Inst.players[bankerSeat].final_coin);
                UIMgr.Inst.animMgr.playCoinFlow(bankerSeat, index, ()=>{
                    UIMgr.Inst.players[index].setShiny();
                    //UIMgr.Inst.players[index].moneyChange(profit,40, Define.GameInfo.Inst.players[index].final_coin);
                });
            }
        }
    }

    showMoneyResult(){
        for(let index = 0;index < Define.GameInfo.Inst.playerCount;index++){
            UIMgr.Inst.players[index].moneyChange(Define.GameInfo.Inst.players[index].win_bet,40, Define.GameInfo.Inst.players[index].final_coin);
        }    
    }

    allKill(){
        UIMgr.Inst.animMgr.playAllKill();
    }

    victory(){
        UIMgr.Inst.animMgr.playVictory();
    }

    

}
