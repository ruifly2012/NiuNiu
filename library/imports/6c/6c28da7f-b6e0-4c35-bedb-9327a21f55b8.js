"use strict";
cc._RF.push(module, '6c28dp/tuBMNb7bkyeiH1W4', 'Transitions');
// Scripts/Common/Transitions.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Transitions = /** @class */ (function () {
    function Transitions() {
    }
    Transitions.prototype.fadeIn = function (_node) {
        _node.setScale(0.2);
        var ani = cc.scaleTo(0.2, 1);
        _node.runAction(ani);
    };
    Transitions.prototype.fadeOut = function (_node) {
        _node.setScale(1);
        var ani = cc.scaleTo(0.2, 0.2);
        _node.runAction(ani);
    };
    Transitions = __decorate([
        ccclass
    ], Transitions);
    return Transitions;
}());
exports.default = Transitions;

cc._RF.pop();