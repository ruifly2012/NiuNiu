import Game from "../Game";
import Converter, * as Define from "../Define";
import SequenceAnimation from "./animation/SequenceAnimation";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component 
{
    @property(cc.Sprite) head: cc.Sprite = null;
    @property(cc.Label) id: cc.Label = null;
    @property(cc.Label) money: cc.Label = null;
    @property(cc.Node) kingIcon: cc.Node = null;
    @property(cc.Sprite) status: cc.Sprite  = null;
    @property(SequenceAnimation) shineAnime: SequenceAnimation = null;
    @property(cc.Label) moneyPlus: cc.Label = null;
    @property(cc.Label) moneyMinus: cc.Label = null;
    @property(cc.Node) talkBox: cc.Node = null;
    private talkBoxText: cc.Label = null;
    
    start() 
    {
        //cc.log("player onStart");
        this.talkBoxText = this.talkBox.getChildByName("Text").getComponent(cc.Label);
        // TEST data
        let id = "test id";
        let icon = "headIcon" + (Math.floor(Math.random() * 16) + 1);
        let credit = Math.floor(Math.random() * 1000000); 
        this.init(id, icon, credit);
    }

    init(id: string, headSprite: string, money: number)
    {
        this.setName(id);
        this.setMoney(money);
        this.setHeadSprite(headSprite);
        this.setBanker(false);
        this.moneyMinus.string = "";
        this.moneyPlus.string = "";
        this.talkBox.opacity = 255;
        this.talkBox.scaleY = 0;
        
    }

    setHeadSprite(spriteName: string)
    {
        let spr = Game.Inst.resourcesMgr.load(spriteName);
        if (spr != null)
            this.head.spriteFrame = spr;
        else
            cc.error("Error: Load " + spriteName + " failed.");
    }

    setMoney(amount: number)
    {
        this.money.string = amount.toLocaleString();
    }

    setName(str: string)
    {
        this.id.string = str;
    }

    /**
     * 頭像背景閃爍效果
     * @param speed 閃爍速度
     * @param duration 持續時間
     */
    setShiny(speed: number = 2, duration: number = 0.5){
        this.shineAnime.play(speed,true);
        this.scheduleOnce(()=>{
            this.shineAnime.stop();
            this.shineAnime.node.getComponent(cc.Sprite).spriteFrame = null;
        },duration);
    }

    setBanker(active: boolean = false){
        this.kingIcon.active = active;
    }

    setStatus(type: Define.BetType, rate: number){
        cc.log("[playerStatus]" + Converter.getBetTypeText(type) + rate);
        let spr = Game.Inst.resourcesMgr.load(Converter.getBetTypeText(type) + rate);
        if (spr != null)
            this.status.spriteFrame = spr;
        else
            cc.error("Error: Load " + Converter.getBetTypeText(type) + rate + " failed.");
    }

    hideStatus(){
        //cc.log("[player] hide status");
        this.status.spriteFrame = null;
    }

    moneyChange(amount: number, moveDis: number = 40){
        //amount = Math.random()*1000 - 500;
        //cc.log("change" + amount + "move : " + moveDis);
        let str: string = "";
        let label: cc.Label;
        //set string
        if(amount >= 0) {
            str = "+";
            label = this.moneyPlus;
        }
        else{
            label = this.moneyMinus;
        }
        str += amount.toString()
        label.string = str;
        //anime
        let action = cc.sequence(
            cc.spawn(
                cc.moveBy(0.5,0,moveDis).easing(cc.easeBackOut()),
                cc.fadeIn(0.5)
            ),
            cc.delayTime(0.2),
            cc.fadeOut(0.5),
            //back to initial
            cc.moveBy(0,0,-moveDis),
            cc.callFunc(()=>{
                label.string = "";
            })
        )
        label.node.runAction(action);
    }

    talk(index: number) {

        let showString: string = Game.Inst.text.get("TalkMenu" + index.toString());
        this.talkBoxText.string = showString;

        let showT: number = 0.2;
        let delayT: number = 3;
        let outT: number = 0.2;
        this.talkBox.stopAllActions();
        this.talkBox.scaleY = 0;
        this.talkBox.opacity = 255;

        let seq = cc.sequence(
            cc.delayTime(0.01),
            cc.callFunc(() => {
                this.talkBox.setContentSize(this.talkBoxText.node.width + 80, this.talkBox.getContentSize().height);
                this.talkBoxText.node.position = cc.v2(40, 66);
            }),
            cc.scaleTo(showT, this.talkBox.scaleX, 1).easing(cc.easeBezierAction(0, 1, 1.12, 1)),
            cc.delayTime(delayT),
            cc.fadeOut(outT).easing(cc.easeCubicActionOut()),
            cc.callFunc(() => {
                this.talkBox.scaleY = 0;
                this.talkBox.opacity = 255;
            })
        );
        this.talkBox.runAction(seq);
    }

}
