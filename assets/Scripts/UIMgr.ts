import AnimMgr from "./AnimMgr";
import Player from "./components/Player";
import * as Define from "./Define";
import Game from "./Game";
import Clock from "./components/Clock";
import CardUIMgr from "./UI/CardUIMgr";
import CardStatusUIMgr from "./UI/CardStatusUIMgr";
import BetUIMgr from "./UI/BetUIMgr";
import { ButtonSetting } from "./components/MessageBoxCtr";
import RoomInfo from "./UI/RoomInfo";
import MiscHelper from "./MiscHelper";
import NNAudioMgr from "./NNAudioMgr";

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

    @property(NNAudioMgr) AudioMgr: NNAudioMgr = null;

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
        // webSocket Event
        Game.Inst.networkMgr.registerEvent("player_action", (msg) => { this.receivePlayerAction(msg); });
        Game.Inst.networkMgr.registerEvent("announce_banker", (msg) => { this.receiveBanker(msg); });
        Game.Inst.networkMgr.registerEvent("available_bet_rates", (msg) => { this.receiveBetRates(msg); });

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
        //hide other player
        this.isPlayersActive(false);
        this.roomInfo.init();
    }

    /**
     * 顯示等待配對MsgBox
     */
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

    /**
     * 顯示遊戲中無法離開房間 MessageBox畫面
     */
    showCantQuitMsg() {
        let BtnSet: ButtonSetting = new ButtonSetting();
        BtnSet.originBtnBackground = Game.Inst.resourcesMgr.load("btnconfirmO");
        BtnSet.originBtnText = Game.Inst.resourcesMgr.load("txtconfirmO");
        BtnSet.clickedBtnBackground = Game.Inst.resourcesMgr.load("btnconfirmC");
        BtnSet.clickedBtnText = Game.Inst.resourcesMgr.load("txtconfirmC");
        BtnSet.closePanel = true;

        Game.Inst.utils.createMessageBox(
            Game.Inst.resourcesMgr.load("msgBg"),
            Game.Inst.resourcesMgr.load("msgTitleText"),
            Game.Inst.resourcesMgr.load("msgTitleBg"),
            "游戏进行中无法离开!\n请待结束后退出",
            BtnSet);
    }

    /**
     * 顯示金額不足無法開始下一場遊戲 MessageBox畫面
     */
    showNoMoneyMsg() {
        let BtnSet: ButtonSetting = new ButtonSetting();
        BtnSet.originBtnBackground = Game.Inst.resourcesMgr.load("btnconfirmO");
        BtnSet.originBtnText = Game.Inst.resourcesMgr.load("txtconfirmO");
        BtnSet.clickedBtnBackground = Game.Inst.resourcesMgr.load("btnconfirmC");
        BtnSet.clickedBtnText = Game.Inst.resourcesMgr.load("txtconfirmC");
        BtnSet.closePanel = true;
        BtnSet.callback = () => {
            Game.Inst.currentGameMgr.leaveGameLobby();
        };

        Game.Inst.utils.createMessageBox(
            Game.Inst.resourcesMgr.load("msgBg"),
            Game.Inst.resourcesMgr.load("msgTitleText"),
            Game.Inst.resourcesMgr.load("msgTitleBg"),
            "您的金额不足，将请您回到大厅\n充值或到低倍注房间进行游戏。",
            BtnSet);
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
            this.players[i].init(gameInfo.players[i].name, gameInfo.players[i].iconID.toString(), gameInfo.players[i].money, gameInfo.players[i].gender);
            this.players[i].node.active = true;
        }
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
        // only one rob bet or no rob
        if(robPlayers.length <= 1){
            for(let i = 0; i < 3; i++){
                let seq = cc.sequence(
                    cc.delayTime(0.2*i),
                    cc.callFunc(()=>{
                        this.players[banker].bankerAnime(),
                        Game.Inst.animationMgr.play("banker"+banker, 1,false); 
                        this.players[banker].setBanker(true);
                        UIMgr.Inst.AudioMgr.playBanker();
                    })
                ); 
                this.node.runAction(seq);  
            }
            return;
        }
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
                        UIMgr.Inst.AudioMgr.playBanker();
                        this.players[banker].bankerAnime(t);
                    }),
                ); 
                this.node.runAction(seq);  
                break;
            }
            else{   
                let seq = cc.sequence(
                    cc.delayTime(t*cnt),
                    cc.callFunc(()=>{
                        this.players[robPlayers[cnt%robPlayers.length]].bankerAnime(t);
                        UIMgr.Inst.AudioMgr.playRobBet(cnt);
                    })
                ); 
                this.node.runAction(seq);  
            }                    
        }

    }

    ////web socket event////

    /**
     * 收到server廣播其他玩家行為
     * @param msg 
     */
    receivePlayerAction(msg: Define.PlayerAction) {
        switch(msg.action){
            case "grab_banker":
                this.getPlayerByUID(msg.action_player_uid).setStatus(Define.BetType.RobBet,msg.info.grab_rate);
                cc.log("push"+this.getPlayerIndexByUID(msg.action_player_uid));
                //if rob, put in rob anime array
                if(msg.info.grab_rate != 0)
                Define.GameInfo.Inst.rob_list.push(UIMgr.Inst.getPlayerIndexByUID(msg.action_player_uid));
                
                break;
            case "bet":
                this.getPlayerByUID(msg.action_player_uid).setStatus(Define.BetType.PlaceBet,msg.info.bet_rate);
                break;
        }
        
    }

    /**
     * 收到SERVER傳回莊家UID
     * @param msg 
     */
    receiveBanker(msg: Define.BankerBroadcast) {
        let bankerIndex =  UIMgr.Inst.getPlayerIndexByUID(msg.banker_uid);
        Define.GameInfo.Inst.bankerIndex = bankerIndex;
        //stop clock when rob banker anime
        this.stopClock();
        this.setDealerAnime(Define.GameInfo.Inst.rob_list,bankerIndex);
    }

    /**
     * get avaliable bet rate list
     * @param msg 
     */
    receiveBetRates(msg){
        this.BetUIMgr.setRate(msg.available_bet_rates);
    }
}
