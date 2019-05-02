import global from "../../Common/Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component 
{
    @property(cc.Sprite) head: cc.Sprite = null;
    @property(cc.Label) playerName: cc.Label = null;
    @property(cc.Label) money: cc.Label = null;
    private self: Player;
    start() 
    {
        cc.log("player onStart");

        // TEST data
        let id = "test id";
        let icon = "playerPic" + (Math.floor(Math.random() * 4) + 1);
        let credit = 1;//Math.floor(Math.random() * 1000000); 
        this.init(id, icon, credit);
    }

    init(id: string, headSprite: string, money: number){
        this.setName(id);
        this.setMoney(money);
        this.setHeadSprite(headSprite);
    }

    setHeadSprite(spriteName: string)
    {
        let spr = global.Instance.resources.load(spriteName);
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
        cc.log(this);
        this.playerName.string = str;
    }

    test(){
        cc.log("playerTest");
        this.setMoney(99999);
    }
}
