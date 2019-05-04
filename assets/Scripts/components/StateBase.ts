import FSM from "./FSM";
import Game from "../Game";

export default abstract class StateBase extends cc.Component{
    /**狀態機實體 */
    protected m_FSM:FSM = null;
    /**狀態機編號 */
    public abstract state;
    /**狀態機是否啟動 */
    public isActive:boolean = false;

    start(){
        Game.Inst.currentGameMgr.FSM.addState(this.state,this);
    }

    /**初始化主狀態機 */
    public onLoadInit(fsm:FSM){
        this.m_FSM = fsm;
    }

    /**狀態機初始化 */
    public abstract stateInitialize();
    /**釋放狀態機 */
    public abstract stateRelease();
    /**更新狀態機 */
    public abstract stateUpdate(dt: number);

    //Command handle
    
}
