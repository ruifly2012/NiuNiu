import AnimationBase from "./AnimationBase";

const { ccclass, property, requireComponent } = cc._decorator;

/**
 * 內建動畫系統
 */
@ccclass
@requireComponent(cc.Animation)
export default class OriginalAnimation extends AnimationBase {

    @property(cc.String)
    clip_name: string = "";

    @property(cc.Animation)
    animator: cc.Animation = null;

    onLoad() {
        super.onLoad();
        this.animator = this.getComponent(cc.Animation);
    }

    play(speed: number = 1.0, loop: boolean = false, onfinished?) {
        let m_state = this.animator.getAnimationState(this.clip_name);
        m_state.speed = speed;
        if (loop) {
            m_state.wrapMode = cc.WrapMode.Loop;
            m_state.repeatCount = Infinity;
        }

        this.animator.play(this.clip_name);

        if(this.onFinish != undefined){
            this.animator.off("finished", this.onFinish);
            this.onFinish = null;
        }

        if (onfinished != undefined) {
            this.onFinish = onfinished;
            this.animator.on("finished", this.onFinish);
        }
    }

    pause() {
        this.animator.pause(this.clip_name);
    }

    stop() {
        if(this.onFinish != undefined){
            this.animator.off("finished", this.onFinish);
            this.onFinish = null;
        }

        this.animator.stop();
    }

    resume() {
        this.animator.resume(this.clip_name);
    }
}
