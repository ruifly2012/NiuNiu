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
            cc.log("afterShowAll");
           this.playCardTypeAnim(0, ()=>{
            this.moneyFlow();
           });
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
                UIMgr.Inst.players[index].moneyChange(profit);
                UIMgr.Inst.animMgr.playCoinFlow(index, bankerSeat, ()=>{
                    UIMgr.Inst.players[bankerSeat].setShiny();
                    UIMgr.Inst.players[bankerSeat].moneyChange(-profit);
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
                UIMgr.Inst.players[bankerSeat].moneyChange(-profit);
                UIMgr.Inst.animMgr.playCoinFlow(bankerSeat, index, ()=>{
                    UIMgr.Inst.players[index].setShiny();
                    UIMgr.Inst.players[index].moneyChange(profit);
                });
            }
        }
    }

    playCardTypeAnim(seat: number, callback?){
        cc.log("card type anime");
        cc.log(Define.GameInfo.Inst.players[seat].cardType);
        Define.GameInfo.Inst.players[seat].cardType = Define.CardType.smallCow;
        UIMgr.Inst.animMgr.playCardTypeAnim(Define.GameInfo.Inst.players[seat].cardType, callback);
    }

}
