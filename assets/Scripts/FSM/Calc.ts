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
           this.moneyFlow();
           UIMgr.Inst.animMgr.playCardTypeAnim(Define.CardType.smallCow);
        });
    }

    public stateRelease(){

    }

    public stateUpdate(dt: number){
    }

    moneyFlow(){
        UIMgr.Inst.animMgr.playCoinFlow(()=>{
            UIMgr.Inst.players[1].setShiny();
        });
    }



}
