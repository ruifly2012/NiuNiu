import AnimationBase from "./AnimationBase";

const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(sp.Skeleton)
export default class SplineAnimation extends AnimationBase {

    @property
    clip_name: string = "";
    @property(sp.Skeleton)
    animator: sp.Skeleton = null;
   
    onLoad () 
    {         
        super.onLoad();
        this.animator = this.getComponent(sp.Skeleton);        
    }

    start () {

    }

    play(_speed: number=1.0, _loop: boolean = false) 
    {
        
    }

    pause() 
    {
       
    }

    stop() 
    {
        
    }

    resume()
    {

    }
}
