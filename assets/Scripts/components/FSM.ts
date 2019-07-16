import StateBase from "./StateBase";

/**Finite State Machine*/
export default class FSM {
    /**目前的State */
    private m_CurrentState: number = 0;
    /**目前使用的State物件 */
    private m_ActiveState: StateBase = null;
    /**State物件列表 */
    private m_StateList: Array<StateBase> = null;
    /**StateID列表 */
    private m_StateIDList: Array<number> = null;
    /**State列表長度 */
    private m_StateListLength: number = 0;

    constructor() {
        this.m_StateList = [];
        this.m_StateIDList = [];
        this.m_StateListLength = 0;
    }

    get activeState(): StateBase{
        return this.m_ActiveState;
    }

    /**動態新增新的State */
    addState(stateID: number, state: StateBase): boolean {
        if (this.m_StateList[stateID] != null) {
            cc.error("This stateID have state already!");
            return false;
        }
        this.m_StateIDList[this.m_StateListLength++] = stateID;
        this.m_StateList[stateID] = state;

        state.onLoadInit(this);

        console.log("add " + stateID.toString() + " finish");
    }

    /**釋放FSM資源 */
    release() {
        if (this.m_ActiveState != null) this.m_ActiveState.stateRelease();
        this.m_ActiveState = null;

        for (let i: number = 0; i < this.m_StateListLength; i++) {
            this.m_StateList[this.m_StateIDList[i]] = null;
        }
        this.m_StateList = null;
        this.m_StateIDList = null;
        this.m_StateListLength = 0;
    }

    /**
     * FSM的更新 更新目前啟動的State
     * @param dt 更新間格時間(毫秒)
     */
    update(dt: number) {
        if (this.m_ActiveState != null) {
            this.m_ActiveState.stateUpdate(dt);
        }
    }
    /**
     * 設定FSM的State
     * @param stateid 要設定的StateID
     */
    setState(stateid: any) {
        //如果當前State存在 釋放當前State
        if (this.m_ActiveState != null) {
            this.m_ActiveState.stateRelease();
            this.m_ActiveState.isActive = false;
            this.m_ActiveState = null;
        }
        //如果當前Scene存在 釋放當前Scene 之後重設當前Scene
        //確認要轉換的State存在於m_StateList
        if (this.m_StateList[stateid] != undefined) {
            cc.log("[FSM] Transit to " + stateid.toString());
            this.m_ActiveState = this.m_StateList[stateid as number];
            this.m_ActiveState.isActive = true;
            this.m_ActiveState.stateInitialize();
        }
        else {
            cc.error("[FSM] Transit is failed " + stateid.toString());
        }
    }
}
