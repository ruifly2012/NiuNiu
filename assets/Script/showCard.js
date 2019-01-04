
cc.Class({
    extends: cc.Component,

    ctor: function () {

        this.CardInfo = {
            canselect: true,
            selected: false,
            data: null
        };
    },

    properties : {
        poker1:{
            default: null,
            type: cc.Node
        },
        poker2:{
            default: null,
            type: cc.Node
        },
        poker3:{
            default: null,
            type: cc.Node
        },
        poker4:{
            default: null,
            type: cc.Node
        },
        poker5: {
            default: null,
            type: cc.Node
        },

    },
    showCard(pokers){
        this.poker1.getComponent("PokerControl").setCard(pokers.Me[0], true);
        this.poker2.getComponent("PokerControl").setCard(pokers.Me[1], true);
        this.poker3.getComponent("PokerControl").setCard(pokers.Me[2], true);
        this.poker4.getComponent("PokerControl").setCard(pokers.Me[3], true);
        this.poker5.getComponent("PokerControl").setCard(pokers.Me[4], true);
    },
    showButtonClick(){

        var pokerCardType = {
            spade: "spade",//黑桃
            hearts: "hearts",//红桃
            redslice: "redslice",//红方
            blackberry: "blackberry",//黑梅
        };
        var cardNo = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
        var pokerDataItem1 = {
            showTxt: cardNo[0],
            showType: pokerCardType["spade"],
            NO: 1
        };
        var pokerDataItem2 = {
            showTxt: cardNo[11],
            showType: pokerCardType["hearts"],
            NO: 2
        };
        var pokerDataItem3 = {
            showTxt: cardNo[12],
            showType: pokerCardType["redslice"],
            NO: 3
        };
        var pokerDataItem4 = {
            showTxt: cardNo[6],
            showType: pokerCardType["blackberry"],
            NO: 4
        };
        var pokerDataItem5 = {
            showTxt: cardNo[8],
            showType: pokerCardType["spade"],
            NO: 5
        };

        // 要存取自己的東西要先加this
        this.poker1.getComponent("PokerControl").setCard(pokerDataItem1, true);
        this.poker2.getComponent("PokerControl").setCard(pokerDataItem2, true);
        this.poker3.getComponent("PokerControl").setCard(pokerDataItem3, true);
        this.poker4.getComponent("PokerControl").setCard(pokerDataItem4, true);
        this.poker5.getComponent("PokerControl").setCard(pokerDataItem5, true);


        this.poker1.getComponent("PokerControl").CardInfo.canselect = true;
        this.poker2.getComponent("PokerControl").CardInfo.canselect = true;
        this.poker3.getComponent("PokerControl").CardInfo.canselect = true;
        this.poker4.getComponent("PokerControl").CardInfo.canselect = true;
        this.poker5.getComponent("PokerControl").CardInfo.canselect = true;
    },

    onLoad(){

    },

    start () {

    },


});
