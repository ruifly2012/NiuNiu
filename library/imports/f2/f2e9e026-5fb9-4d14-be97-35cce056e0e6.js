"use strict";
cc._RF.push(module, 'f2e9eAmX7lNFL6XNczgVuDm', 'Player');
// Scripts/Home/Player/Player.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Obj = {
            name: null
        };
        _this.Info = {
            name: null
        };
        return _this;
    }
    Player.prototype.onLoad = function () {
        var self = this;
        //��l�ơA���name/img/money����}
        this.Obj.name = cc.find("nameandcoin/name", this.node).getComponent(cc.Label);
        this.Obj.img = cc.find("pic", this.node).getComponent(cc.Sprite);
        this.Obj.money = cc.find("nameandcoin/Money", this.node).getComponent("Num2Sprite");
        //this.node.active = false;
    };
    Player.prototype.setName = function (name) {
        if (name == '') {
            this.node.active = false;
        }
        else {
            this.node.active = true;
        }
        this.Info.name = name;
        this.Obj.name.string = name;
    };
    Player.prototype.setImg = function (Img) {
        this.Obj.img.spriteFrame = Img;
    };
    Player.prototype.setCoin = function (coin) {
        this.Obj.money.setNum(coin); // �I�sNum2Sprite���禡
    };
    Player = __decorate([
        ccclass
    ], Player);
    return Player;
}(cc.Component));
exports.default = Player;

cc._RF.pop();