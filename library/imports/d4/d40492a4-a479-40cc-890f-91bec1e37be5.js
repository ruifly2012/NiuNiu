"use strict";
cc._RF.push(module, 'd4049KkpHlAzIkPkb7B43vl', 'ResourcesMgr');
// Scripts/Common/ResourcesMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
/**
 * 動態資源管理物件
 */
var ResourcesMgr = /** @class */ (function (_super) {
    __extends(ResourcesMgr, _super);
    function ResourcesMgr() {
        var _this = _super.call(this) || this;
        /**當前已讀取的檔案存放區 */
        _this.spriteFrame = {};
        /**各場景須預讀取的檔案列表 */
        _this.assetList = [];
        _this.assetList.push("player/img");
        _this.assetList.push("text");
        cc.game.addPersistRootNode(_this.node);
        return _this;
    }
    /**
     * 讀取指定場景所需的動態資源
     * @param idx 指定場景ID
     * @param onloading loading中途觸發事件
     */
    ResourcesMgr.prototype.preload = function (onloading) {
        var _this = this;
        if (onloading === void 0) { onloading = undefined; }
        cc.log("ResourcesMgr.preload");
        var assetListComplete = 0;
        var assetList = this.assetList;
        if (assetList != undefined) {
            for (var i = 0; i < assetList.length; i++) {
                cc.loader.loadResDir(assetList[i], cc.SpriteFrame, function (completedCount, totalCount, item) { }, function (err, assets) {
                    for (var i_1 = 0; i_1 < assets.length; i_1++) {
                        //cc.log("check " + assets[i].name);   
                        if (_this.spriteFrame[assets[i_1].name] == null) {
                            _this.spriteFrame[assets[i_1].name] = assets[i_1];
                            cc.log("[[Resources]] " + assets[i_1].name + " loaded.");
                        }
                    }
                    assetListComplete++;
                    if (onloading != undefined)
                        onloading(assetListComplete / assetList.length);
                });
            }
        }
        else {
            onloading(1);
        }
    };
    /**
     * 取得已讀取進遊戲的動態資源
     * @param name 動態資源名稱
     */
    ResourcesMgr.prototype.load = function (name) {
        if (name in this.spriteFrame) {
            cc.log("[Resources] Load " + name + " success");
            return this.spriteFrame[name];
        }
        cc.warn("[Resources] Load " + name + " fail");
        return null;
    };
    ResourcesMgr = __decorate([
        ccclass
    ], ResourcesMgr);
    return ResourcesMgr;
}(cc.Component));
exports.default = ResourcesMgr;

cc._RF.pop();