import Game from "../Game";
import Converter, * as Define from "../Define";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component 
{
    @property(cc.Sprite) head: cc.Sprite = null;
    @property(cc.Label) id: cc.Label = null;
    @property(cc.Label) money: cc.Label = null;
    @property(cc.Node) shineBG: cc.Node = null;
    @property(cc.Node) kingIcon: cc.Node = null;
    @property(cc.Sprite) status: cc.Sprite  = null;
    
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
        this.shineBG.opacity = 0;
        this.setName(id);
        this.setMoney(money);
        this.setHeadSprite(headSprite);
        this.setShiny(false);
        this.setKing(false);
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

    setShiny(active: boolean)
    {
        let t = 0.2;
        this.shineBG.runAction(active? cc.fadeIn(t): cc.fadeOut(t));
    }

    setKing(active: boolean = false){
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
}
