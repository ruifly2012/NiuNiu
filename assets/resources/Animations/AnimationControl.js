
var animation = ["straight", "spring", "Rspring", "airplane", "bomb",
    "laizi", "rocket", "showstatus"];

var status = ["farmerDouble", "dizhuDouble", "autoPlaying", "choseCards",
    "nolegalCard", "illegal"];

cc.Class({
    extends: cc.Component,

    ctor: function () {

        this.position = {
            Me: null,
            Pre: null,
            Next: null
        }
        this.cardScriptName = "PokerControl";
    },

    properties: {

        Card: {
            default: null,
            type: cc.Prefab
        },

    },

    init() {
        this.position = {
            Me: cc.find("position/Me", this.node),
            Pre: cc.find("position/Pre", this.node),
            Next: cc.find("position/Next", this.node)
        }
    },

    onLoad() {
        this.init();

        var self = this;

        global.socket.on("Animation", function (animationName, locate) {
            global.EventListener.fire("Animation", animationName, locate);
        });

        global.EventListener.on("Animation", function (animationName, locate) {

            var index = animation.indexOf(animationName);
            var statusIndex = status.indexOf(animationName);

            //------
            if (statusIndex != -1) {
                index = animation.indexOf("showstatus");
                var showstaus = cc.find("showstatus", self.node).getChildren();

                for (var i = 0; i < showstaus.length; i++) {
                    if (i != statusIndex)
                        showstaus[i].active = false;
                    else
                        showstaus[i].active = true;
                }
            }
            //-------
            if (animationName.slice(0, 5) == "laizi") {
                index = animation.indexOf("laizi");

                var showLaizi = cc.find("laizi/actualCard", self.node);
                setTimeout(function () {
                    var showLaizi = cc.find("laizi/actualCard", self.node);
                    showLaizi.removeAllChildren();
                }, 1500);

                var newCard = cc.instantiate(self.Card);
                newCard.getComponent(self.cardScriptName).setCard({
                    showTxt: animationName.slice(5, 7),
                    showType: 'laizi',
                    No:  20                  
                });
                    
                showLaizi.addChild(newCard);
            }
            //-------------------------------------


            self.play(index, locate);
        });

    },

    play(AnimationIndex, locate) {

        if (AnimationIndex < 0) return;

        this.node.getChildren()[AnimationIndex].getComponent(cc.Animation).play();
        this.node.getChildren()[AnimationIndex].position = this.position[locate].position;
    }

});
