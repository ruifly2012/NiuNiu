import Game from "../Game";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Clock extends cc.Component {
    @property(cc.Node) bg: cc.Node = null;
    @property(cc.Label) text: cc.Label = null;
    @property(Number) shakeTic: number = 0.05;
    @property(Number) shakeAngle: number = 7;

    isActive: boolean = false;
    countDown: number = 0;
    timer?;
    onFinished?;

    onLoad() {
        this.init();
    }

    init(){
        this.bg.stopAllActions();
        this.bg.rotation = 0;
        this.countDown = 0;
        this.text.string = "";
        this.onFinished = null;
        this.timer = null;
        this.isActive = false;
        this.node.opacity = 0;
    }

    startCountDown(times: number, callback?) {
        if (this.isActive) return;
        this.init();
        this.node.opacity = 255;
        cc.warn("clock start");
        
        this.isActive = true;
        this.countDown = times;
        this.setClockTime();
        this.onFinished = callback;

        this.timer = function () {
            this.countDown--;
            if (this.countDown <= 0) {
                if (this.onFinished != undefined) {
                    cc.log("clock Callback");
                    this.onFinished();
                }

                this.unschedule(this.timer);
                this.init();
            }
            else {
                this.setClockTime();
            }
        }.bind(this);

        this.schedule(this.timer, 1);
    }

    stopCountDown() {
        if (this.isActive) {
            if(this.timer != undefined)
                this.unschedule(this.timer);
            this.init();
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
        }
    }
}
