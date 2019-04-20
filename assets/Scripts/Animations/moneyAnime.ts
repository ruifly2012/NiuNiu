const {ccclass, property} = cc._decorator;
@ccclass
export default class moneyAnime extends cc.Component {

    private frames:[cc.SpriteFrame] = [new cc.SpriteFrame];
    private curvePos:cc.Vec2[];
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

        let startPos: cc.Vec2 = cc.v2(fromX + xOffset, fromY + yOffset);
        let endPos: cc.Vec2 = cc.v2(toX+ yOffset/3, toY+ xOffset/3);
        
        //set clip
        let clip = cc.AnimationClip.createWithSpriteFrames(self.frames, 17);
        clip.name = "anim_run";
        clip.wrapMode = cc.WrapMode.Loop;
        //set start position
        let action = cc.place(startPos);
        self.node.runAction(action);
        //play anime
        animation.addClip(clip);
        let animeState = animation.play('anim_run');
        animeState.speed = speed;
        animeState.wrapMode = cc.WrapMode.Loop;
        animeState.repeatCount = 5;
        //set action


        let midPoint:cc.Vec2;
        if(startPos.y > endPos.y){
            midPoint = cc.v2(endPos.x*(1.2) + startPos.x*(-0.2), startPos.y*(1.5) + endPos.y*-0.5);
        }
        else{
            midPoint = cc.v2(endPos.x*(1.2) + startPos.x*(-0.2), endPos.y*(1.5) + startPos.y*-0.5);
        }
        
        let path = [startPos,midPoint,endPos];
        action = cc.sequence(
            cc.show(),
            //x,y sametime
            /*
            cc.spawn(
                //x y use seperate func
                cc.moveBy(interval , (toX+ yOffset/3) - (fromX + xOffset) , 0).easing(cc.easeQuadraticActionOut()),
                cc.moveBy(interval , 0 , (toY+ xOffset/3) - (fromY + yOffset)).easing(cc.easeSineIn()),
            ),
            */
            cc.bezierTo(interval, path),
            cc.hide()
        )
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

