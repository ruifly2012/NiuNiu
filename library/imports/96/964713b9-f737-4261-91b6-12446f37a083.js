"use strict";
cc._RF.push(module, '96471O59zdCYZG2EkRvN6CD', 'Global');
// Scripts/Common/Global.ts

Object.defineProperty(exports, "__esModule", { value: true });
var NetworkManager_1 = require("../Network/NetworkManager");
var Transitions_1 = require("./Transitions");
var EventListener_1 = require("./EventListener");
var AnimationMgr_1 = require("./AnimationMgr");
var AudioMgr_1 = require("./AudioMgr");
var ResourcesMgr_1 = require("./ResourcesMgr");
var MiscTool_1 = require("./MiscTool");
var _a = cc._decorator, ccclass = _a.ccclass, requireComponent = _a.requireComponent;
var Global = /** @class */ (function (_super) {
    __extends(Global, _super);
    function Global() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.EventListener = null;
        _this.network = null;
        _this.transitions = null;
        _this.animation = null;
        _this.misc = null;
        _this.audio = null;
        _this.resources = null;
        _this.util = null;
        return _this;
    }
    Global_1 = Global;
    Object.defineProperty(Global, "Instance", {
        get: function () {
            if (!this.instance) {
                Global_1.instance = new Global_1();
                Global_1.instance.EventListener = new EventListener_1.default();
                Global_1.instance.network = new NetworkManager_1.default();
                Global_1.instance.transitions = new Transitions_1.default();
                Global_1.instance.animation = new AnimationMgr_1.default();
                Global_1.instance.misc = new MiscTool_1.default();
            }
            return this.instance;
        },
        enumerable: true,
        configurable: true
    });
    var Global_1;
    Global = Global_1 = __decorate([
        ccclass,
        requireComponent(AudioMgr_1.default),
        requireComponent(ResourcesMgr_1.default)
    ], Global);
    return Global;
}(cc.Component));
exports.default = Global;

cc._RF.pop();