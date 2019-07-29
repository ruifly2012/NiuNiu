import { PokerType, PokerValue } from "./components/Poker";

export enum GameState {
    None = 0,
    Waiting,
    GrabBanker,
    PlaceBet,
    PlayCard,
    Calc,
    End
}

export enum Gender{
    male = 0,
    female
}

export enum CardType {
    /**沒牛 */
    noCow = 0,
    /**牛1 */
    cow1,
    /**牛2 */
    cow2,
    /**牛3 */
    cow3,
    /**牛4 */
    cow4,
    /**牛5 */
    cow5,
    /**牛6 */
    cow6,
    /**牛7 */
    cow7,
    /**牛8 */
    cow8,
    /**牛9 */
    cow9,
    /**牛牛 */
    cowCow,
    /**銀牛 */
    silverCow,
    /**金牛 */
    goldCow,
    /**炸彈 */
    bomb,
    /**5小牛 */
    smallCow,
}

export enum BetType{
    RobBet = 0,
    PlaceBet
}

export enum PlayerID {
    Player1 = 0,
    Player2,
    Player3,
    Player4,
    Player5
}

export class GameInfo{
    private static instance: GameInfo = null;

    static get Inst(): GameInfo{
        if(!GameInfo.instance){
            GameInfo.instance = new GameInfo();
        }
        return this.instance;
    }
    
    /**Client端玩家在players中的編號 */
    mainPlayer: PlayerID;

    /**房間ID */
    roomID: string = "";
    /**底注 */
    baseBet: number = 0;
    /**最低遊玩門檻金額 */
    coinsLimit: number = 0;
    /**抽水%數 */
    levyRate: number = 0.05;
    /**倒數時間 */
    remainTime: number = 15;

    /**全玩家基本資訊 */
    players: Player[] = [];
    /**玩家數量 */
    playerCount: number;

    /**莊家編號 */
    bankerIndex: number;

    /**閒家可選倍率 */
    rob_list: number[] = [];
    endGame: boolean = false;
}

export class Player{
    UID: string;
    name: string;
    money: number;
    iconID: number;
    poker: number[];
    /**性別 */
    gender: string;
    /**VIP號碼 */
    vip: number;
    cardType: CardType;
    /**結算金額浮動值 */
    win_bet: number;
    /**結算金額 */
    final_coin: number;

    /**
     * 結算用資料
     * @param data 
     */
    finalData(data){
        this.poker = data.cards;
        this.cardType = data.points;
        this.win_bet = data.win_bet;
        this.final_coin = data.final_coins;
    }
}

export default class Converter {
    /**取得玩家頭像旁倍率顯示 */
    static getBetTypeText(type: BetType): string {
        switch (type) {
            case BetType.RobBet: return "grab_";
            case BetType.PlaceBet: return "BetTest_"
            default:
                cc.error("[TWDefineConverter]");
                break;
        }
        return "NONE";
    }
    /**取得牌型動畫素材名稱 */
    static getCardTypeAnimText(type: CardType): string {
        switch (type) {
            case CardType.cowCow: return "cowCow";
            case CardType.goldCow: return "goldCow";
            case CardType.silverCow: return "silverCow";
            case CardType.bomb: return "bomb";
            case CardType.smallCow: return "5cow";
            default:
                cc.log("[DefineConverter] not special type");
                break;
        }
        return "NoneType";
    }

    /**取得牌型動畫素材名稱 */
    static getCardTypeAudioIndex(type: CardType): string {
        switch (type) {
            case CardType.cowCow: return "010";
            case CardType.goldCow: return "011";
            case CardType.silverCow: return "012";
            case CardType.bomb: return "013";
            case CardType.smallCow: return "014";
            default:
                cc.log("[DefineConverter] not special type");
                break;
        }
        return "NoneType";
    }

    /**取得牌型動畫速度 */
    static getCardTypeAnimRate(type: CardType): number {
        switch (type) {
            case CardType.cowCow: return 1;
            case CardType.goldCow: return 0.7;
            case CardType.silverCow: return 1;
            case CardType.bomb: return 0.6;
            case CardType.smallCow: return 0.5;
            default:
                cc.log("[DefineConverter] not special type");
                break;
        }
        return 1;
    }

    /**取得牌型背景圖素材名稱 */
    static getCardTypeBgTextureText(type: CardType): string {
        switch (type) {
            case CardType.noCow:
                return "Award_frame_01";
            case CardType.cow1:
            case CardType.cow2:
            case CardType.cow3:
            case CardType.cow4:
            case CardType.cow5:
            case CardType.cow6:
                return "Award_frame_02"
            case CardType.cow7:
            case CardType.cow8:
            case CardType.cow9:
                return "Award_frame_03"
            case CardType.cowCow:
                return "Award_frame_04"
            case CardType.silverCow:
                return "Award_frame_05"
            case CardType.goldCow:
            case CardType.bomb:
            case CardType.smallCow:
                return "Award_frame_06"
            default:
                cc.error("[TWDefineConverter]");
                break;
        }
        return "Award_frame";
    }

