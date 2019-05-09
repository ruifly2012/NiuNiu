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

        UIMgr.Inst.animMgr.playCoinFlow(()=>{
            UIMgr.Inst.players[1].setShiny();
        });

        

    }

    public stateRelease(){

    }

    public stateUpdate(dt: number){
    }



}
