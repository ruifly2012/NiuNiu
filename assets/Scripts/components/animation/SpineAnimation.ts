import AnimationBase from "./AnimationBase";

const { ccclass, property, requireComponent } = cc._decorator;

/**
 * Spine動畫
 */
@ccclass
@requireComponent(sp.Skeleton)
export default class SpineAnimation extends AnimationBase {

    @property(cc.String)
    clip_name: string = "";

    @property(sp.Skeleton)
    animator: sp.Skeleton = null;

    onLoad() {
        super.onLoad();
        this.animator = this.getComponent(sp.Skeleton);
        this.node.opacity = 0;
    }

    play(speed: number = 1.0, loop: boolean = false, onfinished?) {
        this.node.opacity = 255;
        this.animator.timeScale = speed;
        this.animator.setAnimation(0, this.clip_name, loop);
        if (loop != true)
            this.animator.setCompleteListener(()=>{
                this.node.opacity = 0;
                if (onfinished != undefined)
                    onfinished();
            });
    }

    pause() {

    }

    stop() {
        this.animator.clearTrack(0);
        this.node.opacity = 0;
    }

    resume() {

    }
}
