"use strict";
cc._RF.push(module, '7f9718J2CpIu6U2QESMtWlr', 'PlayerInfoViewController');
// Scripts/Home/Player/PlayerInfoViewController.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("../../Common/Global");
var NN = require("../../NNDefine");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var player;
(function (player) {
    player[player["prepre"] = 0] = "prepre";
    player[player["pre"] = 1] = "pre";
    player[player["me"] = 2] = "me";
    player[player["next"] = 3] = "next";
    player[player["nextnext"] = 4] = "nextnext";
})(player || (player = {}));
var PlayerInfoViewController = /** @class */ (function (_super) {
    __extends(PlayerInfoViewController, _super);
    function PlayerInfoViewController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //ctor
        //=====================================================================
        _this.playerInfo = null;
        _this.playerScript = [];
        _this.defaultImgs = ["newnew/common/playerPic1", "newnew/common/playerPic2", "newnew/common/playerPic3", "newnew/common/playerPic4", "newnew/common/playerPic5", "newnew/common/playerPic6"];
        //=====================================================================
        //property
        //================================================
        _this.players = [];
        // IF WANT TO CHANGE TO ARRAY, HERE IS THE SOLUTION
        /*@property(cc.Node)
        fiveRival: cc.Node[] = [];*/
        _this.Autoplaying = null;
        return _this;
        // UpdateRoom(playerInfo) {
        //     cc.log("updateRoom");
        //     let self = this;
        //     //cc.log(playerInfo);
        //     this.playerScript.Me.setName(playerInfo.Me.name);
        //     this.playerScript.PreRival.setName(playerInfo.Pre.name);
        //     this.playerScript.NextRival.setName(playerInfo.Next.name);
        //     this.playerScript.PrePreRival.setName(playerInfo.PrePre.name);
        //     this.playerScript.NextNextRival.setName(playerInfo.NextNext.name);
        //     this.playerScript.Me.setCoin(playerInfo.Me.coin);
        //     this.playerScript.PreRival.setCoin(playerInfo.Pre.coin);
        //     this.playerScript.NextRival.setCoin(playerInfo.Next.coin);
        //     this.playerScript.PrePreRival.setCoin(playerInfo.PrePre.coin);
        //     this.playerScript.NextNextRival.setCoin(playerInfo.NextNext.coin);
        //     if (playerInfo.Me.img != null)
        //         cc.loader.loadRes(this.defaultImgs[playerInfo.Me.img], cc.SpriteFrame, function (err, spriteFrame) {
        //             self.playerScript.Me.setImg(spriteFrame);
        //         });
        //     if (playerInfo.Pre.img != null)
        //         cc.loader.loadRes(this.defaultImgs[playerInfo.Pre.img], cc.SpriteFrame, function (err, spriteFrame) {
        //             self.playerScript.PreRival.setImg(spriteFrame);
        //         });
        //     if (playerInfo.Next.img != null)
        //         cc.loader.loadRes(this.defaultImgs[playerInfo.Next.img], cc.SpriteFrame, function (err, spriteFrame) {
        //             self.playerScript.NextRival.setImg(spriteFrame);
        //         });
        //     if (playerInfo.PrePre.img != null)
        //         cc.loader.loadRes(this.defaultImgs[playerInfo.PrePre.img], cc.SpriteFrame, function (err, spriteFrame) {
        //             self.playerScript.PrePreRival.setImg(spriteFrame);
        //         });
        //     if (playerInfo.NextNext.img != null)
        //         cc.loader.loadRes(this.defaultImgs[playerInfo.NextNext.img], cc.SpriteFrame, function (err, spriteFrame) {
        //             self.playerScript.NextNextRival.setImg(spriteFrame);
        //         });
        // }
    }
    PlayerInfoViewController_1 = PlayerInfoViewController;
    Object.defineProperty(PlayerInfoViewController, "Inst", {
        get: function () {
            if (!PlayerInfoViewController_1.inst) {
                return undefined;
            }
            return this.inst;
        },
        enumerable: true,
        configurable: true
    });
    PlayerInfoViewController.prototype.autoPlay = function () {
        Global_1.default.Instance.EventListener.notify("AIswitch");
    };
    PlayerInfoViewController.prototype.onLoad = function () {
        var self = this;
        PlayerInfoViewController_1.inst = this;
        /*
        this.playerScript.PreRival = this.PreRival.getComponent("Player");
        this.playerScript.Me = this.Me.getComponent("Player");
        this.playerScript.NextRival = this.NextRival.getComponent("Player");
        this.playerScript.PrePreRival = this.PrePreRival.getComponent("Player");
        this.playerScript.NextNextRival = this.NextNextRival.getComponent("Player");
        */
        cc.loader.loadResDir("newnew/common", function (err, assets) { });
        /*global.Instance.EventListener.on("roomReady", function (event, Info) {
            //cc.log("roomReady in PlayerInfoViewCtrlr");
            //cc.log("piv get ", Info);
            self.UpdateRoom(Info);
            //cc.log("RoomReady in Player Done");
        });*/
    };
    PlayerInfoViewController.prototype.init = function () {
        PlayerInfoViewController_1.inst.playerCount = NN.GameInfo.Inst.playerCount;
        for (var index = 0; index < this.playerCount; index++) {
            cc.log("get player" + index + this.players[index]);
            PlayerInfoViewController_1.inst.playerScript[index] = this.players[index].getComponent("Player");
            PlayerInfoViewController_1.inst.playerScript[index].setHeadSprite("playerPic1");
        }
    };
    PlayerInfoViewController.prototype.updatePlayer = function () {
        for (var index = 0; index < this.playerCount; index++) {
            PlayerInfoViewController_1.inst.playerScript[index].setName(NN.GameInfo.Inst.players[index].name);
            PlayerInfoViewController_1.inst.playerScript[index].setMoney(NN.GameInfo.Inst.players[index].money);
            PlayerInfoViewController_1.inst.playerScript[index].setHeadSprite("playerPic" + NN.GameInfo.Inst.players[index].iconID);
        }
    };
    PlayerInfoViewController.prototype.showKingAnime = function (kingUID) {
        //this.Me.getChildByName("dizhuIcon").active = true;
    };
    var PlayerInfoViewController_1;
    //=================================================
    PlayerInfoViewController.inst = null;
    __decorate([
        property(cc.Node)
    ], PlayerInfoViewController.prototype, "players", void 0);
    __decorate([
        property(cc.Node)
    ], PlayerInfoViewController.prototype, "Autoplaying", void 0);
    PlayerInfoViewController = PlayerInfoViewController_1 = __decorate([
        ccclass
    ], PlayerInfoViewController);
    return PlayerInfoViewController;
}(cc.Component));
exports.default = PlayerInfoViewController;

cc._RF.pop();