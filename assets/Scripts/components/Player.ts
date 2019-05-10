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
    
    start() 
    {
        cc.log("player onStart");

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
    setShiny(speed: number = 2, duration: number = 2){
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
        cc.log("[player] hide status");
        this.status.spriteFrame = null;
    }

    moneyChange(amount: number){
        //amount = Math.random()*1000 - 500;
        cc.log("change" + amount);
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
                cc.moveBy(0.5,0,50).easing(cc.easeBackOut()),
                cc.fadeIn(0.5)
            ),
            cc.delayTime(0.2),
            cc.fadeOut(0.5),
            //back to initial
            cc.moveBy(0,0,-50),
            cc.callFunc(()=>{
                label.string = "";
            })
        )
        label.node.runAction(action);
    }

}
