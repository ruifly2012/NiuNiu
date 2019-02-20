
var animation = ["gameStart", "hasniu", "niuniu", "silvercow", "goldcow", "fivecows","bomb", "allkill",
      "victory", "kingicon"];

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
            fivecows: null,
            bomb: null,
            Victory: null
        };

    },

    properties: {


    },

    init() {
        this.animation = {
            gameStart: cc.find("gameStart", this.node),
            AllKill: cc.find("allkill", this.node),
            hasniu: null,
            niuniu: cc.find("niuniu", this.node),
            silvercow: cc.find("silvercow", this.node),
            goldcow: cc.find("goldcow", this.node),
            fivecows: cc.find("fivecows", this.node),
            bomb: cc.find("bomb", this.node),
            Victory: cc.find("victory", this.node),
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