    static getServerPokerConvert(_poker: number): PokerValue{
        if(_poker > 53 || _poker < 0){
            cc.error("");
            return undefined;
        }

        let pokerType: PokerType;
        switch((Math.floor(_poker / 13) + 1)){
            case 1: 
                pokerType = PokerType.Club;
                break;
            case 2: 
                pokerType = PokerType.Diamond;
                break;
            case 3: 
                pokerType = PokerType.Hearts;
                break;
            case 4: 
                pokerType = PokerType.Spade;
                break;
            case 5:
                pokerType = PokerType.Joker;
                break;
        }

        return new PokerValue(pokerType,Math.floor(_poker % 13) + 1);
    }

    /**
     * 取得房間名稱
     * @param oid 房間oid
     */
    static getServerRoomName(oid: string): string {
        switch (oid) {
            case "17": return "a";//"!";
            case "18": return "b";//"#";
            case "19": return "c";//"'";
            case "20": return "d";//"$";
        }
        return "!";
    }

    /**
     * 取得玩家在GameInfo Players Array中的位置
     * @param player 玩家UID
     */
    static getServerPlayerCount(player: string): PlayerID {
        for (let i = 0; i < GameInfo.Inst.playerCount; i++) {
            if (GameInfo.Inst.players[i].UID == player)
                return i as PlayerID;
        }
        return PlayerID.Player1;
    }
    
}


// Server Respone interface

export interface WebSocketResp {
    /**websocket */
    event: string;
    /**true 代表連線成功, false 代表連線失敗 */
    success: boolean;
    /**描述 */
    desc: string;
}

export interface MatchResp {
    /**matching */
    event: string;
    /**true 代表開始 matching */
    success: boolean;
    /**描述 */
    desc: string;
    /**
     * 如果有 error 產生，會回傳 code 如下表 錯誤狀況
     * 3001：match 失敗，群作伺服器錯誤
     * 3002：金額不足准入標準
     */
    code: number;
}

export interface WebSocketRecorverResp {
    /**recover */
    event: string;
    /**true 表示重新回到遊戲房間 */
    success: boolean;
    /**描述 */
    desc: string;
}

export interface InitGame {
    /**init_info */
    event: string;
    /**房間相關的資料 */
    game_info: GameInfoMsg;
    /**玩家資料 */
    players_info: PlayersInfo[];
}

export interface GameInfoMsg {
    /**房間 id */
    room_id: string;
    /**底注 */
    base_bet: number;
    /**最低遊玩門檻金額 */
    coins_limit: number;
    /**抽成%數 */
    levy_rate: number;
    /**房間類型 */
    room_type: number;
    game_code : string;
}

export interface PlayersInfo {
    /**Player id */
    pf_account: string;
    /**現有財產 */
    money_src: number;
    /**玩家名字 */
    name: string;
    /**大頭照的 index */
    avatar: number;
    /**性別 */
    gender: string;
    /**vip 號碼 */
    vip: number;
    /**結算金額 */
    profit : number;

    /**player cur state */
    is_banker: boolean;
    is_finish_grab: boolean;
    is_finish_bet: boolean;
    is_finish_play: boolean;
}

export interface TimeBroadcast {
    /**websocket */
    event: string;
    /**目前STAGE */
    cur_state: string;
    /**倒數秒數 */
    seconds: number;
}

export interface PlayerAction {
    /**webSocket */
    event: string;
    action: string;
    /**做出行為玩家UID */
    action_player_pf_account: string;
    /**具體內容 */
    info: object;
}

export interface BankerBroadcast {
    /**webSocket */
    event: string;
    /**莊家UID */
    banker_pf_account : string;
}

export interface DealInfo {
    /**webSocket */
    event: string;
    /**牌型 */
    card_type : number;
    /**手牌 */
    cards : number[];
}

export interface CalcInfo {
    /**webSocket */
    event: string;
    /**玩家資訊 */
    players_info : PlayersInfo[];
}

export interface SpamMsg {
    /**webSocket */
    event: string;
    /**訊息Index */
    message_index : number;
    /**說話玩家UID */
    speaker_uid : string;
}

export interface RecoverInfo{
    event: string;
    data: Data;
    cur_state: string;
    seconds: number;
    finished_players: any[];
}

export interface Data{
    common : recoverData;
}

export interface recoverData{
    game_info: GameInfoMsg;
    players_info: PlayersInfo[];
}