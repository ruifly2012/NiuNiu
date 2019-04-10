"use strict";
cc._RF.push(module, '676ba+ChjlMvZReP3ghOFca', 'AnimationController');
// Scripts/Home/AnimationController.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("../Common/Global");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
/*var animation = ["gameStart", "hasniu", "niuniu", "silvercow", "goldcow", "fivecows", "bomb", "allkill",
    "victory", "kingicon"];*/
var AnimationController = /** @class */ (function (_super) {
    __extends(AnimationController, _super);
    function AnimationController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.animationName = ["gameStart", "hasniu", "niuniu", "silvercow", "goldcow", "fivecows", "bomb", "allkill",
            "victory", "kingicon"];
        _this.moneyPrefabs = [];
        _this.bgPref = [];
        _this.testButton = null;
        _this.mPrefab = null;
        _this.bgPrefab = null;
        return _this;
    }
    AnimationController.prototype.init = function () {
        this.animation = {
            gameStart: cc.find("gameStart", this.node),
            AllKill: cc.find("allkill", this.node),
            hasniu: null,
            niuniu: cc.find("niuniu", this.node),
            silvercow: cc.find("silvercow", this.node),
            goldcow: cc.find("goldcow", this.node),
            fivecows: cc.find("fivecows", this.node),
            bomb: cc.find("bomb", this.node),
            Victory: cc.find("victory", this.node),
        };
        for (var index = 0; index < 5; index++) {
            this.moneyPrefabs[index] = [];
            for (var i = 0; i < 20; i++) {
                //generate 20 coin for each position 
                var genGold = cc.instantiate(this.mPrefab);
                genGold.parent = this.node;
                this.moneyPrefabs[index].push(genGold);
            }
            var shineBg = cc.instantiate(this.bgPrefab);
            shineBg.parent = this.node;
            this.bgPref.push(shineBg);
        }
    };
    AnimationController.prototype.onLoad = function () {
        this.init();
        var self = this;
        Global_1.default.Instance.EventListener.on("moneyFlow", function (event, Info) {
            cc.log("get money pack");
            var king = Info.king;
            for (var index = 0; index < 5; index++) {
                if (index == king)
                    index++;
                if (Info.give[index] > 0)
                    self.trigger(king, index, index);
                else
                    cc.log("give 0$ to" + index + ", no anime");
                cc.log("from me to" + index);
                cc.log("king = " + king + "  index = " + index);
            }
            /*

            self.schedule(function() {
                for (let index = 0; index < 5; index++) {
                    if (index == king) index++;
                    if( Info.get[index] > 0 ) self.trigger(index,king,index);
                    else cc.log("get 0$ from"+index+", no anime");
                    cc.log("from" + index+"to me");
                }
            }, 1);//delay 3s
            */
        });
        Global_1.default.Instance.EventListener.on("playTestMoneyFlow", function (event) {
            cc.log("test money");
            self.trigger(0, 1, 1);
            /*
            let king = Info.king;
            for (let index = 0; index < 5; index++) {
                if (index == king) index++;
                if( Info.give[index] > 0 ) self.trigger(king,index,index);
                else cc.log("give 0$ to"+index+", no anime");
                cc.log("from me to" + index);
                cc.log("king = " + king + "  index = " + index);
            }


            self.schedule(function() {
                for (let index = 0; index < 5; index++) {
                    if (index == king) index++;
                    if( Info.get[index] > 0 ) self.trigger(index,king,index);
                    else cc.log("get 0$ from"+index+", no anime");
                    cc.log("from" + index+"to me");
                }
            }, 1);//delay 3s
            */
        });
        Global_1.default.Instance.EventListener.on("Animation", function (event, animationName) {
            cc.log("AnimationController : ", animationName);
            var index = self.animationName.indexOf(animationName);
            cc.log("trigger anime : " + animationName);
            self.play(index);
        });
    };
    AnimationController.prototype.play = function (AnimationIndex) {
        cc.log("playing animation at aniCtrler");
        if (AnimationIndex < 0)
            return;
        this.node.getChildren()[AnimationIndex].active = true;
        this.node.getChildren()[AnimationIndex].getComponent(cc.Animation).play();
    };
    AnimationController.prototype.showAllTestButton = function () {
        var self = this;
        self.testButton.active = !self.testButton.active;
    };
    AnimationController.prototype.testButtonPress = function (event, customEventData) {
        var self = this;
        if (customEventData == 10)
            Global_1.default.Instance.EventListener.notify("playTestMoneyFlow");
        else
            self.play(customEventData);
    };
    AnimationController.prototype.trigger = function (from, to, pos) {
        cc.log("trigger money");
        //money
        var self = this;
        for (var i = 0; i < 20; i++) {
            var a = Math.floor(Math.random() * (19 - 0 + 1)) + 1; //亂數產生1~20
            cc.log("pass" + from + "," + to);
            self.moneyPrefabs[pos][i].getComponent("moneyAnime").moneyFlow(from, to, 10 * i - 100, 10 * i - 100, i + a);
        }
        //money shine
        self.bgPref[pos].getComponent("moneyBgAnime").moneyShine(to);
    };
    __decorate([
        property(cc.Node)
    ], AnimationController.prototype, "testButton", void 0);
    __decorate([
        property(cc.Prefab)
    ], AnimationController.prototype, "mPrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], AnimationController.prototype, "bgPrefab", void 0);
    AnimationController = __decorate([
        ccclass
    ], AnimationController);
    return AnimationController;
}(cc.Component));
exports.default = AnimationController;

cc._RF.pop();