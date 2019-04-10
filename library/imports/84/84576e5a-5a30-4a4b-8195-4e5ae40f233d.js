"use strict";
cc._RF.push(module, '845765aWjBKS4GVTlrkDyM9', 'FlexDialog');
// Scripts/Common/FlexDialog.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var FlexDialog = /** @class */ (function (_super) {
    __extends(FlexDialog, _super);
    function FlexDialog() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._callback = null;
        return _this;
    }
    FlexDialog.prototype.setupCallback = function (ok_callback) {
        this._callback = ok_callback;
    };
    FlexDialog.prototype.onOKClick = function () {
        if (this._callback !== null) {
            this._callback();
        }
        cc.log('OK!');
        this.node.destroy();
    };
    FlexDialog.prototype.onCancelClick = function () {
        cc.log('Cancel!');
        this.node.destroy();
    };
    FlexDialog = __decorate([
        ccclass
    ], FlexDialog);
    return FlexDialog;
}(cc.Component));
exports.default = FlexDialog;

cc._RF.pop();