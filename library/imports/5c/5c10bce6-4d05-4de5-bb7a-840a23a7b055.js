"use strict";
cc._RF.push(module, '5c10bzmTQVN5bt6hAojp7BV', 'SequenceAnimation');
// Scripts/Animations/SequenceAnimation.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AnimationBase_1 = require("./AnimationBase");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, requireComponent = _a.requireComponent;
var SequenceAnimation = /** @class */ (function (_super) {
    __extends(SequenceAnimation, _super);
    function SequenceAnimation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.clip_name = "";
        _this.animator = null;
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    SequenceAnimation.prototype.onLoad = function () {
        _super.prototype.onLoad.call(this);
        this.animator = this.getComponent(cc.Animation);
    };
    // update (dt) {}
    SequenceAnimation.prototype.play = function (_speed, _loop) {
        if (_speed === void 0) { _speed = 1.0; }
        if (_loop === void 0) { _loop = false; }
        var m_state = this.animator.getAnimationState(this.clip_name);
        m_state.speed = _speed;
        if (_loop) {
            m_state.wrapMode = cc.WrapMode.Loop;
            m_state.repeatCount = Infinity;
        }
        this.animator.play(this.clip_name);
    };
    SequenceAnimation.prototype.pause = function () {
        this.animator.pause();
    };
    SequenceAnimation.prototype.stop = function () {
        this.animator.stop();
    };
    SequenceAnimation.prototype.resume = function () {
        this.animator.resume(this.clip_name);
    };
    __decorate([
        property
    ], SequenceAnimation.prototype, "clip_name", void 0);
    __decorate([
        property(cc.Animation)
    ], SequenceAnimation.prototype, "animator", void 0);
    SequenceAnimation = __decorate([
        ccclass,
        requireComponent(cc.Animation)
    ], SequenceAnimation);
    return SequenceAnimation;
}(AnimationBase_1.default));
exports.default = SequenceAnimation;

cc._RF.pop();