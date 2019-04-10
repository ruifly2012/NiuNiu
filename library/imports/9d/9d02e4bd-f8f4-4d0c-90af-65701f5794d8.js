"use strict";
cc._RF.push(module, '9d02eS9+PRNDJCvZXAfV5TY', 'Util');
// Scripts/Common/Util.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("./Global");
var FlexDialog_1 = require("./FlexDialog");
/**
 * Functions/Tool that all can use, and depend with cocos creator
 */
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executionOrder = _a.executionOrder;
var Util = /** @class */ (function (_super) {
    __extends(Util, _super);
    function Util() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Util.prototype.onLoad = function () {
        Global_1.default.Instance.misc = this;
    };
    Util.prototype.instanceFlexDialog = function (_text, _OK_callback) {
        if (_OK_callback === void 0) { _OK_callback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _prefab, newNode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Global_1.default.Instance.resources.getloadAssets("Template/Dialog")];
                    case 1:
                        _prefab = _a.sent();
                        newNode = cc.instantiate(_prefab);
                        //setup callback function when press OK
                        newNode.getComponent(FlexDialog_1.default).setupCallback(_OK_callback);
                        //Add to scene
                        cc.director.getScene().addChild(newNode);
                        return [2 /*return*/];
                }
            });
        });
    };
    Util = __decorate([
        ccclass,
        executionOrder(-1) //Make sure register to Instance in the first
    ], Util);
    return Util;
}(cc.Component));
exports.default = Util;

cc._RF.pop();