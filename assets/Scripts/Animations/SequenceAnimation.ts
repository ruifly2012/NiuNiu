import AnimationBase from "./AnimationBase";

const {ccclass, property,requireComponent} = cc._decorator;

@ccclass
@requireComponent(cc.Animation)
export default class SequenceAnimation extends AnimationBase {

    @property
    clip_name: string = "";
    
    @property(cc.Animation)
    animator: cc.Animation = null

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {         
        super.onLoad();
        this.animator = this.getComponent(cc.Animation);        
    }

    // update (dt) {}

    play(_speed: number=1.0, _loop: boolean = false) 
    {
        let m_state = this.animator.getAnimationState(this.clip_name);
        m_state.speed = _speed;
        if(_loop) {
            m_state.wrapMode = cc.WrapMode.Loop;
            m_state.repeatCount = Infinity;
        }
        
        this.animator.play(this.clip_name);
    }

    pause() 
    {
        this.animator.pause();
    }

    stop() 
    {
        this.animator.stop();
    }

    resume()
    {
        this.animator.resume(this.clip_name);
    }
}
