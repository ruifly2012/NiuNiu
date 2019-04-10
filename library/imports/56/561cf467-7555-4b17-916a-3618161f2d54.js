"use strict";
cc._RF.push(module, '561cfRndVVLF5FqNhgWHy1U', 'ShowCard');
// Scripts/Home/Stage/ShowCard.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("../../Common/Global");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ShowCard = /** @class */ (function (_super) {
    __extends(ShowCard, _super);
    function ShowCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.CardInfo = {
            canselect: true,
            selected: false,
            data: null
        };
        _this.Num = {
            first: null,
            second: null,
            third: null,
            total: null
        };
        _this.selectedCard = []; // log choosed card
        _this.selectedCardPtr = 0;
        _this.totalNumber = 0; // log num sum
        _this.poker1 = null;
        _this.poker2 = null;
        _this.poker3 = null;
        _this.poker4 = null;
        _this.poker5 = null;
        _this.interface = null;
        _this.firstNum = null;
        _this.secondNum = null;
        _this.thirdNum = null;
        _this.totalNum = null;
        _this.cardError = null;
        return _this;
    }
    ShowCard.prototype.showCard = function (pokers) {
        this.poker1.getComponent("PokerControl").setCard(pokers.Me[0], true);
        this.poker2.getComponent("PokerControl").setCard(pokers.Me[1], true);
        this.poker3.getComponent("PokerControl").setCard(pokers.Me[2], true);
        this.poker4.getComponent("PokerControl").setCard(pokers.Me[3], true);
        this.poker5.getComponent("PokerControl").setCard(pokers.Me[4], true);
    };
    ShowCard.prototype.showButtonClick = function () {
        var pokerCardType = {
            spade: "spade",
            hearts: "hearts",
            redslice: "redslice",
            blackberry: "blackberry",
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
    };
    ShowCard.prototype.noBuffButtonClick = function () {
        Global_1.default.Instance.network.socket().emit("getPlayersCard", Global_1.default.Instance.uid);
        //global.socket.emit("getPlayersCard", global.uid);
        this.interface.active = false;
    };
    ShowCard.prototype.haveBuffButtonClick = function () {
        Global_1.default.Instance.network.socket().emit("getPlayersCard", Global_1.default.Instance.uid);
        //global.socket.emit("getPlayersCard", global.uid);
        this.interface.active = false;
    };
    ShowCard.prototype.onLoad = function () {
        var self = this;
        this.Num.first = this.firstNum.getComponent(cc.Label);
        this.Num.second = this.secondNum.getComponent(cc.Label);
        this.Num.third = this.thirdNum.getComponent(cc.Label);
        this.Num.total = this.totalNum.getComponent(cc.Label);
        Global_1.default.Instance.EventListener.on("CardSelected", function (event) {
            self.fillTheBox();
        });
        Global_1.default.Instance.EventListener.on("CardUnselected", function (event) {
            self.unfillTheBox();
        });
    };
    ShowCard.prototype.fillTheBox = function () {
        cc.log("Into fillTheBox");
        var self = this;
        // step 0 : if already select 3,unselected first choosed
        if (self.selectedCardPtr === 3) {
            // selectedCard第一個卡unselected，剔除第一個值，所有值向前移動
            switch (self.selectedCard[0]) {
                case 1:
                    self.poker1.getComponent("PokerControl").unselect();
                    break;
                case 2:
                    self.poker2.getComponent("PokerControl").unselect();
                    break;
                case 3:
                    self.poker3.getComponent("PokerControl").unselect();
                    break;
                case 4:
                    self.poker4.getComponent("PokerControl").unselect();
                    break;
                case 5:
                    self.poker5.getComponent("PokerControl").unselect();
                    break;
            }
            self.selectedCard[0] = self.selectedCard[1];
            self.selectedCard[1] = self.selectedCard[2];
            //self.selectedCardPtr--;
        }
        cc.log("selectedCardPtr = ", self.selectedCardPtr);
        // step 1 : find all selected card
        var selected = []; // 按照順序排列好的，被選中的牌
        var ptr = 0; // 被選中的牌個數
        for (var i = 1; i <= 5; i++) {
            switch (i) {
                case 1:
                    if (self.poker1.getComponent("PokerControl").isSelected())
                        selected[ptr++] = i;
                    break;
                case 2:
                    if (self.poker2.getComponent("PokerControl").isSelected())
                        selected[ptr++] = i;
                    break;
                case 3:
                    if (self.poker3.getComponent("PokerControl").isSelected())
                        selected[ptr++] = i;
                    break;
                case 4:
                    if (self.poker4.getComponent("PokerControl").isSelected())
                        selected[ptr++] = i;
                    break;
                case 5:
                    if (self.poker5.getComponent("PokerControl").isSelected())
                        selected[ptr++] = i;
                    break;
            }
        }
        // 步驟2 : 和selectedCard(本文件global的陣列)比較
        if (self.selectedCardPtr === 0) {
            self.selectedCard[self.selectedCardPtr++] = selected[0];
            cc.log(self.selectedCard[0]);
        }
        else if (self.selectedCardPtr < 3) { // 找到selectedCard沒有的，insert進去
            cc.log(1, 2, "card selected");
            var isFind = 0;
            for (var i = 0; i < ptr && !isFind; i++) {
                for (var j = 0; j < self.selectedCardPtr && !isFind; j++) {
                    if (selected[i] === self.selectedCard[j])
                        break;
                    else if (selected[i] !== self.selectedCard[j] && j === self.selectedCardPtr - 1) {
                        self.selectedCard[self.selectedCardPtr++] = selected[i];
                        isFind = 1;
                        break;
                    }
                }
            }
        }
        else { // (selectedCard第一個卡unselected，剔除第一個值，所有值向前移動)，找到selectedCard沒有的，insert進去
            cc.log(3, "card selected");
            // 找到selectedCard沒有的，insert進去
            self.selectedCardPtr--;
            var isFind = 0;
            for (var i = 0; i < ptr && !isFind; i++) {
                for (var j = 0; j < self.selectedCardPtr && !isFind; j++) {
                    if (selected[i] === self.selectedCard[j])
                        break;
                    else if (selected[i] !== self.selectedCard[j] && j === self.selectedCardPtr - 1) {
                        self.selectedCard[self.selectedCardPtr++] = selected[i];
                        isFind = 1;
                        break;
                    }
                }
            }
            for (var i = 0; i < self.selectedCardPtr; i++) {
                cc.log("selectedCard", i, " = ", self.selectedCard[i]);
            }
        }
        cc.log("selectedCardPtr = ", self.selectedCardPtr);
        self.write();
    };
    ShowCard.prototype.unfillTheBox = function () {
        // 步驟1 : 找到所有被選中的牌
        cc.log("Into unfillTheBox");
        var self = this;
        var selected = []; // 按照順序排列好的，被選中的牌
        var ptr = 0; // 被選中的牌個數
        for (var i = 1; i <= 5; i++) {
            switch (i) {
                case 1:
                    if (self.poker1.getComponent("PokerControl").isSelected())
                        selected[ptr++] = i;
                    break;
                case 2:
                    if (self.poker2.getComponent("PokerControl").isSelected())
                        selected[ptr++] = i;
                    break;
                case 3:
                    if (self.poker3.getComponent("PokerControl").isSelected())
                        selected[ptr++] = i;
                    break;
                case 4:
                    if (self.poker4.getComponent("PokerControl").isSelected())
                        selected[ptr++] = i;
                    break;
                case 5:
                    if (self.poker5.getComponent("PokerControl").isSelected())
                        selected[ptr++] = i;
                    break;
            }
        }
        // 步驟2 : 和selectedCard(本文件global的陣列)比較，陣列的牌 > 選中的牌
        var isFind = 0;
        for (var i = 0; i < self.selectedCardPtr && !isFind; i++) {
            for (var j = 0; j < ptr && !isFind; j++) {
                if (self.selectedCard[i] === selected[j])
                    break;
                else if (self.selectedCard[i] !== selected[j] && j === ptr - 1) {
                    if (i === 0) {
                        self.selectedCard[0] = self.selectedCard[1];
                        self.selectedCard[1] = self.selectedCard[2];
                        self.selectedCardPtr--;
                        cc.log("order 0 of ordered selected card unequal");
                    }
                    else if (i === 1) {
                        self.selectedCard[1] = self.selectedCard[2];
                        self.selectedCardPtr--;
                        cc.log("order 1 of ordered selected card unequal");
                    }
                    else {
                        self.selectedCardPtr--;
                        cc.log("order 2 of ordered selected card unequal");
                    }
                    isFind = 1;
                    break;
                }
            }
        }
        if (ptr === 0 && self.selectedCardPtr === 1) { // 最後一張卡片被按下來了(因此ptr為0)
            self.selectedCardPtr--;
            cc.log("0 selected card, clear memory");
        }
        cc.log("selectedCardPtr = ", self.selectedCardPtr);
        //步驟3：填寫數字
        self.write();
    };
    ShowCard.prototype.write = function () {
        var self = this;
        self.clear();
        var total = 0;
        var selected = []; // 按照順序排列好的，被選中的牌
        var ptr = 0; // 被選中的牌個數
        for (var i = 0; i < self.selectedCardPtr; i++) {
            switch (i) {
                case 0:
                    switch (self.selectedCard[i]) {
                        case 1:
                            self.Num.first.string = self.poker1.getComponent("PokerControl").getNumber();
                            total += self.poker1.getComponent("PokerControl").getNumber();
                            break;
                        case 2:
                            self.Num.first.string = self.poker2.getComponent("PokerControl").getNumber();
                            total += self.poker2.getComponent("PokerControl").getNumber();
                            break;
                        case 3:
                            self.Num.first.string = self.poker3.getComponent("PokerControl").getNumber();
                            total += self.poker3.getComponent("PokerControl").getNumber();
                            break;
                        case 4:
                            self.Num.first.string = self.poker4.getComponent("PokerControl").getNumber();
                            total += self.poker4.getComponent("PokerControl").getNumber();
                            break;
                        case 5:
                            self.Num.first.string = self.poker5.getComponent("PokerControl").getNumber();
                            total += self.poker5.getComponent("PokerControl").getNumber();
                            break;
                    }
                    cc.log("first selected card");
                    break;
                case 1:
                    switch (self.selectedCard[i]) {
                        case 1:
                            self.Num.second.string = self.poker1.getComponent("PokerControl").getNumber();
                            total += self.poker1.getComponent("PokerControl").getNumber();
                            break;
                        case 2:
                            self.Num.second.string = self.poker2.getComponent("PokerControl").getNumber();
                            total += self.poker2.getComponent("PokerControl").getNumber();
                            break;
                        case 3:
                            self.Num.second.string = self.poker3.getComponent("PokerControl").getNumber();
                            total += self.poker3.getComponent("PokerControl").getNumber();
                            break;
                        case 4:
                            self.Num.second.string = self.poker4.getComponent("PokerControl").getNumber();
                            total += self.poker4.getComponent("PokerControl").getNumber();
                            break;
                        case 5:
                            self.Num.second.string = self.poker5.getComponent("PokerControl").getNumber();
                            total += self.poker5.getComponent("PokerControl").getNumber();
                            break;
                    }
                    cc.log("second selected card");
                    break;
                case 2:
                    switch (self.selectedCard[i]) {
                        case 1:
                            self.Num.third.string = self.poker1.getComponent("PokerControl").getNumber();
                            total += self.poker1.getComponent("PokerControl").getNumber();
                            break;
                        case 2:
                            self.Num.third.string = self.poker2.getComponent("PokerControl").getNumber();
                            total += self.poker2.getComponent("PokerControl").getNumber();
                            break;
                        case 3:
                            self.Num.third.string = self.poker3.getComponent("PokerControl").getNumber();
                            total += self.poker3.getComponent("PokerControl").getNumber();
                            break;
                        case 4:
                            self.Num.third.string = self.poker4.getComponent("PokerControl").getNumber();
                            total += self.poker4.getComponent("PokerControl").getNumber();
                            break;
                        case 5:
                            self.Num.third.string = self.poker5.getComponent("PokerControl").getNumber();
                            total += self.poker5.getComponent("PokerControl").getNumber();
                            break;
                    }
                    cc.log("third selected card");
                    break;
            }
        }
        if (total !== 0) {
            self.Num.total.string = total;
        }
        self.totalNumber = total;
        //if(self.Num.first.string != 0 && self.Num.second.string != 0 &&self.Num.third.string != 0) self.cardError.active = false;
        //else self.cardError.active = true;
    };
    ShowCard.prototype.clear = function () {
        var self = this;
        self.Num.first.string = '';
        self.Num.second.string = '';
        self.Num.third.string = '';
        self.Num.total.string = '';
        cc.log("clear all box to none");
    };
    ShowCard.prototype.isDoubleOfTen = function () {
        var self = this;
        return ((self.totalNumber % 10) === 0);
    };
    ShowCard.prototype.isThreeSelected = function () {
        return (this.selectedCardPtr == 3);
    };
    __decorate([
        property(cc.Node)
    ], ShowCard.prototype, "poker1", void 0);
    __decorate([
        property(cc.Node)
    ], ShowCard.prototype, "poker2", void 0);
    __decorate([
        property(cc.Node)
    ], ShowCard.prototype, "poker3", void 0);
    __decorate([
        property(cc.Node)
    ], ShowCard.prototype, "poker4", void 0);
    __decorate([
        property(cc.Node)
    ], ShowCard.prototype, "poker5", void 0);
    __decorate([
        property(cc.Node)
    ], ShowCard.prototype, "interface", void 0);
    __decorate([
        property(cc.Node)
    ], ShowCard.prototype, "firstNum", void 0);
    __decorate([
        property(cc.Node)
    ], ShowCard.prototype, "secondNum", void 0);
    __decorate([
        property(cc.Node)
    ], ShowCard.prototype, "thirdNum", void 0);
    __decorate([
        property(cc.Node)
    ], ShowCard.prototype, "totalNum", void 0);
    __decorate([
        property(cc.Node)
    ], ShowCard.prototype, "cardError", void 0);
    ShowCard = __decorate([
        ccclass
    ], ShowCard);
    return ShowCard;
}(cc.Component));
exports.default = ShowCard;

cc._RF.pop();