var moneyPref = [];
var bgPref;
cc.Class({
    extends: cc.Component,

    /*ctor: function () {
        this.bgPref = null;
    },*/

    properties: {
        mPrefab:{
            default:null,
            type:cc.Prefab
        },
        bgPrefab:{
            default:null,
            type:cc.Prefab
        },
    },

    onLoad(){
        var self = this;

        for(var i = 0;i<20;i++){
            cc.log("moneyPrefab money instantiate");
            let genGold = cc.instantiate(self.mPrefab);
            genGold.parent = self.node;
            moneyPref.push(genGold);

        }
        cc.log("moneyPrefab moneyBG instantiate");
        //self.bgPref = cc.instantiate(self.bgPrefab);
        bgPref = cc.instantiate(self.bgPrefab);
        cc.log("moneyPrefab moneyBG instantiate finished");
    },

    trigger(){
        //money
        for(var i = 0;i<20;i++) {
            var a = Math.floor(Math.random() * (19 - 0 + 1)) + 1;//亂數產生1~20
            //cc.log("random = " + a);
            moneyPref[i].getComponent("moneyAnime").moneyFlow(3,0,10*i-100,10*i-100, i+a );
        }

        //money shine
        //bgPref.getComponent("moneyBgAnime").moneyShine(3);
    },

    start () {
        
    },

});

