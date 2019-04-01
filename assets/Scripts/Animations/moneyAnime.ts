const {ccclass, property} = cc._decorator;
@ccclass
export default class moneyAnime extends cc.Component {

    private frames:[cc.SpriteFrame] = [new cc.SpriteFrame];

    onLoad(){
        let self = this;
        //add component
        self.node.addComponent(cc.Sprite);
        self.node.addComponent(cc.Animation);
        //set spriteframe
        for(let i = 0;i < 12;i++){
            let temp:string = String(i);
            self.frames.pop();
            if(i < 10) temp = "0" + i;
            let url = "Animations/moneyflow/coin1/coin1_0" + temp;
            cc.loader.loadRes(url, function (err, tex) {
                self.frames.push(new cc.SpriteFrame(tex));
            })
        } 
    }


    playMoneyAnime ( fromX: number,fromY: number,toX: number, toY : number , xOffset : number, yOffset : number, interval : number = 2 , speed : number = 1) {
        let self = this;
        let animation = self.node.getComponent(cc.Animation);

        //set clip
        let clip = cc.AnimationClip.createWithSpriteFrames(self.frames, 17);
        clip.name = "anim_run";
        clip.wrapMode = cc.WrapMode.Loop;
        //set start position
        let action = cc.place(fromX + xOffset , fromY + yOffset);
        self.node.runAction(action);
        //play anime
        animation.addClip(clip);
        let animeState = animation.play('anim_run');
        animeState.speed = speed;
        animeState.wrapMode = cc.WrapMode.Loop;
        animeState.repeatCount = 5;
        //set action
        action = cc.sequence(cc.show(),cc.moveTo(interval , toX+ yOffset/3 , toY+ xOffset/3),cc.hide());//change x y to mess the route
        self.node.runAction(action);
    }

    moneyFlow(from:number,to:number,xOffset:number = 0,yOffset:number = 0, speedAndIntervalVal : number){
        let self = this;

        //cc.log("from "+fromSeat+" to "+toSeat);
        //cc.log("from "+from+" to "+to);
        let pos: {x: number, y: number}[] = [
            { x : -418, y: 331},//prepre
            { x : -811, y: 53}, //pre
            { x : -515, y: -324},//me
            { x : 804, y: 44},//next
            { x : 402, y: 336}//nextnext
        ]
        //cc.log("from seat " + from +"pos "+ pos[from].x + xOffset + "," + pos[from].y + yOffset);
        //cc.log("to seat " + to +"pos" + pos[to].x + "," + pos[to].y);
        self.playMoneyAnime(pos[from].x,pos[from].y,pos[to].x,pos[to].y , xOffset , yOffset , speedAndIntervalVal*0.01 + 0.5, 1.5+0.5*speedAndIntervalVal);
    }

    
}

