import TWAnimMgr from "./AnimMgr";
import Player from "./components/Player";
import * as Define from "./Define";
import Game from "./Game";
import Clock from "./components/Clock";

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

    @property(Clock)
    clock: Clock = null;

    private waiting: cc.Node;

    private rob_bet: cc.Node;
    private place_bet: cc.Node;
    private choose_card: cc.Node;
    
    

    onLoad() {
        UIMgr.instance = this;
        this.waiting = this.gameUI.children[0];
        this.rob_bet = this.gameUI.children[1];
        this.place_bet = this.gameUI.children[2];
        this.choose_card = this.gameUI.children[3];
        
        

        Game.Inst.EventListener.on("RobBetInfo",function(evt,data){
            UIMgr.Inst.receiveRobBetInfo(data);
        })
    }

    getPlayerByUID(UID: string): Player{
        for(let index = 0;index < Define.GameInfo.Inst.playerCount;index++){
            if(Define.GameInfo.Inst.players[index].UID == UID)
                return this.players[index];
        }
        return undefined;
    }

    showWaiting(active: boolean = false){
        this.waiting.active = active;
    }

    showRobBet(active: boolean = false){
        this.rob_bet.active = active;
    }

    showPlaceBet(active: boolean = false){
        this.place_bet.active = active;
    }

    showChooseCard(active: boolean = false){
        this.choose_card.active = active;
        cc.warn("[UI]choose " + active);
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

    /**
     * clset clock
     * @param time time
     */
    setClockAct(time: number, callback?) {
        cc.log("start clock");
        this.clock.init();
        this.clock.startCountDown(time, callback)
    }


    stopClock(){
        this.clock.init();
    }

}
