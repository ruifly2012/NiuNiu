import Game from "../Game";
import UIMgr from "../UIMgr";


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
    Club,
    /**鬼牌 */
    Joker
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
    value: number = 0;
}

@ccclass
export default class Poker extends cc.Component 
{
    @property(cc.Sprite) cardFront: cc.Sprite = null;
    @property(cc.Sprite) cardBack: cc.Sprite = null;
    @property(cc.Sprite) cardFrontTextUp: cc.Sprite = null;
    @property(cc.Sprite) cardFrontTypeUp: cc.Sprite = null;
    @property(cc.Sprite) cardFrontTypeMiddle: cc.Sprite = null;
    @property(cc.Sprite) cardFrontTextDown: cc.Sprite = null;
    @property(cc.Sprite) cardFrontTypeDown: cc.Sprite = null;
    @property(cc.Node) shiny: cc.Node = null;

    private _pokerValue: PokerValue;
    private isClickAble: boolean =false;
    isSelect: boolean = false;
    cardIndex = 0;
    cardVal: number = 0;

    public get pokerValue(){
        return this._pokerValue;
    }

    start(){
       this.setCardLight(false);
       this.setClickAble(false);
    }

    setCardLight(isOn: boolean = false){
        this.shiny.active = isOn;
        this.isSelect = isOn;
    } 

    private enableCardFront(){
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

        if(!this.cardFront.spriteFrame)
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
    setPokerValue(_type: PokerType, _value: number,_size: number = 1.0)
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
        this.cardVal = _value;
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
            case PokerType.Joker:
                if(_value == 1) isBlack = true;
                else isBlack = false;

                valueSpriteName = (isBlack ? "K" : "R") + "D-JOKER";
                middleSpriteName = (isBlack ? "K" : "R") + "JO";
                this.cardFrontTypeMiddle.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                this.cardFrontTypeMiddle.node.setContentSize(cc.size(90,160));
                this.setCardFront("NaN", valueSpriteName, middleSpriteName);
                this.setSize(_size);
                return;
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
    }

    /**
     * 設置撲克牌大小
     * @param _size 縮放大小
     */
    setSize(_size: number){
        //cc.log("[POKER] set size" + _size);
        this.node.scale = _size;
    }

    /**
     * 設置是否開啟撲克牌背
     * @param isOn 是否開啟
     */
    setShowBack(isOn: boolean = false){
        if (isOn){
            this.cardBack.spriteFrame = Game.Inst.resourcesMgr.load("BK");
            //cc.log(this.cardBack);
            this.disableCardFront();
        }
        else{
            this.enableCardFront();
        }
    }

    /**
     * 設置是否可點擊
     * @param isOn 可否點擊
     */
    setClickAble(isOn: boolean = false){
        this.isClickAble = isOn;
    }

    cardClicked(){
        if(this.isClickAble)
            UIMgr.Inst.chooseCardUIMgr.cardClick(this.cardIndex);
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
