var frames = [];

cc.Class({
    extends: cc.Component,
    
    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    playAnime ( fromX,fromY,toX, toY , xOffset, yOffset, interval = 2 , speed = 1) {
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
        action = cc.sequence(cc.show(),cc.moveTo(interval,toX,toY),cc.hide());
        self.node.runAction(action);
        cc.log("playAnime speed" + speed);
    },

    moneyFlow(fromSeat = 3,toSeat = 0,xOffset = 0,yOffset = 0, speedAndIntervalVal){
        var self = this;
        fromSeat = parseInt(fromSeat);
        toSeat = parseInt(toSeat);
        fromSeat = 3;
        toSeat = 4;
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
        cc.log("from " + pos[fromSeat].x + xOffset + "," + pos[fromSeat].y + yOffset);
        cc.log("to " + pos[toSeat].x + "," + pos[toSeat].y);
        self.playAnime(pos[fromSeat].x,pos[fromSeat].y,pos[toSeat].x,pos[toSeat].y , xOffset , yOffset , speedAndIntervalVal*0.01 + 0.5, 1.5+0.5*speedAndIntervalVal);
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

    start () {
        //copy
        /*
        var self = this;
        var cpy = new cc.Node('Sprite');
        cpy = cc.instantiate(self.node);
        cpy.parent = self.node;
        cpy.setPosition(0, 0);
        cpys.push(cpy.getComponent("playAtlasAnime"));
        */
    },

    // update (dt) {},
});

