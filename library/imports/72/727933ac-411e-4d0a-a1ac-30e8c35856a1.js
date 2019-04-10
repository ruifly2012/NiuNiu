"use strict";
cc._RF.push(module, '72793OsQR5NCqGsMOjDWFah', 'Num2Sprite');
// Scripts/Home/Num2Sprite.ts

Object.defineProperty(exports, "__esModule", { value: true });
// timers 是可下載的模組(人家寫好的)
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resourcedirectory = "";
        return _this;
    }
    NewClass.prototype.UrlTable = function (char) {
        switch (char) {
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "0":
                return char;
            case "8":
                return "9";
            case "9":
                return "8";
            case ":":
                return "colon";
            case ",":
                return "comma";
            case ".":
                return "dot";
            case "-":
                return "hyphen";
        }
        ;
    };
    NewClass.prototype.onLoad = function () {
        cc.loader.loadResDir(this.resourcedirectory, function (err, assets) { });
    };
    NewClass.prototype.setNum = function (num, resourcedirectory) {
        if (resourcedirectory === void 0) { resourcedirectory = this.resourcedirectory; }
        var self = this;
        if (num == null) {
            self.node.removeAllChildren();
            return;
        }
        var resoureURLArray = [];
        var str = num;
        if (typeof (str) != "string")
            str = num.toString();
        cc.loader.loadRes(resourcedirectory, cc.SpriteAtlas, function (err, atlas) {
            //re add child and atlas
            self.node.removeAllChildren();
            for (var i = 0; i < str.length; i++) {
                var newNode = new cc.Node();
                newNode.addComponent(cc.Sprite);
                newNode.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(self.UrlTable(str[i]));
                self.node.addChild(newNode);
            }
        });
    };
    __decorate([
        property
    ], NewClass.prototype, "resourcedirectory", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();