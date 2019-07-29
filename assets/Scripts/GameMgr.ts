import GameMgrBase from "./components/GameMgrBase";
import Game from "./Game";
import Converter ,* as Define from "./Define";
import { ButtonSetting } from "./components/MessageBoxCtr";
import UIMgr from "./UIMgr";
import NetworkManager from "./NetworkManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMgr extends GameMgrBase {
    private reconnectCallBack: Function;
    start() {
        this.init();
        Game.Inst.networkMgr.registerEvent("websocket", (msg) => { this.receiveServerConnect(msg); });
        Game.Inst.networkMgr.registerEvent("time_info", (msg) => { this.receiveTimeInfo(msg); });
        Game.Inst.networkMgr.registerEvent("deal_cards", (msg) => { this.receiveDealInfo(msg); });
        Game.Inst.networkMgr.registerEvent("game_results", (msg) => { this.receiveCalcInfo(msg); });
        Game.Inst.networkMgr.registerEvent("recover_info", (msg) => { this.receiveRecoverInfo(msg); });
        Game.Inst.networkMgr.registerEvent("spam_message", (msg) => { this.receiveSpamMsg(msg); });
        
        
        this.reconnectCallBack = () => {
            cc.log("websocket reconnecting...");
            this.connectServer();
        };
    }

    startStateMachine() {
        this.FSM.setState(Define.GameState.Waiting);
        //BGM
        UIMgr.Inst.AudioMgr.playBGM();
    }

    quitBtnClick() {
        cc.log("QUIT");
        if (Define.GameInfo.Inst.endGame == true){
            Game.Inst.EventListener.clear();
            let data = sessionStorage.getItem("key");
            if (data != null){
                var url = window.location.href
                var arr = url.split("/");
                window.open(arr[0] + '//' + arr[2] + '/index.html','_self');
            }
            else{
                cc.director.loadScene("scene_start");
            }
        }
        else{
            UIMgr.Inst.showCantQuitMsg();
        }

    }

    
    connectServerComplete() {
        this.unschedule(this.reconnectCallBack);
    }

    disconnectServer() {
        //if not game over , reconnect.
        if (this.FSM != null) {
            let nowState: Define.GameState = this.FSM.activeState.state;
            if (nowState == Define.GameState.Waiting || nowState == Define.GameState.GrabBanker || nowState == Define.GameState.PlaceBet || nowState == Define.GameState.PlayCard) {
                this.schedule(this.reconnectCallBack, 0.5);
            }
        }
    }

    onRestartGame() {
    }

    quitGame() {
        Game.Inst.networkMgr.unregisterEvent("websocket");
        Game.Inst.networkMgr.unregisterEvent("matching");
        Game.Inst.networkMgr.unregisterEvent("init_info");
        Game.Inst.networkMgr.unregisterEvent("player_action");
        Game.Inst.networkMgr.unregisterEvent("deal_cards");
        Game.Inst.networkMgr.unregisterEvent("game_results");
        Game.Inst.networkMgr.unregisterEvent("recover_info");
        Game.Inst.networkMgr.unregisterEvent("spam_message");
        Game.Inst.networkMgr.unregisterEvent("announce_banker");
        Game.Inst.networkMgr.unregisterEvent("available_bet_rates");
        Game.Inst.networkMgr.unregisterEvent("recover_info");
        cc.log("End");
    }

    // protocol

    /**
     * 收到連線成功Respone
     * @param msg 
     */
    receiveServerConnect(msg: Define.WebSocketResp) {
        if (!msg.success) {
            cc.error("[TWGameMgr] Websocket connect fail!");
        }
    }

    /**
     * 收到斷線重連Respone
     * @param msg 
     */
    receiveServerRecorver(msg) {
    }

    /**
     * 收到連線錯誤Respone
     * @param msg 
     */
    receiveServerError(msg) {
    }

    /**
     * 收到stage初始時間
     * @param msg 
     */
    receiveTimeInfo(msg: Define.TimeBroadcast) {
        //cc.log(msg);
        //update remain time
        Define.GameInfo.Inst.remainTime = msg.seconds;
        cc.log("set clock time " + msg.seconds);
        switch(msg.cur_state){
            case "grab_banker_state":
                cc.log("switch to grab_banker_state");
                this.FSM.setState(Define.GameState.GrabBanker);
                break;
            case "bet_state":
                cc.log("switch to PlaceBet");
                this.FSM.setState(Define.GameState.PlaceBet);
                break;
            case "play_card_state":
                cc.log("PlayCard CountDown");
                UIMgr.Inst.startPlayCardCountDown();
                break;    
        }
        
    }

    /**
     * 收到deal stage 初始資訊
     * @param msg 
     */
    receiveDealInfo(msg : Define.DealInfo){
        this.FSM.setState(Define.GameState.PlayCard);
        //save my card & type
        Define.GameInfo.Inst.players[0].poker = msg.cards;
        Define.GameInfo.Inst.players[0].cardType = msg.card_type;
        if(msg.card_type == -1) Define.GameInfo.Inst.players[0].cardType = 0;
        //cc.warn("my cards : " + Define.GameInfo.Inst.players[0].poker + "type : " + Define.GameInfo.Inst.players[0].cardType);
    }

    /**
     * 收到結算資訊
     * @param msg 
     */
    receiveCalcInfo(msg : Define.CalcInfo){
        //push myself first
        for (let i = 0; i < Define.GameInfo.Inst.playerCount; i++) {
            //map correct player
            let playerInfoIndex : number = 0;
            for(playerInfoIndex = 0; playerInfoIndex < Define.GameInfo.Inst.playerCount; playerInfoIndex++){
                if(msg.players_info[playerInfoIndex].pf_account != Define.GameInfo.Inst.players[i].UID) {
                    cc.warn(msg.players_info[playerInfoIndex].pf_account +"!="+Define.GameInfo.Inst.players[i].UID);
                    continue;
                }
                cc.warn("find @" +playerInfoIndex );
                break;
            }
            //save data
            // cc.log(msg);
            // cc.log(msg.players_info);
            // cc.log(msg.players_info[0]);
            Define.GameInfo.Inst.players[i].win_bet = msg.players_info[playerInfoIndex].profit;
            Define.GameInfo.Inst.players[i].final_coin = msg.players_info[playerInfoIndex].money_src;
        }
        //goto final result state
        this.FSM.setState(Define.GameState.Calc);
    }

    receiveRecoverInfo(msg : Define.RecoverInfo){
        cc.warn("receive recover info ");
        cc.log(msg);
        let gameInfo: Define.GameInfo = Define.GameInfo.Inst;

        //RoomInfo Setting
        gameInfo.baseBet = msg.data.common.game_info.base_bet;
        gameInfo.coinsLimit = msg.data.common.game_info.coins_limit;
        gameInfo.levyRate = msg.data.common.game_info.levy_rate;
        gameInfo.roomID = msg.data.common.game_info.room_id;

        //Player Setting
        gameInfo.playerCount = msg.data.common.players_info.length;
        gameInfo.players.length = 0;

        let myUID : string = NetworkManager.Token;

        //push myself first
        for (let i = 0; i < Define.GameInfo.Inst.playerCount; i++) {
            if(msg.data.common.players_info[i].pf_account != myUID) continue;
            let player: Define.Player = new Define.Player();
            player.UID = msg.data.common.players_info[i].pf_account;
            player.money = msg.data.common.players_info[i].money_src;
            player.name = msg.data.common.players_info[i].name;
            player.iconID = msg.data.common.players_info[i].avatar;
            player.gender = msg.data.common.players_info[i].gender;
            player.vip = msg.data.common.players_info[i].vip;
            gameInfo.players.push(player);
        }
        //skip mySelf
        for (let i = 0; i < Define.GameInfo.Inst.playerCount; i++) {
            if(msg.data.common.players_info[i].pf_account == myUID) continue;
            let player: Define.Player = new Define.Player();
            player.UID = msg.data.common.players_info[i].pf_account;
            player.money = msg.data.common.players_info[i].money_src;
            player.name = msg.data.common.players_info[i].name;
            player.iconID = msg.data.common.players_info[i].avatar;
            player.gender = msg.data.common.players_info[i].gender;
            player.vip = msg.data.common.players_info[i].vip;
            gameInfo.players.push(player);
        }

        UIMgr.Inst.initPlayerInfo();

        gameInfo.mainPlayer = Converter.getServerPlayerCount(myUID);

        //room info UI set
        UIMgr.Inst.roomInfo.setRoomInfo(gameInfo.roomID);
        UIMgr.Inst.roomInfo.setRoomName(Converter.getServerRoomName(NetworkManager.Oid));
        UIMgr.Inst.roomInfo.setAntes(gameInfo.baseBet);
        UIMgr.Inst.roomInfo.setVisible(true);

        /**recover to correct stage */
        switch(msg.cur_state){
            case "grab_banker_state":
                cc.log("switch to grab_banker_state");
                this.FSM.setState(Define.GameState.GrabBanker);
                break;
            case "bet_state":
                cc.log("switch to PlaceBet");
                this.FSM.setState(Define.GameState.PlaceBet);
                break;
            case "play_card_state":
                cc.log("PlayCard CountDown");
                UIMgr.Inst.startPlayCardCountDown();
                break;    
        }

        cc.log("after switch stage~~~~");
    }

    receiveSpamMsg(Msg : Define.SpamMsg){
        let index = UIMgr.Inst.getPlayerIndexByUID(Msg.speaker_uid);
        UIMgr.Inst.players[index].talk(Msg.message_index);
        cc.warn("player"+index+"rcv canned msg"+ Msg.message_index);
    }

}
