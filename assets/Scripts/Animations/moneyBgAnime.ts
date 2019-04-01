const {ccclass, property} = cc._decorator;
@ccclass
export default class moneyBgAnime extends cc.Component {


    private frames:[cc.SpriteFrame] = [new cc.SpriteFrame];
    private speed: number = 1;  //anime speed

    onLoad(){
        let self = this;
        //add component
        self.node.addComponent(cc.Sprite);
        self.node.addComponent(cc.Animation);
        //set spriteframe
        for(let i: number = 0;i < 16;i++){
            self.frames.pop();
            let temp: string = String(i);
            if(i < 10) temp = "0" + i;
            let url = "Animations/moneyflow/effect_0" + temp;
            cc.loader.loadRes(url, function (err, tex) {
                self.frames.push(new cc.SpriteFrame(tex));
            })
        }
    }

    playBgAnime ( seatX: number, seatY: number ) {
        let self = this;
        let animation: cc.Animation = self.node.getComponent(cc.Animation);
        if( !self.node.getComponent(cc.Animation) ) cc.log("get anime fail");
        //set clip
        let clip: cc.AnimationClip = cc.AnimationClip.createWithSpriteFrames(self.frames, 16);
        clip.name = "anim_run";
        clip.wrapMode = cc.WrapMode.Loop;
        //set position
        self.node.runAction(cc.place(seatX-14 , seatY -5));
        //set show time
        let action: cc.Action = cc.sequence( cc.delayTime(0.5) , cc.show(),cc.delayTime(0.4),cc.hide());
        self.node.runAction(action);
        //play anime
        //if(!animation) cc.log("moneyBG anime component null, self = " + self + ", self.node = " + self.node);
        animation.addClip(clip);
        let animeState: cc.AnimationState = animation.play('anim_run');
        animeState.speed = self.speed;
        animeState.wrapMode = cc.WrapMode.Loop;
        animeState.repeatCount = 5;
    }

    moneyShine(toSeat){
        let self = this;
        toSeat = parseInt(toSeat);
        let pos = [{//prepre
            x : -419,
            y: 331
        },
        {//pre
            x : -811,
            y: 53
        },
        {//me
            x : -515,
            y: -328
        },
        {//next
            x : 811,
            y: 51
        },
        {//nextnext
            x : 417,
            y: 336
        }]
        //cc.log("to " + pos[toSeat].x + "," + pos[toSeat].y);
        
        //cc.log("play BG Anime : " + toSeat);
        self.playBgAnime( pos[toSeat].x,pos[toSeat].y );
    }


}

