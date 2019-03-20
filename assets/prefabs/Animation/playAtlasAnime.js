var frames = [];
var frameNum = 12;  //how many frames

cc.Class({
    extends: cc.Component,
    properties: {
    },

    playAnime ( fromX,fromY,toX, toY , interval = 2 , speed = 1) {
        var self = this;
        var animation = self.node.getComponent(cc.Animation);
        //set clip
        var clip = cc.AnimationClip.createWithSpriteFrames(frames, frameNum);
        clip.name = "anim_run";
        clip.wrapMode = cc.WrapMode.Loop;
        //set start position
        var action = cc.place(fromX, fromY);
        self.node.runAction(action);
        //play anime
        animation.addClip(clip);
        var animeState = animation.play('anim_run');
        animeState.speed = speed;
        animeState.wrapMode = cc.WrapMode.Loop;
        animeState.repeatCount = 1; //repeat times
        //set action
        action = cc.sequence(cc.show(),cc.moveTo(interval,toX,toY),cc.hide());  //hide when move complete
        self.node.runAction(action);
    },


    onLoad(){
        var self = this;
        //add component
        self.node.addComponent(cc.Sprite);
        self.node.addComponent(cc.Animation);
        //set spriteframe

        for(let i = 0;i < frameNum;i++){
            let temp = i;
            if(i < 10) temp = "0" + i;
            let url = "Animations/moneyflow/coin1/coin1_0" + temp;  //frame url
            cc.loader.loadRes(url, function (err, tex) {
                frames.push(new cc.SpriteFrame(tex));
            })
        } 
    },

});

