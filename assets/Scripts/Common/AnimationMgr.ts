import AnimationBase from "../Animations/AnimationBase";

export default class AnimationMgr{

    private _animation_list: any[] = [];  

    registerAnimationClip (_name:string, _clip: AnimationBase) 
    {
        let check = this._animation_list.find((x) => x.name == _name);
        
        if(check){    
            console.log('Bind Animation Error!!');
            return;
        }

        let obj = {clip:_clip, name:_name};
        this._animation_list.push(obj);
    }

    removeAnimationClip (_clipname:string) 
    {
        this._animation_list = this._animation_list.filter( (x)=> {
        
            return !(x.name==_clipname);
        });
    }    

    clear()
    {    
        this._animation_list = [];
    }

    play(_ani:string, _speed: number = 1.0, _loop: boolean = false) 
    {
        this._animation_list.find((x)=>x.anme == _ani).play(_speed, _loop);
    }

    pause(_ani:string) 
    {
        this._animation_list.find((x)=>x.anme == _ani).pause();
    }

    stop(_ani:string) 
    {
        this._animation_list.find((x)=>x.anme == _ani).stop();
    }

    resume(_ani:string) 
    {
        this._animation_list.find((x)=>x.anme == _ani).resume();
    }
    
}
