var frames = [];
var speed = 1;  //anime speed
//var self;

cc.Class({
    extends: cc.Component,
    
    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    playBgAnime ( seatX, seatY ) {
        var self = this;
        var animation = self.node.getComponent(cc.Animation);
        if( !self.node.getComponent(cc.Animation) ) cc.log("get anime fail");
        //set clip
        var clip = cc.AnimationClip.createWithSpriteFrames(frames, 16);
        clip.name = "anim_run";
        clip.wrapMode = cc.WrapMode.Loop;
        //set position
        self.node.runAction(cc.place(seatX , seatY));
        //play anime
        if(!animation) cc.log("moneyBG anime component null, self = " + self + ", self.node = " + self.node);
        animation.addClip(clip);
        var animeState = animation.play('anim_run');
        animeState.speed = speed;
        animeState.wrapMode = cc.WrapMode.Loop;
        animeState.repeatCount = 20;
        //set action
        var action = cc.sequence( cc.delayTime(1.5), cc.show(),cc.delayTime(1.0),cc.hide());
        self.node.runAction(action);
        cc.log("play BG Anime ing" );
    },

    moneyShine(toSeat = 3){
        var self = this;
        toSeat = parseInt(toSeat);
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
        }];
        cc.log("to " + pos[toSeat].x + "," + pos[toSeat].y);
        
        cc.log("play BG Anime : " + toSeat);
        self.playBgAnime( pos[toSeat].x,pos[toSeat].y );
    },

    onLoad(){
        var self = this;
        //add component
        cc.log("load bg anime");
        self.node.addComponent(cc.Sprite);
        self.node.addComponent(cc.Animation);

        if( !self.node.getComponent(cc.Animation) ) cc.log("new anime fail");
        else cc.log("new anime success");
        //set spriteframe

        for(let i = 0;i < 16;i++){
            let temp = i;
            if(i < 10) temp = "0" + i;
            let url = "Animations/moneyflow/effect_0" + temp;
            cc.loader.loadRes(url, function (err, tex) {
                frames.push(new cc.SpriteFrame(tex));
            })
        }
    },

    start(){

    }
});

