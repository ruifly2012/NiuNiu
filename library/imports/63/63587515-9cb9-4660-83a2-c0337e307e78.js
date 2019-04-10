"use strict";
cc._RF.push(module, '63587UVnLlGYIOiwDN+MH54', 'AnimationBase');
// Scripts/Animations/AnimationBase.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("../Common/Global");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AnimationBase = /** @class */ (function (_super) {
    __extends(AnimationBase, _super);
    function AnimationBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ani_name = "";
        return _this;
    }
    AnimationBase.prototype.onLoad = function () {
        if (this.ani_name == "") {
            cc.log('Animation Name not Setup');
            return;
        }
        Global_1.default.Instance.animation.registerAnimationClip(this.ani_name, this);
    };
    AnimationBase.prototype.onDestroy = function () {
        Global_1.default.Instance.animation.removeAnimationClip(this.ani_name);
    };
    __decorate([
        property
    ], AnimationBase.prototype, "ani_name", void 0);
    AnimationBase = __decorate([
        ccclass
    ], AnimationBase);
    return AnimationBase;
}(cc.Component));
exports.default = AnimationBase;

cc._RF.pop();