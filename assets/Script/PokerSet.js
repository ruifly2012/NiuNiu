// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    ctor: function () {
        this.cardScript = {
            rate: null,
            p1: null,
            p2: null,
            p3: null,
            p4: null,
            p5: null,
            type: null,
        };
    },


    properties: {
        chooseRate: {
            default: null,
            type: cc.Node
        },
        poker1: {
            default: null,
            type: cc.Node
        },
        poker2: {
            default: null,
            type: cc.Node
        },
        poker3:{
            default: null,
            type: cc.Node
        },
        poker4: {
            default: null,
            type: cc.Node
        },
        poker5: {
            default: null,
            type: cc.Node
        },
        cardType: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.cardScript.rate = this.chooseRate.getComponent("PokerControl");
        this.cardScript.p1 = this.poker1.getComponent("PokerControl");
        this.cardScript.p2 = this.poker2.getComponent("PokerControl");
        this.cardScript.p3 = this.poker3.getComponent("PokerControl");
        this.cardScript.p4 = this.poker4.getComponent("PokerControl");
        this.cardScript.p5 = this.poker5.getComponent("PokerControl");
        this.cardScript.type = this.cardType.getComponent("PokerControl");

    },

    showRate(Info){ // Info傳來的是數字
        //var self = this;
        //self.cardScript.rate.showstatus("BetTest_" + "12");
        //self.cardScript.rate.showstatus("BetTest_9");
        //this.cardScript.rate.showstatus("grab_00");
        this.chooseRate.getComponent("PokerControl").showstatus("BetTest_" + Info);
    },

    showDeal(Info){
        this.chooseRate.getComponent("PokerControl").showstatus("grab_0" + Info);
    },

    showCards(Info){
        this.poker1.getComponent("PokerControl").showPoker(Info[0], false);
        this.poker2.getComponent("PokerControl").showPoker(Info[1], false);
        this.poker3.getComponent("PokerControl").showPoker(Info[2], false);
        this.poker4.getComponent("PokerControl").showPoker(Info[3], false);
        this.poker5.getComponent("PokerControl").showPoker(Info[4], false);
    },

    showCardType(Info){ // Info傳來的是數字
        let frame;
        if(Info == 0) frame = "1"; // 沒牛背框
        else if(Info >= 1 && Info <= 6) frame = "2"; // 有牛1-6
        else if(Info >= 7 && Info <= 9) frame = "3"; // 有牛7-9
        else if(Info == 10) frame = "4"; // 牛牛
        else if(Info == 11) frame = "5"; // 銀牛
        else if(Info >= 12 && Info <= 14) frame = "6"; // 金牛以上
        this.cardType.getComponent("PokerControl").showcardtype(Info,frame);

        //this.cardType.getComponent("PokerControl").showcardtype("14", "06");
        //this.cardType.getComponent("PokerControl").showcardtype("14","06");
    },

    start () {

    },

    // update (dt) {},
});
