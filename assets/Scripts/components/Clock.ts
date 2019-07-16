import Game from "../Game";
import UIMgr from "../UIMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Clock extends cc.Component {
    @property(cc.Node) bg: cc.Node = null;
    @property(cc.Label) text: cc.Label = null;
    @property(Number) shakeTic: number = 0.05;
    @property(Number) shakeAngle: number = 7;

    isActive: boolean = false;
    /**�O�_�R�� */
    isMute: boolean = false;
    /**�O�_�Ұʭ˼ƭ��� */
    isNoisy: boolean = false;
    countDown: number = 0;
    private noisyAudioID: number = -1;
    timer?;
    onFinished?;

    onLoad() {
        this.init();
    }

    init(){
        cc.log("[clock] clock init");
        this.stopCountDown();
        this.bg.stopAllActions();
        this.bg.rotation = 0;
        this.countDown = 0;
        this.text.string = "";
        this.onFinished = null;
        this.timer = null;
        this.isActive = false;
        this.node.opacity = 0;
	//init audio
	Game.Inst.audioMgr.stopEffect(this.noisyAudioID);
        this.noisyAudioID = -1;
        this.isMute = false;
        this.isNoisy = false;
    }

    startCountDown(times: number, callback?) {
        if (this.isActive) return;
        this.init();
        this.node.opacity = 255;
        this.isActive = true;
        this.countDown = times;
        this.setClockTime();
        this.onFinished = callback;
        this.timer = function () {
            this.countDown--;
            if (this.countDown <= 0) {
                ////////////////clock issue//////
                if (this.onFinished != undefined) {
                    this.unschedule(this.timer);
                    this.onFinished();
                }
                else{
                    this.unschedule(this.timer);
                    this.init();
                }
            }
            else {
                // Game.Inst.networkMgr.get_time();
                this.setClockTime();
            }
        }.bind(this);

        this.schedule(this.timer, 1);
    }

    stopCountDown() {
        if (this.isActive) {
            if(this.timer != undefined)
                this.unschedule(this.timer);
        }
    }

    setClockTime() {
        this.text.string = this.countDown.toString();

        if (this.countDown == 5) {
            this.bg.stopAllActions();
            let action = cc.repeatForever(
                cc.sequence(
                    cc.rotateTo(this.shakeTic, this.shakeAngle),
                    cc.rotateTo(this.shakeTic, -this.shakeAngle),
                    cc.rotateTo(this.shakeTic, -this.shakeAngle),
                    cc.rotateTo(this.shakeTic, this.shakeAngle),//.easing(cc.easeSineIn()),
                ),
            );
            this.bg.runAction(action);
	    this.setNoisy();
        }
    }

    private setNoisy() {
        if (!this.isNoisy) {
            if (!this.isMute) {
                Game.Inst.audioMgr.playEffect("effect_CS", true, 1, (audioid) => {
                    this.noisyAudioID = audioid;
                });
            }
            this.isNoisy = true;
        }
    }
}
