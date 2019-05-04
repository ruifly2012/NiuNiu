import global from "../../Common/Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StageController extends cc.Component {


    private static inst: StageController = null;

    static get Inst(): StageController{
        if(!StageController.inst){
            return undefined
        }
        return this.inst;
    }

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
        },
        myCardType: null
    };



    private cardInfo: any = null;

    private PokerSetScript: any = {
        Me: null,
        Pre: null,
        Next: null,
        PrePre: null,
        NextNext: null,
    };
    private TimerScript: any = null;
    private PlayerInfoScript: any = null;
    private dealerBet: any = { // �O���L�̪��m�����v
        Me: null,
        Pre: null,
        Next: null,
        PrePre: null,
        NextNext: null,
    };
    private personalBet: any = { // �O���L�̪���`����
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
            // �ثe���A
            currentStatus: {
                Me: cc.find("Me", this.currentStatus),
                Pre: cc.find("Pre", this.currentStatus),
                Next: cc.find("Next", this.currentStatus),
                PrePre: cc.find("PrePre", this.currentStatus),
                NextNext: cc.find("NextNext", this.currentStatus),
            },
            // �U�a�d�P
            cards: {
                Me: cc.find("MePokerSet", this.PokerSets),
                Pre: cc.find("PrePokerSet", this.PokerSets),
                Next: cc.find("NextPokerSet", this.PokerSets),
                PrePre: cc.find("PrePrePokerSet", this.PokerSets),
                NextNext: cc.find("NextNextPokerSet", this.PokerSets),
            },
            // �O���O�a�D
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
    onLoad() { // ��l�Ƭ����ާ@
        let self = this;
        StageController.inst = this;

        this.init(); // ���ܼƧ��b�������u�ꪺ��m

        this.PokerSetScript.Me = this.CardObj.cards.Me.getComponent("PokerSet");
        this.PokerSetScript.Pre = this.CardObj.cards.Pre.getComponent("PokerSet");
        this.PokerSetScript.PrePre = this.CardObj.cards.PrePre.getComponent("PokerSet");
        this.PokerSetScript.Next = this.CardObj.cards.Next.getComponent("PokerSet");
        this.PokerSetScript.NextNext = this.CardObj.cards.NextNext.getComponent("PokerSet");
        this.TimerScript = this.Timer.getComponent("TimeController");
        this.PlayerInfoScript = this.playerInfo.getComponent("PlayerInfoViewController");

        global.Instance.EventListener.on("stageChange", function (event, stage, timeout) {
            self.TimerScript.activeButton(stage);

            switch (stage) {
                case 0: // stage 0 : waiting stage
                case 1: // stage 1 : gameStart stage
                    self.hideCurrentStatus(); // hide king and bet image
                    self.hideCardSets(); // hide card set
                    self.TimerScript.hideClock(); // hide middle count down clock
                    break;
                case 2: // stage 2 : kings stage
                case 3: // stage 3 : bet stage
                case 4: // stage 4 : choose card stage
                    self.hideCurrentStatus();
                    self.hideCardSets();
                    self.TimerScript.setCountDownSecond(timeout);
                    break;
                case 5: // stage 5 : show cards stage
                    self.hideCurrentStatus();
                    self.CardObj.cards.Me.active = true;
                    self.TimerScript.hideClock();
                    break;
                case 6: // stage 6 : money flow stage
                case 7: // stage 7 : game continue stage
                    self.hideCurrentStatus();
                    self.hideCardSets();
                    self.TimerScript.hideClock();
                    break;
            }
        });

        global.Instance.EventListener.on("roomReady", function (event, Info) {
            // stage 0 : waiting stage (show waiting tips and show player)
            self.TimerScript.activeButton(0);
            self.PlayerInfoScript.UpdateRoom(Info);
            cc.log("activeButton : 0");
        });

        global.Instance.EventListener.on("kingsRate", function (event, Info) {
            // stage 2 (kings stage)
            self.UpdateDealer(Info);
        });

        global.Instance.EventListener.on("playersRate", function (event, Info) {
            // stage 3 (bet stage)
            cc.log("playerBet");
            self.UpdateBet(Info);
        });
        global.Instance.EventListener.on("myCard", function (event, Info) {
            // stage 4 (choose card stage)
            // record my card type for the hasniu/noniu button identification
            cc.log("Info.cardType.Me = ", Info.cardType.Me);
            if (Info.cardType.Me > 0) self.CardObj.myCardType = true;
            else self.CardObj.myCardType = false;
            self.UpdateMyCard(Info);

        });
        global.Instance.EventListener.on("eachPlayerCard", function (event, Info) {
            // stage 5 (show cards stage)
            //�N�P��s
            self.UpdateNewNewCards(Info);

        });
        global.Instance.EventListener.on("pokerAnimation", function (event, Info) {
            // stage 1(gameStart stage) and stage 5(show cards stage)
            cc.log("get pokerAnimation : ", Info.Me);
            self.playPokerAnimation(Info);
        });

    }

    dealerTest(rate: string){
        cc.warn("test img: "+ "grab_" + rate);
        this.CardObj.currentStatus.Me.getComponent("PokerControl").showstatus("grab_" + rate);
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
            this.clearTimer();
        }
        else if (Info.Pre.king == true) {
            this.CardObj.IsDizhu.Pre.active = true;
            this.clearTimer();
        }
        else if (Info.PrePre.king == true) {
            this.CardObj.IsDizhu.PrePre.active = true;
            this.clearTimer();
        }
        else if (Info.Next.king == true) {
            this.CardObj.IsDizhu.Next.active = true;
            this.clearTimer();
        }
        else if (Info.NextNext.king == true) {
            this.CardObj.IsDizhu.NextNext.active = true;
            this.clearTimer();
        }
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

        ////////////can't get show card
        self.CardChoose.getComponent("ShowCard").showCard(Info.cards); // �i�ܥi�H�諸���i�d

    }


    UpdateNewNewCards(Info){
        var self = this;// �O�o�[�o��
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
    }

    playPokerAnimation(Info){
        global.Instance.EventListener.notify("Animation", Info.Me);
    }

    clearTimer(){
        this.TimerScript.unscheduleTimer();
        this.TimerScript.activeButton(-1);
    }

    hideCurrentStatus() {
        let self = this;
        self.CardObj.currentStatus.Me.active = false;
        self.CardObj.currentStatus.Pre.active = false;
        self.CardObj.currentStatus.Next.active = false;
        self.CardObj.currentStatus.PrePre.active = false;
        self.CardObj.currentStatus.NextNext.active = false;
    }

    hideCardSets() {
        let self = this;
        self.CardObj.cards.Me.active = false;
        self.CardObj.cards.Pre.active = false;
        self.CardObj.cards.Next.active = false;
        self.CardObj.cards.PrePre.active = false;
        self.CardObj.cards.NextNext.active = false;
    }

    // king rate
    kingRateClick(event,customEventData : number){
        //global.Instance.network.socket().emit("kingRate", global.Instance.uid, customEventData);
        global.Instance.network.rob_bet(customEventData);
        this.clearTimer();
    }

    // bet rate
    betRateClick(event,customEventData: number){
        //global.Instance.network.socket().emit("playerRate", global.Instance.uid, customEventData);
        global.Instance.network.place_bet(customEventData);
        this.clearTimer();
        //cc.log(customEventData + "bet");
    }

    //no niu button
    noBuffButtonClick(){
        var self = this;
        if (!self.CardChoose.getComponent("ShowCard").isThreeSelected()) {
            self.CardChoose.getComponent("ShowCard").cardError.active = true;
            return;
        }

        self.CardChoose.getComponent("ShowCard").cardError.active = false;
        global.Instance.network.socket().emit("getPlayersCard", global.Instance.uid);
        this.clearTimer();
        self.CardObj.cards.Me.active = true;
    }

    //have niu nutton
    haveBuffButtonClick(){
        var self = this;
        /*if (!self.CardChoose.getComponent("ShowCard").isDoubleOfTen() || !self.CardChoose.getComponent("ShowCard").isThreeSelected()) {
            self.CardChoose.getComponent("ShowCard").cardError.active = true;
            return;
        }*/
        // if it isn't special cardtype or user doesn't choose three card
        if (!self.CardObj.myCardType || !self.CardChoose.getComponent("ShowCard").isThreeSelected()) {
            self.CardChoose.getComponent("ShowCard").cardError.active = true;
            return;
        }

        // else 
        self.CardChoose.getComponent("ShowCard").cardError.active = false;
        global.Instance.network.socket().emit("getPlayersCard", global.Instance.uid);
        this.clearTimer();
        self.CardObj.cards.Me.active = true;
    }


}
