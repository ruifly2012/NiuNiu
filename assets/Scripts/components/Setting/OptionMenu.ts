import MenuBase from "./MenuBase";
import Game from "../../Game";
import AudioMgr from "../../AudioMgr";

const { ccclass, property } = cc._decorator;

export enum OptionMenuType {
    Music = 0,
    Sound,
    Voice
}

@ccclass
export default class OptionMenu extends MenuBase {
    @property([cc.Node]) muteButton: cc.Node[] = [];
    @property([cc.Slider]) volumnSlider: cc.Slider[] = [];
    @property([cc.Button]) volumnSliderButton: cc.Button[] = [];
    @property([cc.Label]) volumnLabel: cc.Label[] = [];
    @property([cc.Sprite]) volumnBar: cc.Sprite[] = [];
    @property(cc.Node) volumnBarBack: cc.Node = null;
    muteButtonObj: cc.Button[] = [];
    muteButtonSprite: cc.Sprite[] = [];
    barWidth: number = 0;

    flagIsInit: boolean = false;
    flagIsMute: boolean[] = [];

    open() {
        this.init();
        this.node.active = true;
    }

    close() {
        this.node.active = false;
    }

    init() {
        if (!this.flagIsInit) {
            for (let i = 0; i < this.muteButton.length; i++) {
                this.muteButtonObj.push(this.muteButton[i].getComponent(cc.Button));
                this.muteButtonSprite.push(this.muteButton[i].getComponent(cc.Sprite));
                this.flagIsMute.push(false);
            }
            this.barWidth = this.volumnBarBack.width;
            this.flagIsInit = true;
        }

        let audio: AudioMgr = Game.Inst.audioMgr;
        for (let i = 0; i < this.volumnBar.length; i++) {
            let holdVolume: number, nowVolume: number;
            switch (i) {
                case OptionMenuType.Music:
                    holdVolume = audio.holdBgmVolume;
                    nowVolume = audio.bgmVolume;
                    break;
                case OptionMenuType.Sound:
                    holdVolume = audio.holdEffectVolume;
                    nowVolume = audio.effectVolume;
                    break;
                case OptionMenuType.Voice:
                    holdVolume = audio.holdVoiceVolume;
                    nowVolume = audio.voiceVolume;
                    break;
            }
            this.volumnSlider[i].progress = holdVolume;
            this.volumnBar[i].node.width = this.volumnSlider[i].progress * this.barWidth;
            this.volumnLabel[i].string = Math.floor(this.volumnSlider[i].progress * 100).toString() + "%";
            if (holdVolume != nowVolume) {
                this.disableButtonClickSprite(this.muteButtonObj[i]);
                this.volumnSlider[i].enabled = false;
                this.volumnSliderButton[i].interactable = false;
                this.volumnBar[i].spriteFrame = Game.Inst.resourcesMgr.load("panel_Off");
                this.flagIsMute[i] = true;
            }
            else {
                if (nowVolume == 0) {
                    this.disableButtonClickSprite(this.muteButtonObj[i]);
                    this.volumnSlider[i].enabled = true;
                    this.volumnSliderButton[i].interactable = true;
                    this.flagIsMute[i] = true;
                }
                else{
                    this.enableButtonClickSprite(this.muteButtonObj[i]);
                    this.volumnSlider[i].enabled = true;
                    this.volumnSliderButton[i].interactable = true;
                    this.volumnBar[i].spriteFrame = Game.Inst.resourcesMgr.load("panel_" + OptionMenuType[i]);
                    this.flagIsMute[i] = false;
                }
            }
        }
    }

    Mute(event, customEventData) {
        let target = parseInt(customEventData);
        if (!this.flagIsMute[target]) {
            this.disableButtonClickSprite(this.muteButtonObj[target]);
            this.volumnSlider[target].enabled = false;
            this.volumnSliderButton[target].interactable = false;
            this.volumnBar[target].spriteFrame = Game.Inst.resourcesMgr.load("panel_Off");
            this.flagIsMute[target] = true;
            switch (target) {
                case OptionMenuType.Music:
                    Game.Inst.audioMgr.setBGMVolume(false);
                    break;
                case OptionMenuType.Sound:
                    Game.Inst.audioMgr.setEffectVolume(false);
                    break;
                case OptionMenuType.Voice:
                    Game.Inst.audioMgr.setVoiceVolume(false);
                    break;
            }
        }
        else if (this.flagIsMute[target] && this.volumnLabel[target].string != "0%") {
            this.enableButtonClickSprite(this.muteButtonObj[target]);
            this.volumnSlider[target].enabled = true;
            this.volumnSliderButton[target].interactable = true;
            this.volumnBar[target].spriteFrame = Game.Inst.resourcesMgr.load("panel_" + OptionMenuType[target]);
            this.flagIsMute[target] = false;
            switch (target) {
                case OptionMenuType.Music:
                    Game.Inst.audioMgr.setBGMVolume(true);
                    break;
                case OptionMenuType.Sound:
                    Game.Inst.audioMgr.setEffectVolume(true);
                    break;
                case OptionMenuType.Voice:
                    Game.Inst.audioMgr.setVoiceVolume(true);
                    break;
            }
        }

    }

    sliderMove(event: cc.Slider, customEventData) {
        let target = parseInt(customEventData);
        if (event.progress == 0) {
            this.disableButtonClickSprite(this.muteButtonObj[target]);
            this.flagIsMute[target] = true;
        }
        else {
            if (this.flagIsMute[target]) {
                this.enableButtonClickSprite(this.muteButtonObj[target]);
                this.flagIsMute[target] = false;
            }
        }
        this.volumnBar[target].node.width = event.progress * this.barWidth;
        this.volumnLabel[target].string = Math.floor(event.progress * 100).toString() + "%";
        switch (target) {
            case OptionMenuType.Music:
                Game.Inst.audioMgr.setBGMVolume(undefined, event.progress);
                break;
            case OptionMenuType.Sound:
                Game.Inst.audioMgr.setEffectVolume(undefined, event.progress);
                break;
            case OptionMenuType.Voice:
                Game.Inst.audioMgr.setVoiceVolume(undefined, event.progress);
                break;
        }
    }

    private enableButtonClickSprite(button: cc.Button) {
        button.normalSprite = Game.Inst.resourcesMgr.load("Btnmute_b");;
        button.pressedSprite = Game.Inst.resourcesMgr.load("Btnmute_c");;
    }

    private disableButtonClickSprite(button: cc.Button) {
        button.normalSprite = Game.Inst.resourcesMgr.load("Btnmute_a");;
        button.pressedSprite = null;
    }
}
