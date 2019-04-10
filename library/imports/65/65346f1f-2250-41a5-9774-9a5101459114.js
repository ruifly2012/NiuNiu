"use strict";
cc._RF.push(module, '653468fIlBBpZd0mlEBRZEU', 'AnimationMgr');
// Scripts/Common/AnimationMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AnimationMgr = /** @class */ (function () {
    function AnimationMgr() {
        this._animation_list = [];
    }
    AnimationMgr.prototype.registerAnimationClip = function (_name, _clip) {
        var check = this._animation_list.find(function (x) { return x.name == _name; });
        if (check) {
            console.log('Bind Animation Error!!');
            return;
        }
        var obj = { clip: _clip, name: _name };
        this._animation_list.push(obj);
    };
    AnimationMgr.prototype.removeAnimationClip = function (_clipname) {
        this._animation_list = this._animation_list.filter(function (x) {
            return !(x.name == _clipname);
        });
    };
    AnimationMgr.prototype.clear = function () {
        this._animation_list = [];
    };
    AnimationMgr.prototype.play = function (_ani, _speed, _loop) {
        if (_speed === void 0) { _speed = 1.0; }
        if (_loop === void 0) { _loop = false; }
        this._animation_list.find(function (x) { return x.anme == _ani; }).play(_speed, _loop);
    };
    AnimationMgr.prototype.pause = function (_ani) {
        this._animation_list.find(function (x) { return x.anme == _ani; }).pause();
    };
    AnimationMgr.prototype.stop = function (_ani) {
        this._animation_list.find(function (x) { return x.anme == _ani; }).stop();
    };
    AnimationMgr.prototype.resume = function (_ani) {
        this._animation_list.find(function (x) { return x.anme == _ani; }).resume();
    };
    return AnimationMgr;
}());
exports.default = AnimationMgr;

cc._RF.pop();