
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
        testButton: {
            default:null,
            type: cc.Node
        },

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

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

    },

    play(AnimationIndex) {
        cc.log("playing animation at aniCtrler");
        if (AnimationIndex < 0) return;
        //this.node.getChildByName(AnimationIndex).getComponent(cc.Animation).play();
        this.node.getChildren()[AnimationIndex].active = true;
        this.node.getChildren()[AnimationIndex].getComponent(cc.Animation).play();

        //this.node.getChildren()[AnimationIndex].position = this.position[locate].position;
    },

    onKeyDown: function (event) {
        var self = this;
        console.log('Press a key');
        switch(event.keyCode) {
            case cc.macro.KEY.z:
                console.log('Press "z" key  niuniu');
                self.play(2);
                break;
            case cc.macro.KEY.x:
                console.log('Press "x" key  silverniu');
                self.play(3);
                break;
            case cc.macro.KEY.c:
                console.log('Press "c" key  goldniu');
                self.play(4);
                break;
            case cc.macro.KEY.v:
                console.log('Press "v" key  fiveniu');
                self.play(5);
                break;
            case cc.macro.KEY.b:
                console.log('Press "b" key  bomb');
                self.play(6);
                break;
            case cc.macro.KEY.n:
                console.log('Press "n" key  allkill');
                self.play(7);
                break;
            case cc.macro.KEY.m:
                console.log('Press "m" key victory');
                self.play(8);
                break;
            case cc.macro.KEY.a:
                console.log('Press "a" key kingIcon');
                self.play(9);
                break;
            case cc.macro.KEY.s:
                console.log('Press "s" key');
                self.play(10);
                break;
                
        }
    },

    showAllTestButton: function()
    {
        var self = this;
        self.testButton.active = !self.testButton.active;
    },

    testButtonPress: function(event, customEventData)
    {
        var self = this;
        if(customEventData === "10") global.EventListener.fire("playTestMoneyFlow");
        else self.play(customEventData);
    }

});
