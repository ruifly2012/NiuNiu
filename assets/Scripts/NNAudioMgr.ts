import Game from "./Game";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NNAudioMgr extends cc.Component {

    private playEffect(index: string, type: string = "g03", ) {
        let voiceName: string = "sound_" + type;

        if (index != undefined) {
            voiceName += "_" + index;
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
            let indexStr : string = "0";
            if(index < 10) indexStr += "0";
            indexStr += index.toString();
            voiceName += indexStr;
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
        this.playEffect("008");
    }

    playStartGame() {
        this.playEffect("001");
    }

    playCardTypeAnim(animName: string) {
        this.playEffect(animName);
    }
    playCardError(){
        this.playEffect("006");
    }

    playDistribute(){
        //delay to match anime
        this.scheduleOnce(()=>this.playEffect("005"),0.5);
    }

    playGetMoney(){
        this.playEffect("007");
    }

    playBanker(){
        this.playEffect("banker");
    }

    playCardTypeTalk(index: number, gender: string = "male"){
        this.playVoice("g03", gender, index);
    }

    playAllKill(gender: string = "male"){
        this.playEffect("009");
        //delay to match anime
        this.scheduleOnce(()=>this.playVoice("g03", gender, 15),0.5);
    }

    /**
     * 搶莊動畫音效
     * @param index 高/低音階決定
     */
    playRobBet(index: number){
        if(index%2 == 0)
            this.playEffect("002");
        else 
            this.playEffect("003");
    }

}
