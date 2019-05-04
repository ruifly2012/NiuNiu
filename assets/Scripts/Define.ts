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
    UID: number;
    name: string;
    money: number;
    iconID: number;
    poker: number[];
    /**性別 */
    gender: string;
    /**VIP號碼 */
    vip: number;

    /**
     * 存player資料
     * @param data player Json
     */
    assign(data){
        this.UID = data.uid;
        this.name = data.nickname;
        this.money = data.coins;
        this.iconID = data.avatar;
    }
}

export default class Converter {
    /**取得普通牌型美術字素材名稱 */
    static getCardTypeTextureText(type: CardType): string {
        switch (type) {
            // case TWNormalCardType.None: return "NoneType";
            // case TWNormalCardType.HighCard: return "HighCard";
            // case TWNormalCardType.OnePair: return "OnePair";
            // case TWNormalCardType.TwoPairs: return "TwoPairs";
            // case TWNormalCardType.ThreeOfAKind: return "ThreeOfAKind";
            // case TWNormalCardType.ChongThree: return "ChongThree";
            // case TWNormalCardType.Flush: return "Flush";
            // case TWNormalCardType.Straight: return "Straight";
            // case TWNormalCardType.FullHouse: return "FullHouse";
            // case TWNormalCardType.MiddleHandFullHouse: return "MiddleHandFullHouse";
            // case TWNormalCardType.FourOfAKind: return "FourOfAKind";
            // case TWNormalCardType.MiddleHandFourOfAKind: return "MiddleHandFourOfAKind";
            // case TWNormalCardType.StraightFlush: return "StraightFlush";
            // case TWNormalCardType.MiddleHandStraightFlush: return "MiddleHandStraightFlush";
            default:
                cc.error("[DefineConverter]");
                break;
        }
        return "NoneType";
    }

    /**取得普通牌型背景圖素材名稱 */
    static getCardTypeBgTextureText(type: CardType): string {
        switch (type) {
            // case TWNormalCardType.None:
            // case TWNormalCardType.HighCard:
            // case TWNormalCardType.OnePair:
            // case TWNormalCardType.TwoPairs:
            // case TWNormalCardType.ThreeOfAKind:
            // case TWNormalCardType.Flush:
            // case TWNormalCardType.Straight:
            // case TWNormalCardType.FullHouse: return "NormalBg";

            // case TWNormalCardType.ChongThree:
            // case TWNormalCardType.MiddleHandFullHouse:
            // case TWNormalCardType.MiddleHandFourOfAKind:
            // case TWNormalCardType.MiddleHandStraightFlush: return "SpecialBg"

            // case TWNormalCardType.FourOfAKind:
            // case TWNormalCardType.StraightFlush: return "GoldBg"
            
            default:
                cc.error("[TWDefineConverter]");
                break;
        }
        return "NormalBg";
    }

    static getServerPokerConvert(_poker: number): PokerValue{
        if(_poker > 51 || _poker < 0){
            cc.error("");
            return undefined;
        }

        let pokerType: PokerType;
        switch((Math.floor(_poker % 4) + 1)){
            case 1: pokerType = PokerType.Diamond;
            case 2: pokerType = PokerType.Club;
            case 3: pokerType = PokerType.Hearts;
            case 4: pokerType = PokerType.Spade;
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