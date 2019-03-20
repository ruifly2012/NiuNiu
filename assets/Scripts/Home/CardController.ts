import global from "../Common/Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardController extends cc.Component {

    private CardObj: any = {
        currentStatus: {
            Me: null,
            Pre: null,
            Next: null,
            PrePre: null,
            NextNext: null,
        },
        cards: {
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
        }
    };

    private cardInfo: any = null;

    private PokerSetScript: any = {
        Me: null,
        Pre: null,
        Next: null,
        PrePre: null,
        NextNext: null,
    };
    private CardsPool: any = null;
    private TimerScript: any = null;
    private dealerBet: any = { // 記錄他們的搶莊倍率
        Me: null,
        Pre: null,
        Next: null,
        PrePre: null,
        NextNext: null,
    };
    private personalBet: any = { // 記錄他們的押注倍律
        Me: null,
        Pre: null,
        Next: null,
        PrePre: null,
        NextNext: null,
    };

    @property(cc.Node)
    playerInfo: cc.Node = null;

    @property(cc.Node)
    currentStatus: cc.Node = null;

    @property(cc.Node)
    PokerSets: cc.Node = null;

    @property(cc.Node)
    CardChoose: cc.Node = null;

    @property(cc.Node)
    Timer: cc.Node = null;

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
            cards: {
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

        cc.log("init cardobj");

    }
    onEnable() {
    
    }
    onLoad() { // 初始化相關操作
        var self = this;

        this.init(); // 讓變數找到在場景中真實的位置

        this.PokerSetScript.Me = this.CardObj.cards.Me.getComponent("PokerSet");
        this.PokerSetScript.Pre = this.CardObj.cards.Pre.getComponent("PokerSet");
        this.PokerSetScript.PrePre = this.CardObj.cards.PrePre.getComponent("PokerSet");
        this.PokerSetScript.Next = this.CardObj.cards.Next.getComponent("PokerSet");
        this.PokerSetScript.NextNext = this.CardObj.cards.NextNext.getComponent("PokerSet");
        this.TimerScript = this.Timer.getComponent("TimeController");
       
        global.Instance.EventListener.on("stageChange", function (event, stage, timeout) {
            //self.currentStatus.active = false;
            self.CardObj.currentStatus.Me.active = false;
            self.CardObj.currentStatus.Pre.active = false;
            self.CardObj.currentStatus.Next.active = false;
            self.CardObj.currentStatus.PrePre.active = false;
            self.CardObj.currentStatus.NextNext.active = false;
            cc.log("make all currentstatus flase");
            if (stage !== 5) {
                self.CardObj.cards.Me.active = false;
                self.CardObj.cards.Pre.active = false;
                self.CardObj.cards.Next.active = false;
                self.CardObj.cards.PrePre.active = false;
                self.CardObj.cards.NextNext.active = false;
            }
            else if (stage === 5) {
                self.CardObj.cards.Me.active = true;
            }

            //self.PokerSets.active = false; // 當階段到result時，直接顯示PokerSets
        });


        global.Instance.EventListener.on("kingsRate", function (event, Info) {
            self.UpdateDealer(Info);
        });

        global.Instance.EventListener.on("playersRate", function (event, Info) {
            cc.log("playerBet");
            self.UpdateBet(Info);
        });
        global.Instance.EventListener.on("myCard", function (event, Info) {
            //將牌更新
            self.UpdateMyCard(Info);

        });
        global.Instance.EventListener.on("eachPlayerCard", function (event, Info) {
            //將牌更新
            self.UpdateNewNewCards(Info);

        });
        global.Instance.EventListener.on("pokerAnimation", function (event, Info) {
            self.playPokerAnimation(Info);
        });

    }

    UpdateDealer(Info){
        this.cardInfo = Info;
        var self = this;
        var CO = this.CardObj;

        if (Info.Me.playerRate !== -1) {
            self.CardObj.currentStatus.Me.getComponent("PokerControl").showstatus("grab_0" + (Info.Me.playerRate).toString());
            this.CardObj.currentStatus.Me.active = true;
        }
        if (Info.PrePre.playerRate !== -1) {
            self.CardObj.currentStatus.PrePre.getComponent("PokerControl").showstatus("grab_0" + (Info.PrePre.playerRate).toString());
            this.CardObj.currentStatus.PrePre.active = true;
        }
        if (Info.Pre.playerRate !== -1) {
            self.CardObj.currentStatus.Pre.getComponent("PokerControl").showstatus("grab_0" + (Info.Pre.playerRate).toString());
            this.CardObj.currentStatus.Pre.active = true;
        }
        if (Info.Next.playerRate !== -1) {
            self.CardObj.currentStatus.Next.getComponent("PokerControl").showstatus("grab_0" + (Info.Next.playerRate).toString());
            this.CardObj.currentStatus.Next.active = true;
        }
        if (Info.NextNext.playerRate !== -1) {
            self.CardObj.currentStatus.NextNext.getComponent("PokerControl").showstatus("grab_0" + (Info.NextNext.playerRate).toString());
            this.CardObj.currentStatus.NextNext.active = true;
        }

        self.dealerBet.Me = (Info.Me.playerRate);
        self.dealerBet.PrePre = (Info.PrePre.playerRate);
        self.dealerBet.Pre = (Info.Pre.playerRate);
        self.dealerBet.Next = (Info.Next.playerRate);
        self.dealerBet.NextNext = (Info.NextNext.playerRate);

        if (Info.Me.king == true) {
            this.CardObj.IsDizhu.Me.active = true;
            this.TimerScript.unscheduleTimer();
            this.TimerScript.activeButton(-1);
        }
        else if (Info.Pre.king == true) {
            this.CardObj.IsDizhu.Pre.active = true;
            this.TimerScript.unscheduleTimer();
            this.TimerScript.activeButton(-1);
        }
        else if (Info.PrePre.king == true) {
            this.CardObj.IsDizhu.PrePre.active = true;
            this.TimerScript.unscheduleTimer();
            this.TimerScript.activeButton(-1);
        }
        else if (Info.Next.king == true) {
            this.CardObj.IsDizhu.Next.active = true;
            this.TimerScript.unscheduleTimer();
            this.TimerScript.activeButton(-1);
        }
        else if (Info.NextNext.king == true) {
            this.CardObj.IsDizhu.NextNext.active = true;
            this.TimerScript.unscheduleTimer();
            this.TimerScript.activeButton(-1);
        }

        //self.currentStatus.active = true;
    }

    UpdateBet(Info){
        this.cardInfo = Info;
        var self = this;
        let unclockTime = 0;
        if (Info.Me.playerRate !== -1) {
            self.CardObj.currentStatus.Me.getComponent("PokerControl").showstatus("BetTest_" + (Info.Me.playerRate).toString());
            this.CardObj.currentStatus.Me.active = true;
            unclockTime++;
        }
        if (Info.PrePre.playerRate !== -1) {
            self.CardObj.currentStatus.PrePre.getComponent("PokerControl").showstatus("BetTest_" + (Info.PrePre.playerRate).toString());
            this.CardObj.currentStatus.PrePre.active = true;
            unclockTime++;
        }
        if (Info.Pre.playerRate !== -1) {
            self.CardObj.currentStatus.Pre.getComponent("PokerControl").showstatus("BetTest_" + (Info.Pre.playerRate).toString());
            this.CardObj.currentStatus.Pre.active = true;
            unclockTime++;
        }
        if (Info.Next.playerRate !== -1) {
            self.CardObj.currentStatus.Next.getComponent("PokerControl").showstatus("BetTest_" + (Info.Next.playerRate).toString());
            this.CardObj.currentStatus.Next.active = true;
            unclockTime++;
        }
        if (Info.NextNext.playerRate !== -1) {
            self.CardObj.currentStatus.NextNext.getComponent("PokerControl").showstatus("BetTest_" + (Info.NextNext.playerRate).toString());
            this.CardObj.currentStatus.NextNext.active = true;
            unclockTime++;
        }

        if (unclockTime === 5) {
            this.TimerScript.unscheduleTimer();
            this.TimerScript.activeButton(-1);
        }

        /*self.CardObj.currentStatus.Me.getComponent("PokerControl").showstatus("BetTest_" + (Info.Me.playerRate).toString());
        self.CardObj.currentStatus.PrePre.getComponent("PokerControl").showstatus("BetTest_" + (Info.PrePre.playerRate).toString());
        self.CardObj.currentStatus.Pre.getComponent("PokerControl").showstatus("BetTest_" + (Info.Pre.playerRate).toString());
        self.CardObj.currentStatus.Next.getComponent("PokerControl").showstatus("BetTest_" + (Info.Next.playerRate).toString());
        self.CardObj.currentStatus.NextNext.getComponent("PokerControl").showstatus("BetTest_" + (Info.NextNext.playerRate).toString());*/

        //self.currentStatus.active = true;
    }

    UpdateMyCard(Info){
        var self = this;

        self.PokerSetScript.Me.showRate((Info.currentStatus.Me).toString());
        self.PokerSetScript.Pre.showRate((Info.currentStatus.Pre).toString());
        self.PokerSetScript.PrePre.showRate((Info.currentStatus.PrePre).toString());
        self.PokerSetScript.Next.showRate((Info.currentStatus.Next).toString());
        self.PokerSetScript.NextNext.showRate((Info.currentStatus.NextNext).toString());
        self.CardObj.cards.Pre.active = true;
        self.CardObj.cards.Next.active = true;
        self.CardObj.cards.PrePre.active = true;
        self.CardObj.cards.NextNext.active = true;
        // self.PokerSets.active = true;

        self.CardChoose.getComponent("ShowCard").showCard(Info.cards); // 展示可以選的五張卡

    }


    UpdateNewNewCards(Info){
        var self = this;// 記得加這行
        cc.log("enter update newnew card");

        //self.CardObj.cards.Me.active = true;
        //self.PokerSets.active = true;

        if (Info.isKing.Me == true) {
            self.PokerSetScript.Me.showDeal((Info.currentStatus.Me).toString());
        }
        else if (Info.isKing.Pre == true) {
            self.PokerSetScript.Pre.showDeal((Info.currentStatus.Pre).toString());
        }
        else if (Info.isKing.PrePre == true) {
            self.PokerSetScript.PrePre.showDeal((Info.currentStatus.PrePre).toString());
        }
        else if (Info.isKing.Next == true) {
            self.PokerSetScript.Next.showDeal((Info.currentStatus.Next).toString());
        }
        else if (Info.isKing.NextNext == true) {
            self.PokerSetScript.NextNext.showDeal((Info.currentStatus.NextNext).toString());
        }


        if (Info.displayCard.Me == true) {
            self.PokerSetScript.Me.showCards((Info.cards.Me));
            self.PokerSetScript.Me.showCardType((Info.cardType.Me).toString());
            self.CardObj.cards.Me.active = true;
            //global.EventListener.fire("Animation", Info.animation.Me);
        }
        if (Info.displayCard.Pre == true) {
            self.PokerSetScript.Pre.showCards((Info.cards.Pre));
            self.PokerSetScript.Pre.showCardType((Info.cardType.Pre).toString());
            self.CardObj.cards.Pre.active = true;
        }
        if (Info.displayCard.Next == true) {
            self.PokerSetScript.Next.showCards((Info.cards.Next));
            self.PokerSetScript.Next.showCardType((Info.cardType.Next).toString());
            self.CardObj.cards.Next.active = true;
        }
        if (Info.displayCard.PrePre == true) {
            self.PokerSetScript.PrePre.showCards((Info.cards.PrePre));
            self.PokerSetScript.PrePre.showCardType((Info.cardType.PrePre).toString());
            self.CardObj.cards.PrePre.active = true;
        }
        if (Info.displayCard.NextNext == true) {
            self.PokerSetScript.NextNext.showCards((Info.cards.NextNext));
            self.PokerSetScript.NextNext.showCardType((Info.cardType.NextNext).toString());
            self.CardObj.cards.NextNext.active = true;
        }

        /*self.CardObj.cards.Me.active = true;
        self.CardObj.cards.Pre.active = true;
        self.CardObj.cards.Next.active = true;
        self.CardObj.cards.PrePre.active = true;
        self.CardObj.cards.NextNext.active = true;

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

        global.EventListener.fire("Animation", Info.animation.Me);*/
        /*setTimeout(function(){
            global.EventListener.fire("Animation", Info.animation.Pre);//goto deal rate after 3sec
            cc.log("Pre Animation");
        },1500);
        setTimeout(function(){

            global.EventListener.fire("Animation", Info.animation.Next);
            cc.log("Next Animation");
        },3000);
        setTimeout(function(){
            global.EventListener.fire("Animation", Info.animation.PrePre);
            cc.log("PrePre Animation");
        },4500);
        setTimeout(function(){
            global.EventListener.fire("Animation", Info.animation.NextNext);
            cc.log("NextNext Animation");
        },6000);*/
        //global.EventListener.fire("Animation", Info.animation.Pre);
        //global.EventListener.fire("Animation", Info.animation.Next);
        //global.EventListener.fire("Animation", Info.animation.PrePre);
        //global.EventListener.fire("Animation", Info.animation.NextNext);

    }

    playPokerAnimation(Info){
        global.Instance.EventListener.notify("Animation", Info.Me);
    }

    clearTimer(){
        this.TimerScript.unscheduleTimer();
        this.TimerScript.activeButton(-1);
    }


    // determine dealer
    noButtonClick() {
        global.Instance.network.socket().emit("kingRate", global.Instance.uid, 0);
        this.TimerScript.unscheduleTimer();
        this.TimerScript.activeButton(-1);
        //global.EventListener.fire("dealerButton", 0);
    }

    oneButtonClick(){
        global.Instance.network.socket().emit("kingRate", global.Instance.uid, 1);
        this.TimerScript.unscheduleTimer();
        this.TimerScript.activeButton(-1);
        //global.EventListener.fire("dealerButton", 1);
    }

    doubleButtonClick(){
        global.Instance.network.socket().emit("kingRate", global.Instance.uid, 2);
        this.TimerScript.unscheduleTimer();
        this.TimerScript.activeButton(-1);
        //global.EventListener.fire("dealerButton", 2);
    }

    tripleButtonClick(){
        global.Instance.network.socket().emit("kingRate", global.Instance.uid, 3);
        this.TimerScript.unscheduleTimer();
        this.TimerScript.activeButton(-1);
        //this.button.active = false;
        //global.EventListener.fire("dealerButton", 3);
    }


    // bet
    threeButtonClick() {
        global.Instance.network.socket().emit("playerRate", global.Instance.uid, 3);
        this.TimerScript.unscheduleTimer();
        this.TimerScript.activeButton(-1);
        cc.log("3bet");
        //global.EventListener.fire("dealerButton", 0);
    }
    sixButtonClick() {
        global.Instance.network.socket().emit("playerRate", global.Instance.uid, 6);
        this.TimerScript.unscheduleTimer();
        this.TimerScript.activeButton(-1);
        cc.log("6bet");
        //global.EventListener.fire("dealerButton", 1);
    }
    nineButtonClick() {
        global.Instance.network.socket().emit("playerRate", global.Instance.uid, 9);
        this.TimerScript.unscheduleTimer();
        this.TimerScript.activeButton(-1);
        cc.log("9bet");
        //global.EventListener.fire("dealerButton", 2);
    }
    twelveButtonClick() {
        global.Instance.network.socket().emit("playerRate", global.Instance.uid, 12);
        this.TimerScript.unscheduleTimer();
        this.TimerScript.activeButton(-1);
        cc.log("12bet");
        //global.EventListener.fire("dealerButton", 3);
    }
    fifteenButtonClick() {
        global.Instance.network.socket().emit("playerRate", global.Instance.uid, 15);
        this.TimerScript.unscheduleTimer();
        this.TimerScript.activeButton(-1);
        cc.log("15bet");
        //this.button.active = false;
        //global.EventListener.fire("dealerButton", 3);
    }

    noBuffButtonClick(){
        var self = this;
        if (!self.CardChoose.getComponent("ShowCard").isThreeSelected()) {
            self.CardChoose.getComponent("ShowCard").cardError.active = true;
            return;
        }

        self.CardChoose.getComponent("ShowCard").cardError.active = false;
        global.Instance.network.socket().emit("getPlayersCard", global.Instance.uid);
        this.TimerScript.unscheduleTimer();
        this.TimerScript.activeButton(-1);
        self.CardObj.cards.Me.active = true;
    }

    haveBuffButtonClick(){
        var self = this;
        if (!self.CardChoose.getComponent("ShowCard").isDoubleOfTen() || !self.CardChoose.getComponent("ShowCard").isThreeSelected()) {
            self.CardChoose.getComponent("ShowCard").cardError.active = true;
            return;
        }

        self.CardChoose.getComponent("ShowCard").cardError.active = false;
        global.Instance.network.socket().emit("getPlayersCard", global.Instance.uid);
        // global.socket.emit("getPlayersCard", global.uid);
        this.TimerScript.unscheduleTimer();
        this.TimerScript.activeButton(-1);
        self.CardObj.cards.Me.active = true;
    }


}
