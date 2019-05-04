import Game from "../Game";


const {ccclass, property} = cc._decorator;

export enum PokerType
{
    None = 0,
    /**黑桃 */
    Spade,
    /**紅心 */
    Hearts,
    /**方塊 */
    Diamond,
    /**梅花 */
    Club
}

export class PokerValue
{
    constructor(_type: PokerType,_value: number){
        this.type = _type;
        this.value = _value;
    }
    /**當前撲克牌花色 */
    type: PokerType = PokerType.Spade;
    /**當前撲克牌數字 */
    value: Number = 0;
}

@ccclass
export default class Poker extends cc.Component 
{
    @property(cc.Sprite) cardFold: cc.Sprite = null;
    @property(cc.Sprite) cardFront: cc.Sprite = null;
    @property(cc.Sprite) cardBack: cc.Sprite = null;
    @property(cc.Sprite) cardFrontTextUp: cc.Sprite = null;
    @property(cc.Sprite) cardFrontTypeUp: cc.Sprite = null;
    @property(cc.Sprite) cardFrontTypeMiddle: cc.Sprite = null;
    @property(cc.Sprite) cardFrontTextDown: cc.Sprite = null;
    @property(cc.Sprite) cardFrontTypeDown: cc.Sprite = null;

    private _pokerValue: PokerValue;
    isBack: boolean = false;
    isFold: boolean = false;

    public get pokerValue()
    {
        return this._pokerValue;
    }

    start()
    {
        this.cardFold.node.active = false;
    }

    private enableCardFront()
    {
        this.cardFront.node.active = true;
        this.cardFrontTextUp.node.active = true;
        this.cardFrontTypeUp.node.active = true;
        this.cardFrontTypeMiddle.node.active = true;
        this.cardFrontTextDown.node.active = true;
        this.cardFrontTypeDown.node.active = true;

        this.cardBack.node.active = false;
    }

    private disableCardFront()
    {
        this.cardFront.node.active = false;
        this.cardFrontTextUp.node.active = false;
        this.cardFrontTypeUp.node.active = false;
        this.cardFrontTypeMiddle.node.active = false;
        this.cardFrontTextDown.node.active = false;
        this.cardFrontTypeDown.node.active = false;

        this.cardBack.node.active = true;
    }

    private setCardFront(type: string, value: string, middle: string)
    {
        cc.log(type);
        cc.log(value);
        cc.log(middle);
        let typeSprite = Game.Inst.resourcesMgr.load(type);
        let valueSprite = Game.Inst.resourcesMgr.load(value);
        let middleSprite = Game.Inst.resourcesMgr.load(middle);

        if (this.cardFront.spriteFrame == null)
            this.cardFront.spriteFrame = Game.Inst.resourcesMgr.load("PC");

        this.cardFrontTextUp.spriteFrame = valueSprite;
        this.cardFrontTypeUp.spriteFrame = typeSprite;
        this.cardFrontTypeMiddle.spriteFrame = middleSprite;
        this.cardFrontTextDown.spriteFrame = valueSprite;
        this.cardFrontTypeDown.spriteFrame = typeSprite;
    }

    /**
     * 設置牌面數值
     * @param _type 牌面型態
     * @param _value 牌面數值
     * @param _size 撲克牌大小
     */
    setPokerValue(_type: PokerType, _value: Number,_size: number = 1.0)
    {
        if (_type == PokerType.None || _value < 1 || _value > 13)
        {
            cc.error("[Poker] Invalid poker setting");
            return;
        }

        let valueSpriteName: string = "";
        let typeSpriteName: string = "";
        let middleSpriteName: string = "";
        let isBlack: boolean = false;

        switch (_type)
        {
            case PokerType.Spade:
                typeSpriteName = "S-S";
                middleSpriteName = "S";
                valueSpriteName = "KD-";
                isBlack = true;
                break;
            case PokerType.Hearts:
                typeSpriteName = "H-S";
                middleSpriteName = "H";
                valueSpriteName = "RD-";
                isBlack = false;
                break;
            case PokerType.Diamond:
                typeSpriteName = "B-S";
                middleSpriteName = "B";
                valueSpriteName = "RD-";
                isBlack = false;
                break;
            case PokerType.Club:
                typeSpriteName = "P-S";
                middleSpriteName = "P";
                valueSpriteName = "KD-";
                isBlack = true;
                break;
        }

        switch (_value)
        {
            case 1:
                valueSpriteName += "A";
                this.cardFrontTypeMiddle.sizeMode = cc.Sprite.SizeMode.RAW;
                break;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                valueSpriteName += _value.toString();
                this.cardFrontTypeMiddle.sizeMode = cc.Sprite.SizeMode.RAW;
                break;
            case 11:
                valueSpriteName += "J";
                middleSpriteName = (isBlack ? "K" : "R") + "J";
                this.cardFrontTypeMiddle.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                this.cardFrontTypeMiddle.node.setContentSize(cc.size(90,160));
                break;
            case 12:
                valueSpriteName += "Q";
                middleSpriteName = (isBlack ? "K" : "R") + "Q";
                this.cardFrontTypeMiddle.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                this.cardFrontTypeMiddle.node.setContentSize(cc.size(90,160));
                break;
            case 13:
                valueSpriteName += "K";
                middleSpriteName = (isBlack ? "K" : "R") + "K";
                this.cardFrontTypeMiddle.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                this.cardFrontTypeMiddle.node.setContentSize(cc.size(90,160));
                break;
        } 

        this.setCardFront(typeSpriteName, valueSpriteName, middleSpriteName);
        this.setSize(_size);
        this.enableCardFront();
    }

    /**
     * 設置撲克牌大小
     * @param _size 縮放大小
     */
    setSize(_size: number){
        this.node.scale = _size;
    }

    /**
     * 設置是否開啟撲克牌背
     * @param ison 是否開啟
     */
    setShowBack(ison: boolean = false)
    {
        //cc.log("test1");
        if (ison)
        {
            //if(this.cardBack.spriteFrame == null){
                this.cardBack.spriteFrame = Game.Inst.resourcesMgr.load("BK");
                cc.log(this.cardBack);
            //}
            this.disableCardFront();
        }
        else
        {
            this.enableCardFront();
        }
    }

    /**
     * 設置是否放棄撲克牌
     * @param ison 是否開啟
     */
    setShowFold(ison: boolean = false)
    {
        cc.log("test2");
        if (ison)
        {
            this.disableCardFront();
            this.cardFold.node.active = true;
        }
        else
        {
            this.cardFold.node.active = false;
        }
    }

    /**
     * 撲克牌翻轉動畫
     * @param duration 播放時間
     * @param cardDurationOffset 
     * @param moveUp 
     */
    flip(duration:number,cardDurationOffset:number,moveUp:number = 20,){
        let size = this.node.scale;
        let action = cc.sequence(
            cc.moveBy(duration, cc.v2(0, moveUp)).easing(cc.easeCubicActionIn()),
            cc.scaleTo(duration * 0.5 + cardDurationOffset, 0, size),
            cc.callFunc(()=>{
             this.setShowBack(false);
             }),
            cc.scaleTo(duration * 0.5+ cardDurationOffset, size),
            cc.moveBy(duration, cc.v2(0, -moveUp)).easing(cc.easeCubicActionOut()),
        );
        this.node.runAction(action);
    }
}
