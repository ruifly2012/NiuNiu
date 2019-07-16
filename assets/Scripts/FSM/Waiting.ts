import StateBase from "../components/StateBase";
import Game from "../Game";
import Converter, * as Define from "../Define";
import MiscHelper from "../MiscHelper";
import UIMgr from "../UIMgr";
import GameMgr from "../GameMgr";
import NetworkManager from "../NetworkManager";

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

        Game.Inst.networkMgr.registerEvent("matching", (msg) => { this.receiveMatching(msg); });
        Game.Inst.networkMgr.registerEvent("init_info", (msg) => { this.receiveInitInfo(msg); });

    }

    public stateInitialize() {
        cc.warn("initialize");
        ////init game
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
        //init UI
        UIMgr.Inst.initUI();
        // get table


        ////send match ready
        this.sendGameReady();
    }

    /**
     * tell server client is ready to match
     */
    sendGameReady() {
        let data= {
            "event" : "ready"
        };
        Game.Inst.networkMgr.sendMessage(data);
    }

    public stateRelease() {
    }
    public stateUpdate(dt: number) {
    }

    /**
     * 收到"matching" respone
     * @param msg 
     */
    receiveMatching(msg: Define.MatchResp) {
        if (msg.success) {
            UIMgr.Inst.showWaiting();
        }
        else {
        //金額不足
            if (msg.code == 3002) {
                UIMgr.Inst.showNoMoneyMsg();
            }
        }
    }

    /**
     * 收到"init_info" respone
     * @param msg 
     */
    receiveInitInfo(msg: Define.InitGame) {
        cc.warn("receiveUpdate interface example: ");

        if (this.isActive) {
            cc.log(msg);
            let gameInfo: Define.GameInfo = Define.GameInfo.Inst;

            //RoomInfo Setting
            gameInfo.baseBet = msg.game_info.base_bet;
            gameInfo.coinsLimit = msg.game_info.coins_limit;
            gameInfo.levyRate = msg.game_info.levy_rate;
            gameInfo.roomID = msg.game_info.room_id;
            gameInfo.timeOfRound = msg.game_info.time_of_round;

            //Player Setting
            gameInfo.playerCount = msg.player_list.length;
            gameInfo.players.length = 0;
            for (let i = 0; i < Define.GameInfo.Inst.playerCount; i++) {
                let player: Define.Player = new Define.Player();
                player.UID = msg.player_list[i].uid;
                player.money = msg.player_list[i].money_src;
                player.name = msg.player_list[i].name;
                player.iconID = msg.player_list[i].avatar;
                player.gender = msg.player_list[i].gender;
                player.vip = msg.player_list[i].vip;
                gameInfo.players.push(player);
            }
            UIMgr.Inst.initPlayerInfo();

            gameInfo.mainPlayer = Converter.getServerPlayerCount(msg.game_info.my_uid);

            //room info
            UIMgr.Inst.roomInfo.setRoomInfo(gameInfo.roomID);
            UIMgr.Inst.roomInfo.setRoomName(Converter.getServerRoomName(NetworkManager.Oid));
            UIMgr.Inst.roomInfo.setAntes(gameInfo.baseBet);
            UIMgr.Inst.roomInfo.setVisible(true);

            //send Ready request to server
            let data = { "event": "ready" };
            Game.Inst.networkMgr.sendMessage(JSON.stringify(data));
            //this.isReady = true;
        }
    }
}
