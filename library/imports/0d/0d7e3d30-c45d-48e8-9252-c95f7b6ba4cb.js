"use strict";
cc._RF.push(module, '0d7e30wxF1I6JJSyV97a6TL', 'VolumeControl');
// prefabs/UIControllers/VolumeControl.js

"use strict";

var ProgressBarWidth = 0;
var mode = "unmute";
cc.Class({
    extends: cc.Component,

    properties: {
        SliderUI: { //Slider����
            default: null,
            type: cc.Slider
        },
        progress: { //�i�ױ�����
            default: null,
            type: cc.Sprite
        },
        PercentageText: { //���q%��
            default: null,
            type: cc.RichText
        },
        EnableSprite: { //�R�����s�ҥζK��
            default: null,
            type: cc.SpriteFrame
        },
        barEnableSprite: { //�i�ױ�����K��
            default: null,
            type: cc.SpriteFrame
        },
        barDisableSprite: { //disable�i�ױ�����K��
            default: null,
            type: cc.SpriteFrame
        },
        MuteBtn: { //�R�����s����
            default: null,
            type: cc.Button
        },
        volume: 0 //���q
    },
    //�]�w���q��1~100
    setVolume: function setVolume(vol) {
        if (vol == 0) {
            this.mute();
        } else {
            this.unmute();
            this.volume = vol;
            this.Display();
        }
    },
    onLoad: function onLoad() {

        this.SlideEffect();
        this.setVolume(this.volume);
    },
    MuteBtnControl: function MuteBtnControl() {
        //�R�����䱱��
        if (this.mode == "unmute") {
            this.mute();
        } else if (this.mode == "mute") {
            this.unmute();
        }
    },
    SlideEffect: function SlideEffect() {
        //Slider���󲾰ʰʵe
        this.ProgressBarWidth = this.progress.node.width;
        this.progress.node.width = this.ProgressBarWidth * this.SliderUI.progress;
        this.SliderUI.node.on('slide', function (event) {
            this.unmute();
            this.Display();
        }, this);
    },
    mute: function mute() {
        //�R��
        this.MuteBtn.normalSprite = this.MuteBtn.disabledSprite;
        this.progress.spriteFrame = this.barDisableSprite;
        this.mode = "mute";
    },
    unmute: function unmute() {
        //�����R��
        this.volume = this.SliderUI.progress * 100;
        this.MuteBtn.normalSprite = this.EnableSprite;
        this.progress.spriteFrame = this.barEnableSprite;
        this.mode = "unmute";
    },
    getVolume: function getVolume() {
        //�^�ǭ��q(���񭵮Į�Call)
        if (this.mode != "mute") {
            this.volume = this.SliderUI.progress * 100;
            return this.volume / 100;
        } else return 0;
    },
    getActualVolume: function getActualVolume() {
        //�^�ǹ�ڭ��q(for Unity Lobby)
        return this.volume;
    },
    getMuteStatus: function getMuteStatus() {
        //�^���R�����A(for Unity Lobby)
        if (this.mode == "mute") return 0;else return 1;
    },
    Display: function Display() {
        //�P�B�i�ױ��P����%��
        this.SliderUI.progress = this.volume / 100;
        this.PercentageText.string = Math.floor(this.volume) + "%";
        this.progress.node.width = this.SliderUI.progress * this.ProgressBarWidth;
    }
});

cc._RF.pop();