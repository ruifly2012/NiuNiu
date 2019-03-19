import Global from "../Common/Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default abstract class AnimationBase extends cc.Component {

    @property
    ani_name: string = "";

    onLoad () {
        if(this.ani_name == "") {
            cc.log('Animation Name not Setup');
            return;
        }
        Global.Instance.animation.registerAnimationClip( this.ani_name,this);
    }

    onDestroy() {       
        Global.Instance.animation.removeAnimationClip(this.ani_name);
    }

    
    abstract play(_speed: number, _loop: boolean);
    abstract pause();
    abstract stop();
    abstract resume();
}
