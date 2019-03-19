import AnimationBase from "./AnimationBase";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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
