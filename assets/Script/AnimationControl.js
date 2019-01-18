
var animation = ["gameStart", "AllKill", "hasniu", "niuniu", "silvercow", "goldcow",
    "5cows", "bomb", "Victory"];

var status = ["farmerDouble", "dizhuDouble", "autoPlaying", "choseCards",
    "nolegalCard", "illegal"];

cc.Class({
    extends: cc.Component,

    ctor: function () {

        this.animation = {
            gameStart: null,
            AllKill: null,
            hasniu: null,
            niuniu: null,
            silvercow: null,
            goldcow: null,
            cows: null,
            bomb: null,
            Victory: null
        };

    },

    properties: {


    },

    init() {
        this.animation = {
            gameStart: cc.find("gameStart", this.node),
            AllKill: cc.find("AllKill", this.node),
            hasniu: null,
            niuniu: cc.find("niuniu", this.node),
            silvercow: cc.find("silvercow", this.node),
            goldcow: cc.find("goldcow", this.node),
            cows: cc.find("5cow", this.node),
            bomb: null,
            Victory: cc.find("Victory", this.node),
        };
    },

    onLoad() {
        this.init();

        var self = this;

        global.socket.on("Animation", function (animationName) {
            global.EventListener.fire("Animation", animationName);
        });

        global.EventListener.on("Animation", function (animationName) {

            var index = animation.indexOf(animationName);
            cc.log("trigger anime : " + animationName);
            self.play(index);
        });

    },

    play(AnimationIndex) {
        cc.log("playing animation at aniCtrler");
        if (AnimationIndex < 0) return;
        //this.node.getChildByName(AnimationIndex).getComponent(cc.Animation).play();
        this.node.getChildren()[AnimationIndex].active = true;
        this.node.getChildren()[AnimationIndex].getComponent(cc.Animation).play();

        //this.node.getChildren()[AnimationIndex].position = this.position[locate].position;
    }

});
