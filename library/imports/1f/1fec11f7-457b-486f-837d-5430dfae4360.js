"use strict";
cc._RF.push(module, '1fec1H3RXtIb4N9VDDfrkNg', 'HelpPageController');
// prefabs/UIControllers/HelpPageController.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        IntroBtntex: {
            default: null,
            type: cc.SpriteFrame
        },
        Rule1Btntex: {
            default: null,
            type: cc.SpriteFrame
        },
        Rule2Btntex: {
            default: null,
            type: cc.SpriteFrame
        },
        Rule3Btntex: {
            default: null,
            type: cc.SpriteFrame
        },
        Rule4Btntex: {
            default: null,
            type: cc.SpriteFrame
        },
        AboutUsBtntex: {
            default: null,
            type: cc.SpriteFrame
        },
        IntroPage: {
            default: null,
            type: cc.Node
        },
        Rule1Page: {
            default: null,
            type: cc.Node
        },
        Rule2Page: {
            default: null,
            type: cc.Node
        },
        Rule3Page: {
            default: null,
            type: cc.Node
        },
        Rule4Page: {
            default: null,
            type: cc.Node
        },
        AboutUsPage: {
            default: null,
            type: cc.Node
        },
        IntroBtn: {
            default: null,
            type: cc.Button
        },
        Rule1Btn: {
            default: null,
            type: cc.Button
        },
        Rule2Btn: {
            default: null,
            type: cc.Button
        },
        Rule3Btn: {
            default: null,
            type: cc.Button
        },
        Rule4Btn: {
            default: null,
            type: cc.Button
        },
        AboutUsBtn: {
            default: null,
            type: cc.Button
        },
        HelpPages: {
            default: null,
            type: cc.Node
        }
    },
    onLoad: function onLoad() {},
    ViewIntroPage: function ViewIntroPage() {

        this.RePosition();
        this.ReloadSprite();

        this.IntroBtn.node.height = 86;
        this.IntroBtn.normalSprite = this.IntroBtn.pressedSprite;
        this.IntroPage.active = true;
        this.Rule1Page.active = false;
        this.Rule2Page.active = false;
        this.Rule3Page.active = false;
        this.Rule4Page.active = false;
        this.AboutUsPage.active = false;
    },
    ViewRule1Page: function ViewRule1Page() {
        this.RePosition();
        this.ReloadSprite();
        this.Rule1Btn.node.height = 86;
        this.Rule1Btn.normalSprite = this.Rule1Btn.pressedSprite;
        this.IntroPage.active = false;
        this.Rule1Page.active = true;
        this.Rule2Page.active = false;
        this.Rule3Page.active = false;
        this.Rule4Page.active = false;
        this.AboutUsPage.active = false;
    },
    VeiwRule2Page: function VeiwRule2Page() {
        this.RePosition();
        this.ReloadSprite();
        this.Rule2Btn.node.height = 86;
        this.Rule2Btn.normalSprite = this.Rule2Btn.pressedSprite;
        this.IntroPage.active = false;
        this.Rule1Page.active = false;
        this.Rule2Page.active = true;
        this.Rule3Page.active = false;
        this.Rule4Page.active = false;
        this.AboutUsPage.active = false;
    },
    ViewRule3Page: function ViewRule3Page() {
        this.RePosition();
        this.ReloadSprite();
        this.Rule3Btn.node.height = 86;
        this.Rule3Btn.normalSprite = this.Rule3Btn.pressedSprite;
        this.IntroPage.active = false;
        this.Rule1Page.active = false;
        this.Rule2Page.active = false;
        this.Rule3Page.active = true;
        this.Rule4Page.active = false;
        this.AboutUsPage.active = false;
    },
    VeiwRule4Page: function VeiwRule4Page() {
        this.RePosition();
        this.ReloadSprite();
        this.Rule4Btn.node.height = 86;
        this.Rule4Btn.normalSprite = this.Rule4Btn.pressedSprite;
        this.IntroPage.active = false;
        this.Rule1Page.active = false;
        this.Rule2Page.active = false;
        this.Rule3Page.active = false;
        this.Rule4Page.active = true;
        this.AboutUsPage.active = false;
    },
    ViewAboutUsPage: function ViewAboutUsPage() {
        this.RePosition();
        this.ReloadSprite();
        this.AboutUsBtn.node.height = 86;
        this.AboutUsBtn.normalSprite = this.AboutUsBtn.pressedSprite;
        this.IntroPage.active = false;
        this.Rule1Page.active = false;
        this.Rule2Page.active = false;
        this.Rule3Page.active = false;
        this.Rule4Page.active = false;
        this.AboutUsPage.active = true;
    },
    OpenHelpPage: function OpenHelpPage() {
        this.RePosition();
        this.ReloadSprite();
        this.HelpPages.active = true;
        this.ViewIntroPage();
    },
    CloseHelpPage: function CloseHelpPage() {
        this.HelpPages.active = false;
    },
    ReloadSprite: function ReloadSprite() {
        this.IntroBtn.normalSprite = this.IntroBtntex;
        this.Rule1Btn.normalSprite = this.Rule1Btntex;
        this.Rule2Btn.normalSprite = this.Rule2Btntex;
        this.Rule3Btn.normalSprite = this.Rule3Btntex;
        this.Rule4Btn.normalSprite = this.Rule4Btntex;
        this.AboutUsBtn.normalSprite = this.AboutUsBtntex;
    },
    RePosition: function RePosition() {
        this.IntroBtn.node.height = 70;
        this.Rule1Btn.node.height = 70;
        this.Rule2Btn.node.height = 70;
        this.Rule3Btn.node.height = 70;
        this.Rule4Btn.node.height = 70;
        this.AboutUsBtn.node.height = 70;

        this.IntroPage.getComponent(cc.ScrollView).scrollToTop(0.0);
        this.Rule1Page.getComponent(cc.ScrollView).scrollToTop(0.0);
        this.Rule2Page.getComponent(cc.ScrollView).scrollToTop(0.0);
        this.Rule3Page.getComponent(cc.ScrollView).scrollToTop(0.0);
        this.Rule4Page.getComponent(cc.ScrollView).scrollToTop(0.0);
        this.AboutUsPage.getComponent(cc.ScrollView).scrollToTop(0.0);
    }
});

cc._RF.pop();