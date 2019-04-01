
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    private cardScript: any = {
        rate: null,
        p1: null,
        p2: null,
        p3: null,
        p4: null,
        p5: null,
        type: null,
    }
    
    @property(cc.Node)
    chooseRate: cc.Node = null;
    @property(cc.Node)
    poker1: cc.Node = null;
    @property(cc.Node)
    poker2: cc.Node = null;
    @property(cc.Node)
    poker3: cc.Node = null;
    @property(cc.Node)
    poker4: cc.Node = null;
    @property(cc.Node)
    poker5: cc.Node = null;
    @property(cc.Node)
    cardType: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cardScript.rate = this.chooseRate.getComponent("PokerControl");
        this.cardScript.p1 = this.poker1.getComponent("PokerControl");
        this.cardScript.p2 = this.poker2.getComponent("PokerControl");
        this.cardScript.p3 = this.poker3.getComponent("PokerControl");
        this.cardScript.p4 = this.poker4.getComponent("PokerControl");
        this.cardScript.p5 = this.poker5.getComponent("PokerControl");
        this.cardScript.type = this.cardType.getComponent("PokerControl");

        this.cardScript.rate.setCanSelect(false);
        this.cardScript.p1.setCanSelect(false);
        this.cardScript.p2.setCanSelect(false);
        this.cardScript.p3.setCanSelect(false);
        this.cardScript.p4.setCanSelect(false);
        this.cardScript.p5.setCanSelect(false);
        this.cardScript.type.setCanSelect(false);
    }

    showRate(Info){ // Info傳來的是數字
        //var self = this;
        //self.cardScript.rate.showstatus("BetTest_" + "12");
        //self.cardScript.rate.showstatus("BetTest_9");
        //this.cardScript.rate.showstatus("grab_00");
        this.chooseRate.getComponent("PokerControl").showstatus("BetTest_" + Info);
    }

    showDeal(Info){
        this.chooseRate.getComponent("PokerControl").showstatus("grab_0" + Info);
    }

    showCards(Info){
        this.poker1.getComponent("PokerControl").showPoker(Info[0], false);
        this.poker2.getComponent("PokerControl").showPoker(Info[1], false);
        this.poker3.getComponent("PokerControl").showPoker(Info[2], false);
        this.poker4.getComponent("PokerControl").showPoker(Info[3], false);
        this.poker5.getComponent("PokerControl").showPoker(Info[4], false);
    }

    showCardType(Info){ // Info傳來的是字串
        let frame;
        let info;
        if (Info == 0) frame = "1"; // 沒牛背框
        else if (Info >= 1 && Info <= 6) frame = "2"; // 有牛1-6
        else if (Info >= 7 && Info <= 9) frame = "3"; // 有牛7-9
        else if (Info == 10) frame = "4"; // 牛牛
        else if (Info == 11) frame = "5"; // 銀牛
        else if (Info >= 12 && Info <= 14) frame = "6"; // 金牛以上
        if (Info <= 9) Info = "0" + Info;
        this.cardType.getComponent("PokerControl").showcardtype(Info, frame);

        //this.cardType.getComponent("PokerControl").showcardtype("14", "06");
        //this.cardType.getComponent("PokerControl").showcardtype("14","06");
    }

    start() {

    }
}
