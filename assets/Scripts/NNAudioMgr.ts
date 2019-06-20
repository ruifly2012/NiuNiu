import Game from "./Game";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NNAudioMgr extends cc.Component {

    private playEffect(type: string, index?: number) {
        let voiceName: string = "effect_" + type;

        if (index != undefined) {
            voiceName += "_" + index.toString();
        }

        Game.Inst.audioMgr.playEffect(voiceName);
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

    playVictory() {
        this.playEffect("victory");
    }

    playStartGame() {
        this.playEffect("startGame");
    }

    playCardTypeAnim(animName: string) {
        this.playEffect(animName);
    }

    playCardError(){
        this.playEffect("cardError");
    }

    playDistribute(){
        //delay to match anime
        this.scheduleOnce(()=>this.playEffect("distribute"),0.5);
    }

    playGetMoney(){
        this.playEffect("profit");
    }

    playBanker(){
        this.playEffect("banker");
    }

    playCardTypeTalk(index: number, gender: string = "male"){
        this.playVoice("type", gender, index);
    }

    playAllKill(gender: string = "male"){
        this.playVoice("type", gender, 15);
    }

    /**
     * 搶莊動畫音效
     * @param index 高/低音階決定
     */
    playRobBet(index: number){
        this.playEffect("rob"+index%2);
    }

    ////////


    playEffectSpecialCardMain(index?: number) {
        this.playEffect("SP", index);
    }

    playVoiceDealCard() {
        this.playVoice("DC");
    }

    playVoiceGunShot(gender: string = "male") {
        this.playVoice("GS", gender);
    }

}
