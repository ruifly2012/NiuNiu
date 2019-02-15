var frames = [];

cc.Class({
    extends: cc.Component,
    
    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    playMoneyAnime ( fromX,fromY,toX, toY , xOffset, yOffset, interval = 2 , speed = 1) {
        var self = this;
        var animation = self.node.getComponent(cc.Animation);

        //set clip
        var clip = cc.AnimationClip.createWithSpriteFrames(frames, 17);
        clip.name = "anim_run";
        clip.wrapMode = cc.WrapMode.Loop;
        //set start position
        var action = cc.place(fromX + xOffset , fromY + yOffset);
        self.node.runAction(action);
        //play anime
        animation.addClip(clip);
        var animeState = animation.play('anim_run');
        animeState.speed = speed;
        animeState.wrapMode = cc.WrapMode.Loop;
        animeState.repeatCount = 5;
        //set action
        action = cc.sequence(cc.show(),cc.moveTo(interval , toX+ yOffset/3 , toY+ xOffset/3),cc.hide());//change x y to mess the route
        self.node.runAction(action);
    },

    moneyFlow(fromSeat,toSeat,xOffset = 0,yOffset = 0, speedAndIntervalVal){
        var self = this;

        let from = parseInt(fromSeat);
        let to = parseInt(toSeat);
        //cc.log("from "+fromSeat+" to "+toSeat);
        //cc.log("from "+from+" to "+to);
        var pos = [{//prepre
            x : -405,
            y: 336
        },
        {//pre
            x : -759,
            y: -6
        },
        {//me
            x : -378,
            y: -276
        },
        {//next
            x : 781,
            y: 57
        },
        {//nextnext
            x : 402,
            y: 336
        }]
        //cc.log("from seat " + from +"pos "+ pos[from].x + xOffset + "," + pos[from].y + yOffset);
        //cc.log("to seat " + to +"pos" + pos[to].x + "," + pos[to].y);
        self.playMoneyAnime(pos[from].x,pos[from].y,pos[to].x,pos[to].y , xOffset , yOffset , speedAndIntervalVal*0.01 + 0.5, 1.5+0.5*speedAndIntervalVal);
    },

    onLoad(){
        var self = this;
        //add component
        self.node.addComponent(cc.Sprite);
        self.node.addComponent(cc.Animation);
        //set spriteframe
        for(let i = 0;i < 12;i++){
            let temp = i;
            if(i < 10) temp = "0" + i;
            let url = "Animations/moneyflow/coin1/coin1_0" + temp;
            cc.loader.loadRes(url, function (err, tex) {
                frames.push(new cc.SpriteFrame(tex));
            })
        } 
    },
});

