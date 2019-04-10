"use strict";
cc._RF.push(module, '54d42gjmU5JZJLU2HLDgw7+', 'PokerSet');
// Scripts/Home/Poker/PokerSet.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cardScript = {
            rate: null,
            p1: null,
            p2: null,
            p3: null,
            p4: null,
            p5: null,
            type: null,
        };
        _this.chooseRate = null;
        _this.poker1 = null;
        _this.poker2 = null;
        _this.poker3 = null;
        _this.poker4 = null;
        _this.poker5 = null;
        _this.cardType = null;
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    NewClass.prototype.onLoad = function () {
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
    };
    NewClass.prototype.showRate = function (Info) {
        //var self = this;
        //self.cardScript.rate.showstatus("BetTest_" + "12");
        //self.cardScript.rate.showstatus("BetTest_9");
        //this.cardScript.rate.showstatus("grab_00");
        this.chooseRate.getComponent("PokerControl").showstatus("BetTest_" + Info);
    };
    NewClass.prototype.showDeal = function (Info) {
        this.chooseRate.getComponent("PokerControl").showstatus("grab_0" + Info);
    };
    NewClass.prototype.showCards = function (Info) {
        this.poker1.getComponent("PokerControl").showPoker(Info[0], false);
        this.poker2.getComponent("PokerControl").showPoker(Info[1], false);
        this.poker3.getComponent("PokerControl").showPoker(Info[2], false);
        this.poker4.getComponent("PokerControl").showPoker(Info[3], false);
        this.poker5.getComponent("PokerControl").showPoker(Info[4], false);
    };
    NewClass.prototype.showCardType = function (Info) {
        var frame;
        var info;
        if (Info == 0)
            frame = "1"; // �S���I��
        else if (Info >= 1 && Info <= 6)
            frame = "2"; // ����1-6
        else if (Info >= 7 && Info <= 9)
            frame = "3"; // ����7-9
        else if (Info == 10)
            frame = "4"; // ����
        else if (Info == 11)
            frame = "5"; // �Ȥ�
        else if (Info >= 12 && Info <= 14)
            frame = "6"; // �����H�W
        if (Info <= 9)
            Info = "0" + Info;
        this.cardType.getComponent("PokerControl").showcardtype(Info, frame);
        //this.cardType.getComponent("PokerControl").showcardtype("14", "06");
        //this.cardType.getComponent("PokerControl").showcardtype("14","06");
    };
    NewClass.prototype.start = function () {
    };
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "chooseRate", void 0);
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "poker1", void 0);
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "poker2", void 0);
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "poker3", void 0);
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "poker4", void 0);
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "poker5", void 0);
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "cardType", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();