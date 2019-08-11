
const {ccclass, property} = cc._decorator;

@ccclass
export default class MarqueeAnimation extends cc.Component {
    private m_StartPosition: cc.Vec2 = null;
    private m_EndPosition: cc.Vec2 = null;
    private m_delayTime: number = 0;

    play(speed: number = 1.0, loop: boolean = false, onfinished?) {
        this.playMarquee(1/speed,()=>{ 
            if(onfinished != undefined)
                onfinished()
        });
    }

    pause() {
    }

    stop() {
    }

    resume() {
    }

    init(startPos: cc.Vec2, endPos: cc.Vec2, delay: number){
        this.m_StartPosition = startPos;
        this.m_EndPosition = endPos;
        this.m_delayTime = delay;
    }
    playMarquee(duration: number,callback?){
       
        this.node.stopAllActions();
        if(this.m_StartPosition != undefined){
            this.node.position = this.m_StartPosition;
        }
        //cc.log(this.node.width);
        let action = cc.sequence(
            cc.moveTo(duration,this.m_EndPosition.x ,this.m_EndPosition.y),
            cc.delayTime(this.m_delayTime),
            cc.callFunc(() => {
                if(callback != undefined){
                    callback();
                }
            })
        );
        this.node.runAction(action);
    }
}
