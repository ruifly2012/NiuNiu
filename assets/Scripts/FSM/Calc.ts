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

        UIMgr.Inst.animMgr.playShowAllCardAnim(()=>{
            this.moneyFlow();
        });
    }

    public stateRelease(){

    }

    public stateUpdate(dt: number){
    }

    moneyFlow(){
        this.bankerWin(Define.GameInfo.Inst.bankerIndex);
        this.bankerLose(Define.GameInfo.Inst.bankerIndex);
    }

    bankerWin(bankerSeat: number){
        for(let index = 0;index < Define.GameInfo.Inst.playerCount;index++){
            //slip self
            if(index == bankerSeat) continue;
            //check really lose to banker
            let profit = Define.GameInfo.Inst.players[index].win_bet;
            if(profit < 0){
                UIMgr.Inst.players[index].moneyChange(profit,40);
                UIMgr.Inst.animMgr.playCoinFlow(index, bankerSeat, ()=>{
                    UIMgr.Inst.players[bankerSeat].setShiny();
                    UIMgr.Inst.players[bankerSeat].moneyChange(-profit,40);
                });
            }
        }
    }

    bankerLose(bankerSeat: number){
        for(let index = 0;index < Define.GameInfo.Inst.playerCount;index++){
            //slip self
            if(index == bankerSeat) continue;
            //check really lose to banker
            let profit = Define.GameInfo.Inst.players[index].win_bet;
            if(profit > 0){
                UIMgr.Inst.players[bankerSeat].moneyChange(-profit,40);
                UIMgr.Inst.animMgr.playCoinFlow(bankerSeat, index, ()=>{
                    UIMgr.Inst.players[index].setShiny();
                    UIMgr.Inst.players[index].moneyChange(profit,40);
                });
            }
        }
    }

    

}
