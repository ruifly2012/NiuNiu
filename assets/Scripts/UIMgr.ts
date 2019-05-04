import TWAnimMgr from "./AnimMgr";
import Player from "./components/Player";
import * as Define from "./Define";
import Game from "./Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIMgr extends cc.Component {

    private static instance: UIMgr;

    /**
     * 取得遊戲主控端
     */
    static get Inst(): UIMgr {
        if (!UIMgr.instance) {
            return undefined;
        }
        return this.instance;
    }

    @property(TWAnimMgr) animMgr: TWAnimMgr = null;

    @property([Player]) players: Player[] = [];

    @property(cc.Node)
    gameUI: cc.Node = null;

    private waiting: cc.Node;

    onLoad() {
        UIMgr.instance = this;
        this.waiting = this.gameUI.children[0];

        Game.Inst.EventListener.on("RobBetInfo",function(evt,data){
            UIMgr.Inst.receiveRobBetInfo(data);
        })
    }

    showWaiting(active: boolean = false){
        this.waiting.active = active;
    }

    isPlayersActive(active: boolean = false){
        this.players.forEach(element => {
            element.node.active = active;
        });
    }


    initPlayerInfo() {
        let gameInfo: Define.GameInfo = Define.GameInfo.Inst;
        for (let i = 0; i < gameInfo.playerCount; i++) {
            cc.log("init"+i+"player");
            this.players[i].init(gameInfo.players[i].name,"headIcon" + gameInfo.players[i].iconID,gameInfo.players[i].money);
        }
    }

    receiveRobBetInfo(data){
        cc.warn("RobBet"+JSON.stringify(data));
        Define.RoomInfo.Inst.assign(data.room);
        Define.GameInfo.Inst.players[0].assign(data.main_player);
        //get other player data
        let playerIndex = 0;
        for (let _key in data.players) {
            playerIndex++;
            Define.GameInfo.Inst.players[playerIndex].assign(data.players[_key]);
        }
        UIMgr.Inst.initPlayerInfo();
    }
}
