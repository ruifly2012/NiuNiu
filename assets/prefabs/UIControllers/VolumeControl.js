var ProgressBarWidth = 0;
var mode = "unmute";
cc.Class({
    extends: cc.Component,

    properties: {
        SliderUI: {//Slider元件
            default: null,
            type: cc.Slider
        },
        progress: {//進度條元件
            default: null,
            type: cc.Sprite
        },
        PercentageText: {//音量%數
            default: null,
            type: cc.RichText
        },
        EnableSprite: {//靜音按鈕啟用貼圖
            default: null,
            type: cc.SpriteFrame
        },
        barEnableSprite: {//進度條元件貼圖
            default: null,
            type: cc.SpriteFrame
        },
        barDisableSprite: {//disable進度條元件貼圖
            default: null,
            type: cc.SpriteFrame
        },
        MuteBtn: {//靜音按鈕元件
            default: null,
            type: cc.Button
        },
        volume: 0,//音量
    },
    //設定音量值1~100
    setVolume(vol) {
        if (vol == 0) {
            this.mute();
        }
        else {
            this.unmute();
            this.volume = vol;
            this.Display()
        }
    },

    onLoad() {

        this.SlideEffect();
        this.setVolume(this.volume);

    },
    MuteBtnControl() {//靜音按鍵控制
        if (this.mode == "unmute") {
            this.mute();
        }
        else if (this.mode == "mute") {
            this.unmute();
        }
    },
    SlideEffect() {//Slider元件移動動畫
        this.ProgressBarWidth = this.progress.node.width;
        this.progress.node.width = this.ProgressBarWidth * this.SliderUI.progress;
        this.SliderUI.node.on('slide', function (event) {
            this.unmute();
            this.Display();
        }, this);
    },
    mute() {//靜音
        this.MuteBtn.normalSprite = this.MuteBtn.disabledSprite;
        this.progress.spriteFrame = this.barDisableSprite;
        this.mode = "mute"
    },
    unmute() {//取消靜音
        this.volume = this.SliderUI.progress * 100;
        this.MuteBtn.normalSprite = this.EnableSprite;
        this.progress.spriteFrame = this.barEnableSprite;
        this.mode = "unmute"
    },
    getVolume() {//回傳音量(播放音效時Call)
        if (this.mode != "mute") {
            this.volume = this.SliderUI.progress * 100;
            return this.volume / 100;
        }
        else
            return 0;
    },
    getActualVolume() {//回傳實際音量(for Unity Lobby)
        return this.volume
    },
    getMuteStatus() {//回傳靜音狀態(for Unity Lobby)
        if (this.mode == "mute")
            return 0;
        else
            return 1;
    },
    Display() {//同步進度條與音效%數
        this.SliderUI.progress = this.volume / 100;
        this.PercentageText.string = Math.floor(this.volume) + "%";
        this.progress.node.width = this.SliderUI.progress * this.ProgressBarWidth;
    }
});
