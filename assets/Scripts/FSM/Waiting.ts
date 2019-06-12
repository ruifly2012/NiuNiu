import StateBase from "../components/StateBase";
import Game from "../Game";
import Converter, * as Define from "../Define";
import MiscHelper from "../MiscHelper";
import UIMgr from "../UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Waiting extends StateBase {

    @property({ type: cc.Enum(Define.GameState), serializable: true })
    public state: Define.GameState = Define.GameState.Waiting;

    onLoad() {
        let self = this;
        Game.Inst.EventListener.on("startGame",()=>{
            //hide msg box
            Game.Inst.utils.hideAllMessageBox();
            //goto rob bet
            self.m_FSM.setState(Define.GameState.RobBet);
        });

    }

    public stateInitialize() {
        this.initGame();
        // get table
        Game.Inst.networkMgr.ConnectServer();
        //show waiting UI & hide other player
        UIMgr.Inst.showWaiting();
        UIMgr.Inst.isPlayersActive(false);
        //UIMgr.Inst.players[0].node.active = true;
        
        // //send game ask
        // Game.Inst.networkMgr.getGameTable();
    }

    public stateRelease() {
    }
    public stateUpdate(dt: number) {
    }

    /**init game */
    initGame(){
        //init player
        let playerCount = 5;
        //generate player
        let gameInfo: Define.GameInfo = Define.GameInfo.Inst;
        gameInfo.playerCount = playerCount;
        for (let index = 0; index < playerCount; index++) {
            gameInfo.players.push(new Define.Player());
        }
        //GameInfo init
        Define.GameInfo.Inst.endGame = false;
        Define.GameInfo.Inst.rob_list = [];
    }

    

}
