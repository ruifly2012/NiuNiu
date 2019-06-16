import Game from "./Game";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NNAudioMgr extends cc.Component {

    private playEffect(type: string, index?: number) {
        let voiceName: string = "effect_" + type;

        if (index != undefined) {
            voiceName += "_" + index.toString();
        }

        Game.Inst.audioMgr.playVoice(voiceName);
    }

    private playVoice(type: string, gender?: string, index?: number) {
        let voiceName: string = "voice_" + type;
        if (gender != undefined) {
            if (gender == "male")
                voiceName += "_b";
            else
                voiceName += "_g";
        }

        if (index != undefined) {
            voiceName += index.toString();
        }

        Game.Inst.audioMgr.playVoice(voiceName);
    }

    playBGM() {
        Game.Inst.audioMgr.playBGM("BGM");
    }

    stopBGM() {
        Game.Inst.audioMgr.stopBGM();
    }

    playEffectStartGame() {
        this.playEffect("SG");
    }

    playEffectDistributeCard() {
        this.playEffect("DC");
    }

    playEffectOpenCard() {
        this.playEffect("OC");
    }

    playEffectGunShot() {
        this.playEffect("GS");
    }

    playEffectHomeRun() {
        this.playEffect("HR");
    }

    playEffectSpecialCardMain(index?: number) {
        this.playEffect("SP", index);
    }

    playVoiceDealCard() {
        this.playVoice("DC");
    }

    playVoiceGunShot(gender: string = "male") {
        this.playVoice("GS", gender);
    }

    playVoiceHomeRun(gender: string = "male") {
        this.playVoice("HR", gender);
    }

    playVoiceSpecialCard(gender: string = "male", index?: number) {
        this.playVoice("SP", gender, index);
    }
}
