var frames = [];
var pref = [];
var temp;
cc.Class({
    extends: cc.Component,
    
    properties: {
        mPrefab:{
            default:null,
            type:cc.Prefab
        },
    },

    onLoad(){
        var self = this;
        /*
        temp = cc.instantiate(self.mPrefab);
        temp.parent = self.node;
        temp.setPosition(10,10);
        */
        
        for(var i = 0;i<20;i++){
            let genGold = cc.instantiate(self.mPrefab);
            genGold.parent = self.node;
            pref.push(genGold);
        }  
    },

    trigger(){
        for(var i = 0;i<20;i++) {
            var a = Math.floor(Math.random() * (19 - 0 + 1)) + 1;//亂數產生1~20
            cc.log("random = " + a);
            pref[i].getComponent("moneyAnime").moneyFlow(3,0,10*i-100,10*i-100, i+a );
        }
        /*
        if(!temp) cc.log("temp null");
        else cc.log("temp not null")
        temp.getComponent("moneyAnime").moneyFlow();
        */
    },

    start () {
        
    },

});

