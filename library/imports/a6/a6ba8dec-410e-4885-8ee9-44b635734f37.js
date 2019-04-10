"use strict";
cc._RF.push(module, 'a6ba83sQQ5IhY7pRLY1c083', 'moneyBgAnime');
// prefabs/MoneyFlow/moneyBgAnime.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var moneyBgAnime = /** @class */ (function (_super) {
    __extends(moneyBgAnime, _super);
    function moneyBgAnime() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.frames = [new cc.SpriteFrame];
        _this.speed = 1; //anime speed
        return _this;
    }
    moneyBgAnime.prototype.onLoad = function () {
        var self = this;
        //add component
        self.node.addComponent(cc.Sprite);
        self.node.addComponent(cc.Animation);
        //set spriteframe
        for (var i = 0; i < 16; i++) {
            self.frames.pop();
            var temp = String(i);
            if (i < 10)
                temp = "0" + i;
            var url = "Animations/moneyflow/effect_0" + temp;
            cc.loader.loadRes(url, function (err, tex) {
                self.frames.push(new cc.SpriteFrame(tex));
            });
        }
    };
    moneyBgAnime.prototype.playBgAnime = function (seatX, seatY) {
        var self = this;
        var animation = self.node.getComponent(cc.Animation);
        if (!self.node.getComponent(cc.Animation))
            cc.log("get anime fail");
        //set clip
        var clip = cc.AnimationClip.createWithSpriteFrames(self.frames, 16);
        clip.name = "anim_run";
        clip.wrapMode = cc.WrapMode.Loop;
        //set position
        self.node.runAction(cc.place(seatX - 14, seatY - 5));
        //set show time
        var action = cc.sequence(cc.delayTime(0.5), cc.show(), cc.delayTime(0.4), cc.hide());
        self.node.runAction(action);
        //play anime
        //if(!animation) cc.log("moneyBG anime component null, self = " + self + ", self.node = " + self.node);
        animation.addClip(clip);
        var animeState = animation.play('anim_run');
        animeState.speed = self.speed;
        animeState.wrapMode = cc.WrapMode.Loop;
        animeState.repeatCount = 5;
    };
    moneyBgAnime.prototype.moneyShine = function (toSeat) {
        var self = this;
        toSeat = parseInt(toSeat);
        var pos = [{
                x: -419,
                y: 331
            },
            {
                x: -811,
                y: 53
            },
            {
                x: -515,
                y: -328
            },
            {
                x: 811,
                y: 51
            },
            {
                x: 417,
                y: 336
            }];
        //cc.log("to " + pos[toSeat].x + "," + pos[toSeat].y);
        //cc.log("play BG Anime : " + toSeat);
        self.playBgAnime(pos[toSeat].x, pos[toSeat].y);
    };
    moneyBgAnime = __decorate([
        ccclass
    ], moneyBgAnime);
    return moneyBgAnime;
}(cc.Component));
exports.default = moneyBgAnime;

cc._RF.pop();