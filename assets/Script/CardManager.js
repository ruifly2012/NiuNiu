
cc.Class({
    extends: cc.Component,


    ctor: function () {
        this.CardObj = { // 之後會收到的封包資料
            currentStatus: {
                Me: null,
                Pre: null,
                Next: null,
                PrePre: null,
                NextNext: null,
            },
            cards:{
                Me: null,
                Pre: null,
                Next: null,
                PrePre: null,
                NextNext: null,
            },
            IsDizhu: {
                Me: null,
                Pre: null,
                Next: null,
                PrePre: null,
                NextNext: null,
            },

        };
        this.cardInfo = null;
        this.PokerSetScript = {
            Me: null,
            Pre: null,
            Next: null,
            PrePre: null,
            NextNext: null,
        };
        this.CardsPool = null;
    },

    properties: {
        // debug : 把他的小孩直接作為property，不用用找的了
        playerInfo: {
            default: null,
            type: cc.Node
        },
        currentStatus: {
            default: null,
            type: cc.Node
        },
        PokerSets: {
            default: null,
            type: cc.Node
        },
        CardChoose:{
            default: null,
            type: cc.Node
        },
        CardPool:{
            default: null,
            type: cc.Node
        }
    },

    init() {
        this.CardObj = {
            // 目前狀態
            currentStatus: {
                Me: cc.find("Me", this.currentStatus),
                Pre: cc.find("Pre", this.currentStatus),
                Next: cc.find("Next", this.currentStatus),
                PrePre: cc.find("PrePre", this.currentStatus),
                NextNext: cc.find("NextNext", this.currentStatus),
            },
            // 各家卡牌
            cards:{
                Me: cc.find("MePokerSet", this.PokerSets),
                Pre: cc.find("PrePokerSet", this.PokerSets),
                Next: cc.find("NextPokerSet", this.PokerSets),
                PrePre: cc.find("PrePrePokerSet", this.PokerSets),
                NextNext: cc.find("NextNextPokerSet", this.PokerSets),
            },
            // 是不是地主
            IsDizhu: {
                Me: cc.find("Me/dizhuIcon", this.playerInfo),
                Pre: cc.find("Pre/dizhuIcon", this.playerInfo),
                Next: cc.find("Next/dizhuIcon", this.playerInfo),
                PrePre: cc.find("PrePre/dizhuIcon", this.playerInfo),
                NextNext: cc.find("NextNext/dizhuIcon", this.playerInfo),
            },
        };

    },
    onEnable() {
        /*this.UpdateNewNewCards({

            IsDizhu: { Me: null, Pre: null, Next: null, PrePre: null, NextNext: null  }, // 誰是地主

            cards: { // 玩家手牌
                MyCards: [],
                NextRivalCards: [],
                PreRivalCards: [],
                NextNextRivalCards: [],
                PrePreRivalCards: [],
            },


            currentStatus: { // 目前狀態
                Me: [],
                Next: [],
                Pre: [],
                NextNext: [],
                PrePre: []
            }
        });*/
    },
    onLoad() { // 初始化相關操作
        var self = this;

        this.init(); // 讓變數找到在場景中真實的位置

        this.PokerSetScript.Me = this.CardObj.cards.Me.getComponent("PokerSet");
        this.PokerSetScript.Pre = this.CardObj.cards.Pre.getComponent("PokerSet");
        this.PokerSetScript.PrePre = this.CardObj.cards.PrePre.getComponent("PokerSet");
        this.PokerSetScript.Next = this.CardObj.cards.Next.getComponent("PokerSet");
        this.PokerSetScript.NextNext = this.CardObj.cards.NextNext.getComponent("PokerSet");

        this.CardsPool = this.CardPool.getComponent("CardPool");

        global.socket.on("GetCards", function (Info) {
            //將牌更新
            self.UpdateNewNewCards(Info);

        });
		
		global.socket.on("stageChange", function (stage) {//hide status
			self.currentStatus.active = false;
            self.PokerSets.active = false;
        });

        global.socket.on("kingsRate", function(Info){
            self.UpdateDealer(Info);
        });

        global.socket.on("playersRate", function(Info){
			cc.log("playerBet");
            self.UpdateBet(Info);
        });

    },

    UpdateDealer(Info){
        this.cardInfo = Info;
        var self = this;
        var CO = this.CardObj;

        self.CardObj.currentStatus.Me.getComponent("PokerControl").showstatus("grab_0" + (Info.player[0].playerRate).toString());
        self.CardObj.currentStatus.PrePre.getComponent("PokerControl").showstatus("grab_0" + (Info.player[1].playerRate).toString());
        self.CardObj.currentStatus.Pre.getComponent("PokerControl").showstatus("grab_0" + (Info.player[2].playerRate).toString());
        self.CardObj.currentStatus.Next.getComponent("PokerControl").showstatus("grab_0" + (Info.player[3].playerRate).toString());
        self.CardObj.currentStatus.NextNext.getComponent("PokerControl").showstatus("grab_0" + (Info.player[4].playerRate).toString());


		/*
		
        if(Info.IsDizhu.Me == true) this.CardObj.IsDizhu.Me.active = true;
        else if(Info.IsDizhu.Pre == true) this.CardObj.IsDizhu.Pre.active = true;
        else if(Info.IsDizhu.PrePre == true) this.CardObj.IsDizhu.PrePre.active = true;
        else if(Info.IsDizhu.Next == true) this.CardObj.IsDizhu.Next.active = true;
        else if(Info.IsDizhu.NextNext == true) this.CardObj.IsDizhu.NextNext.active = true;
		*/
		this.CardObj.IsDizhu.Me.active = true;
		
        self.currentStatus.active = true;
    },
    UpdateBet(Info){
        this.cardInfo = Info;
        var self = this;

        self.CardObj.currentStatus.Me.getComponent("PokerControl").showstatus("BetTest_" + (Info.player[0].playerRate).toString());
        self.CardObj.currentStatus.PrePre.getComponent("PokerControl").showstatus("BetTest_" + (Info.player[1].playerRate).toString());
        self.CardObj.currentStatus.Pre.getComponent("PokerControl").showstatus("BetTest_" + (Info.player[2].playerRate).toString());
        self.CardObj.currentStatus.Next.getComponent("PokerControl").showstatus("BetTest_" + (Info.player[3].playerRate).toString());
        self.CardObj.currentStatus.NextNext.getComponent("PokerControl").showstatus("BetTest_" + (Info.player[4].playerRate).toString());


        self.currentStatus.active = true;
    },

    // 當收到server傳來的封包時
    UpdateNewNewCards(Info){
        this.cardInfo = Info;
        var self = this;
        //步驟一：確認資料包裡面有沒有資料
        //沒有事情：0, 0, 0
        //搶莊：1, 1, 0
        //押注：0, 1, 0
        //選牛：0, 0, 1
        //結果：1, 1, 1

        let dealer = 0;
        let status = 0;
        let cards = 0;

        if(Info.IsDizhu.Me === true) dealer = 1;
        else if(Info.IsDizhu.Pre === true) dealer = 1;
        else if(Info.IsDizhu.PrePre === true) dealer = 1;
        else if(Info.IsDizhu.Next === true) dealer = 1;
        else if(Info.IsDizhu.NextNext === true) dealer = 1;

        if(Info.currentStatus.Me !== -1) status = 1;
        else if(Info.currentStatus.Pre !== -1) status = 1;
        else if(Info.currentStatus.PrePre !== -1) status = 1;
        else if(Info.currentStatus.Next !== -1) status = 1;
        else if(Info.currentStatus.NextNext !== -1) status = 1;

        if(Info.cards.Me[0] !== -1) cards = 1;
        else if(Info.cards.Pre[0] !== -1) cards = 1;
        else if(Info.cards.PrePre[0] !== -1) cards = 1;
        else if(Info.cards.Next[0] !== -1) cards = 1;
        else if(Info.cards.NextNext[0] !== -1) cards = 1;

        if(dealer === 0 && status === 0 && cards === 0 ){ // 無值不要show
            this.currentStatus.active = false;
            this.PokerSets.active = false;
        }
        /*else if(dealer === 1 && status === 1 && cards === 0 ){ // show搶莊結果
            this.CardObj.currentStatus.PrePre.getComponent("PokerControl").showstatus((Info.currentStatus.PrePre).toString());
            this.CardObj.currentStatus.Pre.getComponent("PokerControl").showstatus((Info.currentStatus.Pre).toString());
            this.CardObj.currentStatus.Me.getComponent("PokerControl").showstatus((Info.currentStatus.Me).toString());
            this.CardObj.currentStatus.Next.getComponent("PokerControl").showstatus((Info.currentStatus.Next).toString());
            this.CardObj.currentStatus.NextNext.getComponent("PokerControl").showstatus((Info.currentStatus.NextNext).toString());

            if(Info.IsDizhu.Me === true) this.CardObj.IsDizhu.Me.active = true;
            else if(Info.IsDizhu.Pre === true) this.CardObj.IsDizhu.Pre.active = true;
            else if(Info.IsDizhu.PrePre === true) this.CardObj.IsDizhu.PrePre.active = true;
            else if(Info.IsDizhu.Next === true) this.CardObj.IsDizhu.NextNext.active = true;
            else if(Info.IsDizhu.NextNext === true) this.CardObj.IsDizhu.NextNext.active = true;

            this.CardObj.currentStatus.currentStatus.active = true;
        }*/
        else if(dealer === 0 && status === 1 && cards === 1 ){ // playing stage
            //self.UpdateBet(Info);
            /*self.CardObj.cards.PrePre.showRate((Info.currentStatus.PrePre).toString());
            self.CardObj.cards.Pre.showRate((Info.currentStatus.Pre).toString());
            self.CardObj.cards.Me.showRate((Info.currentStatus.Me).toString());
            self.CardObj.cards.Next.showRate((Info.currentStatus.Next).toString());
            self.CardObj.cards.NextNext.showRate((Info.currentStatus.NextNext).toString());*/

            self.PokerSetScript.Me.showRate((Info.currentStatus.Me).toString());
            self.PokerSetScript.Pre.showRate((Info.currentStatus.Pre).toString());
            self.PokerSetScript.PrePre.showRate((Info.currentStatus.PrePre).toString());
            self.PokerSetScript.Next.showRate((Info.currentStatus.Next).toString());
            self.PokerSetScript.NextNext.showRate((Info.currentStatus.NextNext).toString());

            self.PokerSets.active = true;
            self.CardChoose.getComponent("showCard").showCard(Info.cards); // 展示可以選的五張卡

        }
        else if(dealer === 1 && status === 1 && cards === 1){ // result stage

            self.CardObj.cards.Me.active = true;


            if(Info.IsDizhu.Me == true) self.PokerSetScript.Me.showDeal((Info.currentStatus.Me).toString());
            else if(Info.IsDizhu.Pre == true) self.PokerSetScript.Pre.showDeal((Info.currentStatus.Pre).toString());
            else if(Info.IsDizhu.PrePre == true) self.PokerSetScript.PrePre.showDeal((Info.currentStatus.PrePre).toString());
            else if(Info.IsDizhu.Next == true) self.PokerSetScript.Next.showDeal((Info.currentStatus.Next).toString());
            else if(Info.IsDizhu.NextNext == true) self.PokerSetScript.NextNext.showDeal((Info.currentStatus.NextNext).toString());

            self.PokerSetScript.Me.showCards((Info.cards.Me));
            self.PokerSetScript.Pre.showCards((Info.cards.Pre));
            self.PokerSetScript.PrePre.showCards((Info.cards.PrePre));
            self.PokerSetScript.Next.showCards((Info.cards.Next));
            self.PokerSetScript.NextNext.showCards((Info.cards.NextNext));

            self.PokerSetScript.Me.showCardType((Info.cardType.Me).toString());
            self.PokerSetScript.Pre.showCardType((Info.cardType.Pre).toString());
            self.PokerSetScript.PrePre.showCardType((Info.cardType.PrePre).toString());
            self.PokerSetScript.Next.showCardType((Info.cardType.Next).toString());
            self.PokerSetScript.NextNext.showCardType((Info.cardType.NextNext).toString());



        }
    },

    /*GetCardInfo(Info) {
        var self = this;

        if (self.cardInfo == null)
            return "No Data";

        switch (Info) {
            case "Me":
                return self.cardInfo.MyCards.length;
            case "Pre":
                if (typeof (self.cardInfo.PreRivalCards) == "number")
                    return self.cardInfo.PreRivalCards;
                else
                    return self.cardInfo.PreRivalCards.length;
            case "Next":
                if (typeof (self.cardInfo.NextRivalCards) == "number")
                    return self.cardInfo.NextRivalCards;
                else
                    return self.cardInfo.NextRivalCards.length;
            case "MyCard":
                return self.cardInfo.MyCards;
            case "current":
                if (typeof (self.cardInfo.currentStatus.Pre) != "string")
                    return self.cardInfo.currentStatus.Pre;
                else if (typeof (self.cardInfo.currentStatus.Next) != "string")
                    return self.cardInfo.currentStatus.Next;
                else
                    return 0;
            default:
                return "ERROR";
        }
    },

    HintClicked(event, customData) {

        global.ButtonCounting += 1;
        this.Reselect();
        this.showHint(global.ButtonCounting);

    },
    //提示功能
    showHint(ButtonCounting) {

        var HintCards = findtype.GetAllType(this.GetCardInfo("MyCard"), this.GetCardInfo("current"));


        //若沒有任何適合的牌可壓，直接pass
        if (HintCards.length == 0) {
            global.EventListener.fire("Animation", "nolegalCard", "Me");
            //global.EventListener.fire("EndMyturn", global.roomid);
            global.ButtonCounting = -1;
            return;
        }
        //計算按下提示按鈕的次數以便挑選提示的牌
        if (ButtonCounting > HintCards.length - 1) {
            global.ButtonCounting = 0;
            ButtonCounting = 0;
        }

        //將提示的牌組跳起
        for (var k = 0; k < HintCards[ButtonCounting].length; k++) {
            var HintCardNO = HintCards[ButtonCounting][k].NO;
            for (var i = 0; i < this.CardObj.MyCards.getChildren().length; i++) {
                var Card = this.CardObj.MyCards.getChildren()[i].getComponent("PokerControl").CardInfo.data;
                var CardNO = Card.NO;
                if (HintCardNO == CardNO) {
                    this.CardObj.MyCards.getChildren()[i].getComponent("PokerControl").select();
                }

            }
        }

    },

    callDouble(event, customData) {
        global.EventListener.fire("CallDouble", parseInt(customData));
    },

    UpdateCards(Info) {

        this.cardInfo = Info;

        //顯示地主的三張底牌
        if (Info.DizhuCards.length != 0) {
            this.CardObj.DizhuCards.active = true;
        }
        else {
            this.CardObj.DizhuCards.active = false;
        }
        this.cardsPool.ArrangeCards(Info.DizhuCards, this.CardObj.DizhuCards, false);

        //顯示自己的手牌
        this.cardsPool.ArrangeCards(Info.MyCards, this.CardObj.MyCards, true);

        //顯示前一個對手的牌數
        if (typeof (Info.PreRivalCards) == "number") {

            this.cardsPool.ArrangeCards(Info.PreRivalCards != 0 ? [null] : [], this.CardObj.PreRivalCards.getChildren()[0], false);
            this.cardsPool.ArrangeCards([], this.CardObj.PreRivalCards.getChildren()[1], false);
            this.CardObj.PreRivalCardsNum.getComponent("Num2Sprite").setNum(Info.PreRivalCards != 0 ? Info.PreRivalCards : "");

        }
        else if (typeof (Info.PreRivalCards) == "object") {

            this.CardObj.PreRivalCardsNum.getComponent("Num2Sprite").setNum("");
            this.cardsPool.ArrangeCards(Info.PreRivalCards.slice(0, 10), this.CardObj.PreRivalCards.getChildren()[0], false);
            this.cardsPool.ArrangeCards(Info.PreRivalCards.slice(10, 20), this.CardObj.PreRivalCards.getChildren()[1], false);
        }


        //顯示下一個對手的牌數

        if (typeof (Info.NextRivalCards) == "number") {

            this.cardsPool.ArrangeCards(Info.NextRivalCards != 0 ? [null] : [], this.CardObj.NextRivalCards.getChildren()[0], false);
            this.cardsPool.ArrangeCards([], this.CardObj.NextRivalCards.getChildren()[1], false);
            this.CardObj.NextRivalCardsNum.getComponent("Num2Sprite").setNum(Info.NextRivalCards != 0 ? Info.NextRivalCards : "");
        }
        else if (typeof (Info.NextRivalCards) == "object") {
            this.CardObj.NextRivalCardsNum.getComponent("Num2Sprite").setNum("");
            this.cardsPool.ArrangeCards(Info.NextRivalCards.slice(0, 10), this.CardObj.NextRivalCards.getChildren()[0], false);
            this.cardsPool.ArrangeCards(Info.NextRivalCards.slice(10, 20), this.CardObj.NextRivalCards.getChildren()[1], false);
        }

        //顯示目前牌面上的牌
        this.cardsPool.ArrangeCards(Info.currentStatus.Me, this.CardObj.currentStatus.Me, false);
        this.cardsPool.ArrangeCards(Info.currentStatus.Pre, this.CardObj.currentStatus.Pre, false);
        this.cardsPool.ArrangeCards(Info.currentStatus.Next, this.CardObj.currentStatus.Next, false);


        //顯示地主頭像
        if (Info.IsDizhu.Me == null) {
            this.CardObj.IsDizhu.Me.active = false;
        }
        else {
            this.CardObj.IsDizhu.Me.active = true;
        }

        if (Info.IsDizhu.Pre == null) {
            this.CardObj.IsDizhu.Pre.active = false;
        }
        else {
            this.CardObj.IsDizhu.Pre.active = true;
        }

        if (Info.IsDizhu.Next == null) {
            this.CardObj.IsDizhu.Next.active = false;
        }
        else {
            this.CardObj.IsDizhu.Next.active = true;
        }

        if (Info.IsDizhu.PrePre == null) {
            this.CardObj.IsDizhu.PrePre.active = false;
        }
        else {
            this.CardObj.IsDizhu.PrePre.active = true;
        }

        if (Info.IsDizhu.NextNext == null) {
            this.CardObj.IsDizhu.NextNext.active = false;
        }
        else {
            this.CardObj.IsDizhu.NextNext.active = true;
        }


    },

    SubmitCard() {
        var self = this;
        var cards = [];

        this.CardObj.MyCards.children.forEach(function (card) {
            if (card.getPositionY() == 20)
                cards.push(card.getComponent("PokerControl").getValue());
        });
        cc.log(LaiZifindType.findCardType(cards));
        console.log(cards);
        global.EventListener.fire("SubmitCards", cards);
    },

    ChoseDizhu(event, customData) {
        global.EventListener.fire("ChoseDizhu", customData);
    },

    LaiZiCardSelect(event, customData) {
        global.EventListener.fire("SubmitCards", parseInt(customData));
    },

    Reselect() {
        var self = this;
        this.CardObj.MyCards.children.forEach(function (card) {

            card.getComponent("PokerControl").unselect();
        });
    },
    */
});
