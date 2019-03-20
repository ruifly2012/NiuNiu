cc.Class({
    extends: cc.Component,

    properties: {
        SliderUI: {
            default: null,
            type: cc.Slider
        },
        progress: {
            default: null,
            type: cc.Sprite
        },
        PercentageText: {
            default: null,
            type: cc.RichText
        },
        EnableSprite: {
            default: null,
            type: cc.SpriteFrame
        },
        barEnableSprite: {
            default: null,
            type: cc.SpriteFrame
        },
        barDisableSprite: {
            default: null,
            type: cc.SpriteFrame
        },

        MuteBtn: {
            default: null,
            type: cc.Button
        },
        _width: 0,
        volume: 0,
        mode: "unmute",
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.SlideEffect();
        this.volume = this.SliderUI.progress * 100;
        this.PercentageText.string = this.volume + "%";

    },
    update() {
        if (this.mode == "unmute") {
            this.PercentageText.string = Math.floor(this.SliderUI.progress * 100) + "%";
            this.volume = Math.floor(this.SliderUI.progress * 100);
            this.MuteBtn.normalSprite = this.EnableSprite;
        }
        if (this.mode == "mute") {
            this.SliderUI.node.on('slide', function (event) {
                this.unmute();
            }, this)
        }
    },
    MuteOrUnmute() {
        if (this.mode == "unmute") {
            this.mute();
        }
        else if (this.mode == "mute") {
            this.unmute();
        }
    },
    SlideEffect() {
        let slider = this.SliderUI.getComponent(cc.Slider);
        this._width = this.progress.node.width;
        this.progress.node.width = this._width * slider.progress;

        let self = this;
        slider.node.on('slide', function (event) {
            self.progress.node.width = slider.progress * self._width;
        }, this);
    },
    mute() {
        this.volume = 0;
        this.MuteBtn.normalSprite = this.MuteBtn.disabledSprite;
        this.progress.spriteFrame = this.barDisableSprite;
        this.mode = "mute"
    },
    unmute() {
        this.volume = Math.floor(this.SliderUI.progress * 100);
        this.MuteBtn.normalSprite = this.EnableSprite;
        this.progress.spriteFrame = this.barEnableSprite;
        this.mode = "unmute"
    },
    getVolume() {
        if (this.mode != "mute") {
            this.volume = Math.floor(this.SliderUI.progress * 100);
            return this.volume / 100;
        }
        else
            return 0;

    },
});