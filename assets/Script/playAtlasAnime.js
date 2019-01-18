var frames = [];

cc.Class({
    extends: cc.Component,
    
    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    playAnime () {
        var self = this;
        var animation = this.node.getComponent(cc.Animation);
        var clip = cc.AnimationClip.createWithSpriteFrames(frames, 17);
        clip.name = "anim_run";
        clip.wrapMode = cc.WrapMode.Loop;
        animation.addClip(clip);
        animation.play('anim_run');
        var action = cc.moveTo(2,-378,-276);
        self.node.runAction(action);
    },

    onLoad(){
        //
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

    },

    // update (dt) {},
});

