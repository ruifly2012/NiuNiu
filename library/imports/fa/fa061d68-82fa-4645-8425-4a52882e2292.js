"use strict";
cc._RF.push(module, 'fa0611ogvpGRYQlSlKILiKS', 'Clock');
// Scripts/Home/Time/Clock.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Clock = /** @class */ (function (_super) {
    __extends(Clock, _super);
    function Clock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Obj = {
            time: null,
            time2: null
        };
        return _this;
    }
    Clock.prototype.onLoad = function () {
        this.Obj.time = cc.find("time", this.node).getComponent("Num2Sprite");
        this.Obj.time2 = cc.find("time2", this.node).getComponent("Num2Sprite");
    };
    Clock.prototype.settime = function (time, timer) {
        if (time.toString().length == 2) {
            timer.Obj.time2.active = true;
            timer.Obj.time.active = false;
            this.Obj.time2.setNum(time);
        }
        else {
            timer.Obj.time2.active = false;
            timer.Obj.time.active = true;
            this.Obj.time.setNum(time);
        }
    };
    Clock = __decorate([
        ccclass
    ], Clock);
    return Clock;
}(cc.Component));
exports.default = Clock;

cc._RF.pop();