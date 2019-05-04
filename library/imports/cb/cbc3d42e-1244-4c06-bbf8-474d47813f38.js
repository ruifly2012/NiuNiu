"use strict";
cc._RF.push(module, 'cbc3dQuEkRMBrv4R01HgT84', 'PokerControl');
// Scripts/Home/Poker/PokerControl.ts

Object.defineProperty(exports, "__esModule", { value: true });
//import config from "Config";
var Global_1 = require("../../Common/Global");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var PokerControl = /** @class */ (function (_super) {
    __extends(PokerControl, _super);
    function PokerControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // data member called cardInfo�Aincluding canselect or not, is selected?, and the data of a card
        _this.CardInfo = {
            canselect: true,
            selected: false,
            data: null
        };
        // four kinds of cardType 
        _this.config = {
            pokerCardType: {
                spade: "spade",
                hearts: "hearts",
                blackberry: "blackberry",
                redslice: "redslice",
            }
        };
        _this.pokerTxt = null;
        _this.pokerTxt1 = null;
        _this.pokerType = null;
        _this.pokerType_1 = null;
        _this.pokerType2 = null;
        _this.pokerBackGround = null;
        _this.status = null;
        _this.goldenLight = null;
        return _this;
    }
    //�i��poker
    //�YcardInfo�Onull�A�N���n��ܵP�I
    //�YcardInfo�O{showTxt: ,showType: ,No:}-�P��
    // �YcardInfo�O"string"-status
    PokerControl.prototype.setCard = function (cardInfo, canselect) {
        if (typeof (cardInfo) == "string") {
            this.showstatus(cardInfo);
        }
        else {
            this.showPoker(cardInfo, canselect);
        }
    };
    PokerControl.prototype.showPoker = function (showData, canselect) {
        if (showData == null) {
            this.showPokerBack();
            return;
        }
        var self = this;
        self.node.opacity = 0;
        self.CardInfo.data = showData;
        self.CardInfo.canselect = canselect;
        var showType = showData.showType;
        self.pokerType.enabled = true;
        self.pokerType2.enabled = true;
        self.pokerTxt.enabled = true;
        self.pokerTxt1.enabled = true;
        self.pokerType_1.enabled = true;
        self.pokerBackGround.enabled = true;
        self.status.enabled = false;
        //self.goldenLight.enabled = true;
        var imgUrl = "S-S"; // �p�³�
        var imgUrl2 = "S"; // �j�³�
        var textUrl = "KD-" + showData.showTxt; // �¦�Ʀr
        var backUrl = "PC"; // �d������(���e��)
        if (showType == self.config.pokerCardType.spade) { // �³�
            imgUrl = "S-S";
            switch (showData.showTxt) {
                case "J":
                    imgUrl2 = "KJ";
                    break;
                case "Q":
                    imgUrl2 = "KQ";
                    break;
                case "K":
                    imgUrl2 = "KK";
                    break;
                default:
                    imgUrl2 = "S";
                    break;
            }
            textUrl = "KD-" + showData.showTxt;
        }
        else if (showType == self.config.pokerCardType.hearts) {
            switch (showData.showTxt) {
                case "J":
                    imgUrl2 = "RJ";
                    break;
                case "Q":
                    imgUrl2 = "RQ";
                    break;
                case "K":
                    imgUrl2 = "RK";
                    break;
                default:
                    imgUrl2 = "H";
                    break;
            }
            imgUrl = "H-S";
            textUrl = "RD-" + showData.showTxt;
        }
        else if (showType == self.config.pokerCardType.redslice) {
            switch (showData.showTxt) {
                case "J":
                    imgUrl2 = "RJ";
                    break;
                case "Q":
                    imgUrl2 = "RQ";
                    break;
                case "K":
                    imgUrl2 = "RK";
                    break;
                default:
                    imgUrl2 = "B";
                    break;
            }
            imgUrl = "B-S";
            textUrl = "RD-" + showData.showTxt;
        }
        else if (showType == self.config.pokerCardType.laizi) {
            imgUrl = "T-S";
            imgUrl2 = "T";
            textUrl = "RD-" + showData.showTxt;
        }
        else if (showType == self.config.pokerCardType.blackberry) {
            switch (showData.showTxt) {
                case "J":
                    imgUrl2 = "KJ";
                    break;
                case "Q":
                    imgUrl2 = "KQ";
                    break;
                case "K":
                    imgUrl2 = "KK";
                    break;
                default:
                    imgUrl2 = "P";
                    break;
            }
            imgUrl = "P-S";
            textUrl = "KD-" + showData.showTxt;
        }
        else if (showType == self.config.ghostCardType.bigG) {
            self.pokerType.enabled = false;
            self.pokerType_1.enabled = false;
            textUrl = "RD-JOCKER";
            imgUrl2 = "RJO";
        }
        else if (showType == self.config.ghostCardType.smallG) {
            self.pokerType.enabled = false;
            self.pokerType_1.enabled = false;
            textUrl = "KD-JOCKER";
            imgUrl2 = "KJO";
        }
        cc.loader.loadRes('card/Cards', cc.SpriteAtlas, function (err, atlas) {
            self.pokerBackGround.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(backUrl);
            cc.loader.loadRes('card/Cards', cc.SpriteAtlas, function (err, atlas) {
                self.pokerType.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(imgUrl);
                self.pokerType_1.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(imgUrl);
                cc.loader.loadRes('card/Cards', cc.SpriteAtlas, function (err, atlas) {
                    self.pokerTxt.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(textUrl);
                    self.pokerTxt1.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(textUrl);
                    cc.loader.loadRes('card/Cards', cc.SpriteAtlas, function (err, atlas) {
                        self.pokerType2.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(imgUrl2);
                        self.node.opacity = 255;
                    });
                });
            });
        });
        //cc.log("show card by pokercontrol");
    };
    PokerControl.prototype.showPokerBack = function () {
        var self = this;
        self.CardInfo.data = null;
        self.CardInfo.canselect = false;
        self.pokerType.enabled = false;
        self.pokerType_1.enabled = false;
        self.pokerType2.enabled = false;
        self.pokerTxt.enabled = false;
        self.pokerTxt1.enabled = false;
        self.status.enabled = false;
        var imgUrl = "BK";
        cc.loader.loadRes('card/Cards', cc.SpriteAtlas, function (err, atlas) {
            self.pokerBackGround.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(imgUrl);
        });
    };
    PokerControl.prototype.showstatus = function (status) {
        var self = this;
        self.CardInfo.data = status;
        self.CardInfo.canselect = false;
        self.pokerType.enabled = false;
        self.pokerType_1.enabled = false;
        self.pokerType2.enabled = false;
        self.pokerBackGround.enabled = false;
        self.pokerTxt.enabled = false;
        self.pokerTxt1.enabled = false;
        //cc.log("show poker status %s", status);
        self.status.getComponent(cc.Sprite).spriteFrame = Global_1.default.Instance.resources.load(status);
        cc.loader.loadRes("text/" + status, cc.SpriteFrame, function (err, spriteFrame) {
            if (err)
                cc.log(" fail show poker status %s", status);
            else {
                self.status.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                //cc.log("success show poker status %s", status);
            }
        });
    };
    PokerControl.prototype.showcardtype = function (status, frame) {
        var self = this;
        self.CardInfo.data = status;
        self.CardInfo.canselect = false;
        self.pokerType.enabled = false;
        self.pokerType_1.enabled = false;
        self.pokerType2.enabled = true;
        self.pokerBackGround.enabled = false;
        self.pokerTxt.enabled = false;
        self.pokerTxt1.enabled = false;
        cc.loader.loadRes("newnew/Prize/Award_text_" + status, cc.SpriteFrame, function (err, spriteFrame) {
            self.status.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes("newnew/Prize/Award_frame_0" + frame, cc.SpriteFrame, function (err, spriteFrame) {
            self.pokerType2.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    };
    PokerControl.prototype.showresult = function (status) {
        var self = this;
        self.CardInfo.data = status;
        self.CardInfo.canselect = false;
        self.pokerType.enabled = false;
        self.pokerType_1.enabled = false;
        self.pokerType2.enabled = true; // award frame
        self.pokerBackGround.enabled = false;
        self.pokerTxt.enabled = false;
        self.pokerTxt1.enabled = false;
        cc.loader.loadRes("newnew/Prize/Award_frame_" + status, cc.SpriteFrame, function (err, spriteFrame) {
            self.pokerType2.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes("newnew/Prize/Award_text_" + status, cc.SpriteFrame, function (err, spriteFrame) {
            self.status.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    };
    PokerControl.prototype.onLoad = function () {
        var self = this;
        this.pokerBackGround.node.on('touchstart', function (event) {
            if (self.CardInfo.canselect == false) {
                // do nothing
            }
            else if (self.CardInfo.selected == false) {
                self.select();
                //global.EventListener.fire("CardSelected");
                Global_1.default.Instance.EventListener.notify("CardSelected");
            }
            else {
                self.unselect();
                //global.EventListener.fire("CardUnselected");
                Global_1.default.Instance.EventListener.notify("CardUnselected");
            }
        });
    };
    PokerControl.prototype.unselect = function () {
        var self = this;
        if (this.CardInfo.canselect == false)
            return;
        this.CardInfo.selected = false;
        //global.EventListener.fire("CardUnselected");
        //this.node.setPositionY(0);
        this.node.y = -404;
        //self.unactiveLight();
        self.unenableLight();
        //self.edgeLight.active = false;
        //self.goldenLight.active = false;
        //cc.log("light active �G ", self.goldenLight.active);
    };
    PokerControl.prototype.select = function () {
        var self = this;
        if (this.CardInfo.canselect == false)
            return;
        this.CardInfo.selected = true;
        //global.EventListener.fire("CardSelected");
        //this.node.setPositionY(20);
        this.node.y = -387;
        //self.activeLight();
        self.enableLight();
        //self.goldenLight.enabled = true;
        //cc.log("light active �G ", self.goldenLight.active);
    };
    PokerControl.prototype.setCanSelect = function (bool) {
        var self = this;
        self.CardInfo.canselect = bool;
    };
    // get function
    //-------------------------------------
    PokerControl.prototype.getValue = function () {
        return this.CardInfo.data;
    };
    PokerControl.prototype.isSelected = function () {
        return this.CardInfo.selected;
    };
    PokerControl.prototype.getNumber = function () {
        if (this.CardInfo.data.showTxt === 'A')
            return 1;
        else if (this.CardInfo.data.showTxt === 'J')
            return 11;
        else if (this.CardInfo.data.showTxt === 'Q')
            return 12;
        else if (this.CardInfo.data.showTxt === 'K')
            return 13;
        else
            return this.CardInfo.data.showTxt;
    };
    //-------------------------------------
    PokerControl.prototype.activeLight = function () {
        var self = this;
        self.goldenLight.active = true;
        cc.log("activeLight");
    };
    PokerControl.prototype.unactiveLight = function () {
        var self = this;
        self.goldenLight.active = false;
        cc.log("unactiveLight");
    };
    PokerControl.prototype.enableLight = function () {
        var self = this;
        self.goldenLight.enabled = true;
        cc.log("enable Light");
    };
    PokerControl.prototype.unenableLight = function () {
        var self = this;
        self.goldenLight.enabled = false;
        cc.log("unenableLight");
    };
    __decorate([
        property(cc.Sprite) // upper number 
    ], PokerControl.prototype, "pokerTxt", void 0);
    __decorate([
        property(cc.Sprite) // lower number
    ], PokerControl.prototype, "pokerTxt1", void 0);
    __decorate([
        property(cc.Sprite) // upper image
    ], PokerControl.prototype, "pokerType", void 0);
    __decorate([
        property(cc.Sprite) // lower image
    ], PokerControl.prototype, "pokerType_1", void 0);
    __decorate([
        property(cc.Sprite) // middle image( cardtype or cardback)
    ], PokerControl.prototype, "pokerType2", void 0);
    __decorate([
        property(cc.Sprite) // white back when showing card
    ], PokerControl.prototype, "pokerBackGround", void 0);
    __decorate([
        property(cc.Sprite) // status like double, triple...(when showing status, all upper node turn off)
    ], PokerControl.prototype, "status", void 0);
    __decorate([
        property(cc.Sprite)
    ], PokerControl.prototype, "goldenLight", void 0);
    PokerControl = __decorate([
        ccclass
    ], PokerControl);
    return PokerControl;
}(cc.Component));
exports.default = PokerControl;

cc._RF.pop();