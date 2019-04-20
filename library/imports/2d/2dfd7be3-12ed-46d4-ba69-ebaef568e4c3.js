"use strict";
cc._RF.push(module, '2dfd7vjEu1G1Lpp6671aOTD', 'moneyAnime');
// Scripts/Animations/moneyAnime.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var moneyAnime = /** @class */ (function (_super) {
    __extends(moneyAnime, _super);
    function moneyAnime() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.frames = [new cc.SpriteFrame];
        return _this;
    }
    moneyAnime.prototype.onLoad = function () {
        var self = this;
        //add component
        self.node.addComponent(cc.Sprite);
        self.node.addComponent(cc.Animation);
        //set spriteframe
        for (var i = 0; i < 12; i++) {
            var temp = String(i);
            self.frames.pop();
            if (i < 10)
                temp = "0" + i;
            var url = "Animations/moneyflow/coin1/coin1_0" + temp;
            cc.loader.loadRes(url, function (err, tex) {
                self.frames.push(new cc.SpriteFrame(tex));
            });
        }
    };
    moneyAnime.prototype.playMoneyAnime = function (fromX, fromY, toX, toY, xOffset, yOffset, interval, speed) {
        if (interval === void 0) { interval = 2; }
        if (speed === void 0) { speed = 1; }
        var self = this;
        var animation = self.node.getComponent(cc.Animation);
        var startPos = cc.v2(fromX + xOffset, fromY + yOffset);
        var endPos = cc.v2(toX + yOffset / 3, toY + xOffset / 3);
        //set clip
        var clip = cc.AnimationClip.createWithSpriteFrames(self.frames, 17);
        clip.name = "anim_run";
        clip.wrapMode = cc.WrapMode.Loop;
        //set start position
        var action = cc.place(startPos);
        self.node.runAction(action);
        //play anime
        animation.addClip(clip);
        var animeState = animation.play('anim_run');
        animeState.speed = speed;
        animeState.wrapMode = cc.WrapMode.Loop;
        animeState.repeatCount = 5;
        //set action
        var midPoint;
        if (startPos.y > endPos.y) {
            midPoint = cc.v2(endPos.x * (1.2) + startPos.x * (-0.2), startPos.y * (1.5) + endPos.y * -0.5);
        }
        else {
            midPoint = cc.v2(endPos.x * (1.2) + startPos.x * (-0.2), endPos.y * (1.5) + startPos.y * -0.5);
        }
        var path = [startPos, midPoint, endPos];
        action = cc.sequence(cc.show(), 
        //x,y sametime
        /*
        cc.spawn(
            //x y use seperate func
            cc.moveBy(interval , (toX+ yOffset/3) - (fromX + xOffset) , 0).easing(cc.easeQuadraticActionOut()),
            cc.moveBy(interval , 0 , (toY+ xOffset/3) - (fromY + yOffset)).easing(cc.easeSineIn()),
        ),
        */
        cc.bezierTo(interval, path), cc.hide());
        self.node.runAction(action);
    };
    moneyAnime.prototype.moneyFlow = function (from, to, xOffset, yOffset, speedAndIntervalVal) {
        if (xOffset === void 0) { xOffset = 0; }
        if (yOffset === void 0) { yOffset = 0; }
        var self = this;
        //cc.log("from "+fromSeat+" to "+toSeat);
        //cc.log("from "+from+" to "+to);
        var pos = [
            { x: -418, y: 331 },
            { x: -811, y: 53 },
            { x: -515, y: -324 },
            { x: 804, y: 44 },
            { x: 402, y: 336 } //nextnext
        ];
        //cc.log("from seat " + from +"pos "+ pos[from].x + xOffset + "," + pos[from].y + yOffset);
        //cc.log("to seat " + to +"pos" + pos[to].x + "," + pos[to].y);
        self.playMoneyAnime(pos[from].x, pos[from].y, pos[to].x, pos[to].y, xOffset, yOffset, speedAndIntervalVal * 0.01 + 0.5, 1.5 + 0.5 * speedAndIntervalVal);
    };
    moneyAnime = __decorate([
        ccclass
    ], moneyAnime);
    return moneyAnime;
}(cc.Component));
exports.default = moneyAnime;

cc._RF.pop();