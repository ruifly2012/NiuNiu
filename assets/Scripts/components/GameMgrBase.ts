import Game from "../Game";
import { GameState } from "../MainStateMgr";
import FSM from "./FSM";
import StateBase from "./StateBase";

const { ccclass, property } = cc._decorator;

/**
 * 遊戲管理物件基底
 */
@ccclass
export default abstract class GameMgrBase extends cc.Component {

    /**狀態機 */
    private _FSM: FSM = null;

    /**取得當前狀態機 */
    public get FSM(): FSM {
        return this._FSM;
    }

    /**是否自動離開 */
    isAutoLeave: boolean = false;
    /**確認是否成功加入遊戲 */
    joinGameComplete: boolean = false;

    onLoad() {
        if (!Game.Inst.init) {
            Game.Inst.mainStateMgr.changeStage(GameState.Start);
            return;
        }
        Game.Inst.utils.resize();
    }

    // use this for initialization
    init() {
        this._FSM = new FSM();
        Game.Inst.currentGameMgr = this;
    }

    update(dt: number) {
        if (!this.joinGameComplete) {
            this.startStateMachine();
            this.connectServer();
            this.joinGameComplete = true;
        }
        this._FSM.update(dt);
    }

    onDestroy(){
        this.quitGame();
    }

    /**重新啟動遊戲 */
    restartGame(){
        this.joinGameComplete = false;
    }

    /**離開遊戲大廳並關閉網路連線 */
    leaveGameLobby(){
        this._FSM.release();
        Game.Inst.networkMgr.disconnect();
        Game.Inst.mainStateMgr.changeStage(GameState.Start);
    }

    /**啟動StateMachine */
    abstract startStateMachine();

    /**當玩家點擊離開按鈕時觸發 */
    abstract quitBtnClick();
    
    /**當網路連線成功時 */
    abstract connectServerComplete();
    
    /**當網路連線中斷時 */
    abstract disconnectServer();

    /**當重新開始遊戲時 */
    abstract onRestartGame();

    /**離開遊戲時 */
    abstract quitGame();

    /**與Server進行連線 */
    connectServer() {
        Game.Inst.networkMgr.connect(
            // establish connection callback
            (evt) => {
                this.connectServerComplete();
            },
            // close connection callback
            (evt) => {
                cc.log("websocket close");
                this.disconnectServer();
            });
    }

    /**收到遊戲結束指令 */
    receiveGameEndResponse(content: any) {
        this.leaveGameLobby();
    }

    /**確認是否強制離開遊戲 */
    sendAutoLeave(enable: boolean) {
        cc.warn("sendAutoLeave: " + enable);
        if (enable) {
            this.leaveGameLobby();
        }
    }
}
