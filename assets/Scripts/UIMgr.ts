import AnimMgr from "./AnimMgr";
import Player from "./components/Player";
import * as Define from "./Define";
import Game from "./Game";
import Clock from "./components/Clock";
import CardUIMgr from "./UI/CardUIMgr";
import CardStatusUIMgr from "./UI/CardStatusUIMgr";
import BetUIMgr from "./UI/BetUIMgr";
import RoomInfo from "./UI/RoomInfo";
import MiscHelper from "./MiscHelper";

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

    @property(AnimMgr) animMgr: AnimMgr = null;

    @property(CardUIMgr) cardUIMgr: CardUIMgr = null;

    @property(CardStatusUIMgr) CardStatusUIMgr: CardStatusUIMgr = null;

    @property(BetUIMgr) BetUIMgr: BetUIMgr = null;

    @property([Player]) players: Player[] = [];

    @property(cc.Node)
    gameUI: cc.Node = null;

    @property(Clock)
    clock: Clock = null;

    @property(cc.Node)
    continueBtn: cc.Node = null;

    //roomInfo
    @property(RoomInfo)
    roomInfo: RoomInfo = null;

    private rob_bet: cc.Node;
    private place_bet: cc.Node;
    private choose_card: cc.Node;

    onLoad() {
        UIMgr.instance = this;
        this.rob_bet = this.gameUI.children[0];
        this.place_bet = this.gameUI.children[1];
        this.choose_card = this.gameUI.children[2];
        this.rob_bet.active = false;
        this.place_bet.active = false;
        this.choose_card.active = false;
        

        Game.Inst.EventListener.on("RobBetInfo",(data)=>{
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

    getPlayerIndexByUID(UID: string): number{
        for(let index = 0;index < Define.GameInfo.Inst.playerCount;index++){
            if(Define.GameInfo.Inst.players[index].UID == UID)
                return index;
        }
        return undefined;
    }

    initUI(){
        //show waiting UI & hide other player
        this.showWaiting();
        this.isPlayersActive(false);
        this.roomInfo.init();
    }

    showWaiting(){
        Game.Inst.utils.createMessageBox(
            Game.Inst.resourcesMgr.load("msgBg"),
            Game.Inst.resourcesMgr.load("msgTitleText"),
            Game.Inst.resourcesMgr.load("msgTitleBg"),
            "正在为您匹配牌桌\n游戏即将开始请耐心等待",
            undefined,
            undefined,
            true);
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

    /**
     * init player info and show
     */
    initPlayerInfo() {
        let gameInfo: Define.GameInfo = Define.GameInfo.Inst;
        for (let i = 0; i < gameInfo.playerCount; i++) {
            cc.log("init"+i+"player");
            this.players[i].init(gameInfo.players[i].name,"headIcon" + gameInfo.players[i].iconID,gameInfo.players[i].money);
            this.players[i].node.active = true;
        }

    }

    receiveRobBetInfo(data){
        cc.warn("RobBet"+JSON.stringify(data));
        Define.RoomInfo.Inst.assign(data.room);
        //room info
        this.roomInfo.setRoomInfo(data.room.id);
        this.roomInfo.setRoomName(MiscHelper.getServerRoomName(data.room.room_name));
        this.roomInfo.setAntes(data.room.bet);
        this.roomInfo.setVisible(true);
        //player data
        Define.GameInfo.Inst.players[0].initData(data.main_player);
        //get other player data
        let playerIndex = 0;
        for (let _key in data.players) {
            playerIndex++;
            Define.GameInfo.Inst.players[playerIndex].initData(data.players[_key]);
        }
        Define.GameInfo.Inst.playerCount = playerIndex+1;
        UIMgr.Inst.initPlayerInfo();
    }

    /**
     * set clock
     * @param time time
     */
    setClockAct(time: number, callback?) {
        cc.log("start clock");
        this.clock.startCountDown(time, callback);
    }


    stopClock(){
        this.clock.init();
    }

    /**
     * 搶莊動畫
     * @param robPlayers 有搶莊玩家index列表
     * @param banker 莊家index
     */
    setDealerAnime(robPlayers:number[], banker:number){
        robPlayers.sort();
        /*
        cc.log(banker);
        cc.log(robPlayers.length);
      */
        // only one rob bet or no rob
        if(robPlayers.length <= 1){
            for(let i = 0; i < 3; i++){
                let seq = cc.sequence(
                    cc.delayTime(0.2*i),
                    cc.callFunc(()=>{
                        this.players[banker].bankerAnime(),
                        Game.Inst.animationMgr.play("banker"+banker, 1,false); 
                        this.players[banker].setBanker(true);
                    })
                ); 
                this.node.runAction(seq);  
            }
            return;
        }
        /*
        //show rob anime
        for(let index=0 ; ; index++){
            if(index>=9 && banker == (robPlayers[index%robPlayers.length])){
                cc.log("finished grabbing.");
                let seq = cc.sequence(
                    cc.delayTime(0.15*index),
                    cc.callFunc(()=>{
                        this.players[banker].setBanker(true);
                        this.players[banker].bankerAnime();
                    }),
                ); 
                this.node.runAction(seq);  
                break;
            }
            else{
                let seq = cc.sequence(
                    cc.delayTime(0.15*index),
                    cc.callFunc(()=> this.players[robPlayers[index%robPlayers.length]].bankerAnime())
                ); 
                this.node.runAction(seq);  
            }                    
        }
        */

        //from SG
        let round:number = 0;
        while(round+robPlayers.length<=10) round+=robPlayers.length;
        round+=(banker+1);
        let t:number = 1.5/round;
        for(let cnt=0 ; ; cnt++){
            if(cnt+1==round){     //多人搶莊則數到超過九次就可停止(大約1.5秒)
                cc.log("finished grabbing.");
                let seq = cc.sequence(
                    cc.delayTime(t*cnt),
                    cc.callFunc(()=>{
                        Game.Inst.animationMgr.play("banker"+banker, 1,false);
                        this.players[banker].setBanker(true);
                        this.players[banker].bankerAnime(t);
                    }),
                ); 
                this.node.runAction(seq);  
                break;
            }
            else{   
                let seq = cc.sequence(
                    cc.delayTime(t*cnt),
                    cc.callFunc(()=>this.players[robPlayers[cnt%robPlayers.length]].bankerAnime(t))
                ); 
                this.node.runAction(seq);  
            }                    
        }

    }


}
