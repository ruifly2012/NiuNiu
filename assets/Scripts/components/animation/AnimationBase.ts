import Game from "../../Game";


const {ccclass, property} = cc._decorator;

/**
 * 動畫物件基底
 */
@ccclass
export default abstract class AnimationBase extends cc.Component {

    /**動畫名稱 */
    @property(cc.String) animName: string = "";
    /**播放結束Callback */
    onFinish?;

    onLoad () {
        if(this.animName == "") {
            cc.error("Animation Name not Setup");
            return;
        }
        Game.Inst.animationMgr.registAnimationClip(this.animName,this);
    }

    onDestroy() {       
        Game.Inst.animationMgr.unregistAnimationClip(this.animName);
    }
    
    /**
     * 播放動畫
     * @param speed 播放速度(預設為1.0)
     * @param loop 重複播放(預設為false)
     * @param onfinished 播放結束後callback
     */
    abstract play(speed: number, loop: boolean,onfinished?);
    /**
     * 暫停當前動畫
     */
    abstract pause();
    /**
     * 停止當前動畫
     */
    abstract stop();
    /**
     * 回復播放當前動畫
     */
    abstract resume();
}
