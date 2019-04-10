"use strict";
cc._RF.push(module, '2908bPKdypBs4D29aFWsbAU', 'SplineAnimation');
// Scripts/Animations/SplineAnimation.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AnimationBase_1 = require("./AnimationBase");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, requireComponent = _a.requireComponent;
var SplineAnimation = /** @class */ (function (_super) {
    __extends(SplineAnimation, _super);
    function SplineAnimation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.clip_name = "";
        _this.animator = null;
        return _this;
    }
    SplineAnimation.prototype.onLoad = function () {
        _super.prototype.onLoad.call(this);
        this.animator = this.getComponent(sp.Skeleton);
    };
    SplineAnimation.prototype.start = function () {
    };
    SplineAnimation.prototype.play = function (_speed, _loop) {
        if (_speed === void 0) { _speed = 1.0; }
        if (_loop === void 0) { _loop = false; }
    };
    SplineAnimation.prototype.pause = function () {
    };
    SplineAnimation.prototype.stop = function () {
    };
    SplineAnimation.prototype.resume = function () {
    };
    __decorate([
        property
    ], SplineAnimation.prototype, "clip_name", void 0);
    __decorate([
        property(sp.Skeleton)
    ], SplineAnimation.prototype, "animator", void 0);
    SplineAnimation = __decorate([
        ccclass,
        requireComponent(sp.Skeleton)
    ], SplineAnimation);
    return SplineAnimation;
}(AnimationBase_1.default));
exports.default = SplineAnimation;

cc._RF.pop();