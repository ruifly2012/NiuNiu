
export enum TWNormalCardType {
    /**不符牌型 */
    None = 0,
    /**烏龍 */
    HighCard,
    /**對子 */
    OnePair,
    /**兩對 */
    TwoPairs,
    /**三條 */
    ThreeOfAKind,
    /**沖三 */
    ChongThree,
    /**順子 */
    Straight,
    /**同花 */
    Flush,
    /**葫蘆 */
    FullHouse,
    /**中墩葫蘆 */
    MiddleHandFullHouse,
    /**鐵支 */
    FourOfAKind,
    /**中墩鐵支 */
    MiddleHandFourOfAKind,
    /**同花順 */
    StraightFlush,
    /**中墩同花順 */
    MiddleHandStraightFlush,
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
    public playerCount: number;
    
}

export class Player{
    uid: number;
    name: string;
    money: number;
    iconID: number;
    poker: number[];
}