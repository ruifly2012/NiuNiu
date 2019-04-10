"use strict";
cc._RF.push(module, '1bda1yhinhDbZb5bUrSLnti', 'AudioMgr');
// Scripts/Common/AudioMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("./Global");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executionOrder = _a.executionOrder;
var AudioMgr = /** @class */ (function (_super) {
    __extends(AudioMgr, _super);
    function AudioMgr() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isMusic = true;
        _this.isEffect = true;
        _this.curBGM = '';
        _this.loadingList = [];
        return _this;
        // update (dt) {}
    }
    AudioMgr.prototype.onLoad = function () {
        Global_1.default.Instance.audio = this;
        cc.game.on(cc.game.EVENT_HIDE, function () {
            cc.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            cc.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
        });
    };
    AudioMgr.prototype.playMusic = function (_clip, _isloop) {
        if (_isloop === void 0) { _isloop = true; }
        if (!this.isMusic)
            return;
        var url = "Audio/Music/" + _clip;
        if (this.curBGM === url)
            return;
        var isLoad = this.loadingList.find(function (x) { return x[0] === url; });
        if (isLoad) {
            cc.audioEngine.playMusic(isLoad[1], _isloop);
        }
        else {
            var self_1 = this;
            cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
                if (err) {
                    cc.error(err);
                    return;
                }
                if (self_1.curBGM !== '') {
                    cc.audioEngine.stopMusic();
                }
                cc.audioEngine.playMusic(clip, _isloop);
                self_1.curBGM = url;
                self_1.loadingList.push([url, clip]);
            });
        }
    };
    AudioMgr.prototype.playEffect = function (_clip, _isloop, _callback) {
        if (_isloop === void 0) { _isloop = false; }
        if (_callback === void 0) { _callback = null; }
        if (!this.isEffect)
            return;
        var url = "Audio/Effect/";
        var isLoad = this.loadingList.find(function (x) { return x[0] === url; });
        if (isLoad) {
            cc.audioEngine.playEffect(isLoad[1], _isloop);
        }
        else {
            cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
                if (err) {
                    cc.error(err);
                    return;
                }
                cc.audioEngine.playEffect(clip, _isloop);
            });
        }
    };
    AudioMgr.prototype.releaseAll = function () {
        for (var i = 0; i < this.loadingList.length; i++) {
            cc.loader.releaseAsset(this.loadingList[i][1]);
        }
        this.loadingList = [];
    };
    AudioMgr.prototype.pauseAll = function () {
        cc.audioEngine.pauseAll();
    };
    AudioMgr.prototype.resumeAll = function () {
        cc.audioEngine.resumeAll();
    };
    AudioMgr.prototype.muteMusic = function (_mute) {
        if (_mute === void 0) { _mute = true; }
        this.isMusic = !_mute;
        if (_mute) {
            cc.audioEngine.setMusicVolume(0);
        }
        else {
            cc.audioEngine.setMusicVolume(1);
        }
    };
    AudioMgr.prototype.muteEffect = function (_mute) {
        if (_mute === void 0) { _mute = true; }
        this.isEffect = !_mute;
        if (_mute) {
            cc.audioEngine.setEffectsVolume(0);
        }
        else {
            cc.audioEngine.setEffectsVolume(1);
        }
    };
    __decorate([
        property
    ], AudioMgr.prototype, "isMusic", void 0);
    __decorate([
        property
    ], AudioMgr.prototype, "isEffect", void 0);
    AudioMgr = __decorate([
        ccclass,
        executionOrder(-1) //Make sure register to Instance in the first
    ], AudioMgr);
    return AudioMgr;
}(cc.Component));
exports.default = AudioMgr;

cc._RF.pop();