"use strict";
cc._RF.push(module, 'd4049KkpHlAzIkPkb7B43vl', 'ResourcesMgr');
// Scripts/Common/ResourcesMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("./Global");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ResourceIndex;
(function (ResourceIndex) {
    ResourceIndex[ResourceIndex["Lobby"] = 0] = "Lobby";
    ResourceIndex[ResourceIndex["BAG"] = 1] = "BAG";
    ResourceIndex[ResourceIndex["LB"] = 2] = "LB";
    ResourceIndex[ResourceIndex["HistoryController"] = 100] = "HistoryController";
})(ResourceIndex = exports.ResourceIndex || (exports.ResourceIndex = {}));
var ResourcesMgr = /** @class */ (function (_super) {
    __extends(ResourcesMgr, _super);
    function ResourcesMgr() {
        var _this = _super.call(this) || this;
        _this.spriteFrame = {};
        _this.assetList = {};
        _this.loadingList = [];
        Global_1.default.Instance.resources = _this;
        // ResourceIndex.Lobby
        var list = [];
        list.push("faces");
        list.push("icons");
        list.push("share");
        list.push("BC");
        list.push("gameRoom");
        _this.assetList[ResourceIndex.Lobby] = list;
        // ResourceIndex.BAG
        list = [];
        list.push("faces");
        list.push("icons");
        list.push("share");
        list.push("BC");
        list.push("gameRoom");
        _this.assetList[ResourceIndex.BAG] = list;
        return _this;
    }
    ResourcesMgr.prototype.preloadSprits = function (idx, onLoading) {
        var _this = this;
        if (onLoading === void 0) { onLoading = null; }
        cc.log("ResourcesMgr.preload(" + idx + ")");
        var assetListComplete = 0;
        var assetList = this.assetList[idx.toString()];
        for (var i = 0; i < assetList.length; i++) {
            cc.loader.loadResDir("textures/" + assetList[i], cc.SpriteFrame, function (completedCount, totalCount, item) { }, function (err, assets) {
                for (var i_1 = 0; i_1 < assets.length; i_1++) {
                    //cc.log("check " + assets[i].name);   
                    if (_this.spriteFrame[assets[i_1].name] == null) {
                        _this.spriteFrame[assets[i_1].name] = assets[i_1];
                        //cc.log("[[Resources]] " + assets[i].name + " loaded.");        
                    }
                }
                assetListComplete++;
                if (onLoading != null)
                    onLoading(assetListComplete / assetList.length);
            });
        }
    };
    ResourcesMgr.prototype.releaseSprits = function (idx) {
        cc.log("ResourcesMgr.releaseRes(" + idx + ")");
        var assetListComplete = 0;
        var assetList = this.assetList[idx.toString()];
        for (var i = 0; i < assetList.length; i++) {
            cc.loader.release("textures/" + assetList[i]);
        }
    };
    ResourcesMgr.prototype.getloadAssets = function (_name, _callback) {
        if (_callback === void 0) { _callback = null; }
        var isLoad = this.loadingList.find(function (x) { return x[0] === _name; });
        var self = this;
        return new Promise(function (resolve, reject) {
            if (isLoad == null) {
                cc.loader.loadRes(_name, function (err, prefab) {
                    if (err) {
                        cc.error(err);
                        reject(err);
                    }
                    self.loadingList.push([_name, prefab]);
                    cc.log('Load : ' + _name);
                    resolve(prefab);
                });
            }
            else {
                resolve(isLoad[1]);
            }
        });
    };
    ResourcesMgr = __decorate([
        ccclass
    ], ResourcesMgr);
    return ResourcesMgr;
}(cc.Component));
exports.default = ResourcesMgr;

cc._RF.pop();