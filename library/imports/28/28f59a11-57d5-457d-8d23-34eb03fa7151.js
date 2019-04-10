"use strict";
cc._RF.push(module, '28f59oRV9VFfY0jNOsD+nFR', 'PlayerInfo');
// Scripts/PlayerInfo/Model/PlayerInfo.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var PlayerInfo = /** @class */ (function () {
    function PlayerInfo() {
        this.user_head = "";
        this.user_name = "";
        this.user_level = -1;
        this.user_exp = -1.0;
        this.user_vip = -1;
    }
    PlayerInfo = __decorate([
        ccclass
    ], PlayerInfo);
    return PlayerInfo;
}());
exports.default = PlayerInfo;

cc._RF.pop();