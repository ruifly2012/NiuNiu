import StateBase from "../components/StateBase";
import * as Define from "../Define";
import Game from "../Game";
import UIMgr from "../UIMgr";
import { GameState } from "../MainStateMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class End extends StateBase {

    @property({type:cc.Enum(Define.GameState),serializable:true})
    public state:Define.GameState = Define.GameState.End;

    onLoad(){
        
    }
    
    public stateInitialize(){
        cc.warn("END!!!");
        UIMgr.Inst.continueBtn.active = true;
        Define.GameInfo.Inst.endGame = true
    }

    public stateRelease(){

    }

    public stateUpdate(dt: number){
    }
    
    continuePress(){
        cc.warn("continue press");
        Game.Inst.mainStateMgr.changeStage(GameState.Loading);
    }
}
