import { PokerType, PokerValue } from "./components/Poker";

export enum GameState {
    None = 0,
    Waiting,
    RobBet,
    PlaceBet,
    ChooseCard,
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
export class GameInfo{
    private static instance: GameInfo = null;

    static get Inst(): GameInfo{
        if(!GameInfo.instance){
            GameInfo.instance = new GameInfo();
        }
        return this.instance;
    }

    players: Player[] = []; 
    playerCount: number;
    bankerIndex: number;
    token: string;
    rob_list: number[] = [];
    endGame: boolean = false;
}

export class RoomInfo{
    private static instance: RoomInfo = null;

    static get Inst(): RoomInfo{
        if(!RoomInfo.instance){
            RoomInfo.instance = new RoomInfo();
        }
        return this.instance;
    }

    assign(room){
        RoomInfo.Inst.id = room.id;
        RoomInfo.Inst.bet = room.bet;
        RoomInfo.Inst.coins_limit = room.coins_limit;
        RoomInfo.Inst.game_option_id = room.game_option_id;
        RoomInfo.Inst.game_rate = room.game_rate;
    }

    id: number;
    bet: number;
    coins_limit: number;
    game_option_id: number;
    game_rate: number;
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
    vip: string;
    cardType: CardType;
    /**結算金額浮動值 */
    win_bet: number;
    /**結算金額 */
    final_coin: number;

    /**
     * 存player初始資料
     * @param data player Json
     */
    initData(data){
        this.UID = data.uid;
        this.name = data.nickname;
        this.money = data.coins;
        this.iconID = data.avatar;
        if(data.gender == Gender.female)
            this.gender = "female";
        else this.gender = "male";
    }

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

    static getCardTypeConvert(type: string): CardType{
        switch(type){
            // case "High cards": return TWNormalCardType.HighCard;
            // case "One pair": return TWNormalCardType.OnePair;
            // case "Two pair": return TWNormalCardType.TwoPairs;
            // case "Three of kind": return TWNormalCardType.ThreeOfAKind;
            // case "Straight": return TWNormalCardType.Straight;
            // case "Flush": return TWNormalCardType.Flush;
            // case "Full house": return TWNormalCardType.FullHouse;
            // case "Four of kind": return TWNormalCardType.FourOfAKind;
            // case "Straight fiush": return TWNormalCardType.StraightFlush;
            default:
                return CardType.noCow;
        }
    }
}