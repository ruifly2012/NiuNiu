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
    @property(cc.Node) shiny: cc.Node  = null;
    @property(SequenceAnimation) shineAnime: SequenceAnimation = null;
    @property(cc.Label) moneyPlus: cc.Label = null;
    @property(cc.Label) moneyMinus: cc.Label = null;
    @property(cc.Node) talkBox: cc.Node = null;
    private talkBoxText: cc.Label = null;
    private gender: string = "female";
    
    start() 
    {
        //cc.log("player onStart");
        this.talkBoxText = this.talkBox.getChildByName("Text").getComponent(cc.Label);
    }

    init(id: string, headIconID: string, money: number, gender: string)
    {
        this.setName(id);
        this.setMoney(money);
        this.setHeadSprite((gender == "male"? "element_avatar-m": "element_avatar-s") + headIconID);
        this.setBanker(false);
        this.gender = gender;
        this.shiny.opacity = 0;
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

    getMoney(): number{
        return parseInt(this.money.string);
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
        this.shineAnime.stop();
        this.shineAnime.play(speed,true);
        this.scheduleOnce(()=>{
            this.shineAnime.stop();
            this.shineAnime.node.getComponent(cc.Sprite).spriteFrame = null;
        },duration);
    }

    /**
     * 搶莊動畫
     * @param interval 顯現/隱藏所需時間
     * @param duration 停留時間
     */
    bankerAnime(duration: number = 0.1){
        this.shiny.stopAllActions();
        this.shiny.opacity = 0;
        let seq =cc.sequence(
            cc.callFunc(() => {
                this.shiny.opacity = 255;
            }),
            cc.delayTime(duration),
            cc.callFunc(() => {
                this.shiny.opacity = 0;
            })
        )
        this.shiny.runAction(seq);
    }

    setBanker(active: boolean = false, interval: number = 0.15){
        this.kingIcon.runAction(active? cc.fadeIn(interval): cc.fadeOut(interval));
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

    moneyChange(amount: number, moveDis: number = 40, final_coin: number){
        this.scheduleOnce(()=>this.setMoney(final_coin),0.5);
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
        let action = cc.spawn(
            cc.moveBy(0.5,0,moveDis).easing(cc.easeBackOut()),
            cc.fadeIn(0.5)
        );
        label.node.runAction(action);
    }

    talk(index: number) {

        let showString: string = Game.Inst.text.get("TalkMenu" + index.toString());
	    let voiceName: string = "voice_talk_b";
        this.talkBoxText.string = showString;
        if(this.gender == "female"){
            voiceName = "voice_talk_g";
        }
        voiceName += index.toString();
        

        //animation setting
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
            cc.callFunc(()=>{
                Game.Inst.audioMgr.playVoice(voiceName);
            }),
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
