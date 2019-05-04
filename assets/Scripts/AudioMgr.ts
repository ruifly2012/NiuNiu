import Game from "./Game";

const { ccclass, property } = cc._decorator;

/**
 * BGM、音效管理物件
 */
@ccclass
export default class AudioMgr extends cc.Component {
    /**BGM音量 */
    bgmVolume: number = 1.0;
    /**音效音量 */
    effectVolume: number = 1.0;
    /**當前BGM_ID */
    bgmAudioID: number = -1;

    /**當前BGM資源路徑 */
    bgmUrl: string = "";
    /**BGM最大音量 */
    bgmMaxVolume: number = 0.5;
    /**漸入/出 BGM音量 */
    fadeVolume: number = 1.0;

    /**已播放音效暫存區 */
    cooldown = [];

    // use this for initialization
    init() {
        this.node = new cc.Node("AudioMgr");
        //cc.game.addPersistRootNode(this.node);

        let t = cc.sys.localStorage.getItem("bgmVolume");
        if (!cc.isValid(t)) {
            this.setBGMVolume(true);
        }
        else {
            this.bgmVolume = parseFloat(t);
        }

        t = cc.sys.localStorage.getItem("sfxVolume");
        if (!cc.isValid(t)) {
            this.setEffectVolume(true);
        }
        else {
            this.effectVolume = parseFloat(t);
        }

        cc.game.on(cc.game.EVENT_HIDE, () => {
            //cc.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });

        cc.game.on(cc.game.EVENT_SHOW, () => {
            //cc.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
        });
    }

    /**取得BGM/音效存放路徑 */
    getUrl(url) {
        return cc.url.raw("resources/sfx/" + url + ".mp3");
    }

    /**
     * 播放BGM
     * @param url BGM路徑
     */
    playBGM(url) {
        let audioUrl = this.getUrl(url);
        if (this.bgmUrl !== "" && this.bgmUrl === audioUrl)
            return;

        this.bgmUrl = audioUrl;
        let fadeTime = 1.0;
        let seq = cc.sequence(
            cc.callFunc(() => {
                this.fadeBGM(false, fadeTime);
            }),
            cc.delayTime(fadeTime),
            cc.callFunc(() => {
                if (this.bgmAudioID > -1)
                    cc.audioEngine.stop(this.bgmAudioID);
                //ResourceMgr需管裡資源
                cc.loader.load(audioUrl, function (err, clip) {
                    this.bgmAudioID = cc.audioEngine.play(clip, true, this.bgmVolume * this.bgmMaxVolume);
                }.bind(this));
                this.fadeBGM(true, fadeTime);
            }),
        );
        this.node.runAction(seq);
    }

    /**
     * 播放音效
     * @param url 音效路徑
     * @param volume 音效音量
     */
    playEffect(url, volume = 1.0) {
        for (let i = 0; i < this.cooldown.length; i++) {
            if (this.cooldown[i] === url)
                return;
        }

        cc.log("playSFX: " + url);
        this.cooldown.push(url);
        setTimeout(() => {
            let idx = this.cooldown.indexOf(url);
            if (idx > -1)
                this.cooldown.splice(idx, 1);
        }, 0.5);

        let audioUrl = this.getUrl(url);
        if (this.effectVolume > 0) {
            //ResourceMgr需管裡資源
            cc.loader.load(audioUrl, function (err, clip) {
                let audioId = cc.audioEngine.play(clip, false, this.effectVolume * volume);
            }.bind(this));
        }
    }

    /**
     * 漸入/出 BGM
     * @param fadein 是否漸入BGM(預設為true)
     * @param fadeyime 執行時間
     */
    fadeBGM(fadein = true, fadeyime) {
        let interval = 0.05;
        let segment = fadeyime / interval;
        let tic = 1.0 / segment;
        this.fadeVolume = fadein ? 0 : 1.0;

        this.unscheduleAllCallbacks();
        this.schedule(() => {
            if (this.bgmAudioID > -1) {
                this.fadeVolume = this.fadeVolume + (fadein ? tic : -tic);
                cc.audioEngine.setVolume(this.bgmAudioID, this.bgmVolume * this.fadeVolume * this.bgmMaxVolume);

                if (this.bgmVolume * this.fadeVolume * this.bgmMaxVolume <= 0)
                    this.bgmVolume = 0;
            }
        }, interval, segment);
    }

    /**
     * 設置音效音量
     * @param ison 是否開啟
     */
    setEffectVolume(ison) {
        this.effectVolume = ison ? 1.0 : 0;
        cc.sys.localStorage.setItem("effectVolume", this.effectVolume);
    }

    /**
     * 設置BGM音量
     * @param ison 是否開啟
     */
    setBGMVolume(ison) {
        cc.sys.localStorage.setItem("bgmVolume", ison ? 1.0 : 0);

        if (ison && this.bgmVolume === 0)
            this.bgmVolume = 1.0;

        if (this.bgmAudioID >= 0)
            this.fadeBGM(ison, 0.35);
    }

    /**
     * 暫停播放全部BGM/音效
     */
    pauseAll() {
        cc.audioEngine.pauseAll();
    }

    /**
     * 回復播放全部BGM/音效
     */
    resumeAll() {
        cc.audioEngine.resumeAll();
    }
}
