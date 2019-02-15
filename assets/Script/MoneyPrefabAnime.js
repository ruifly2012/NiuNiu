var moneyPref = [];
var bgPref;
cc.Class({
    extends: cc.Component,

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
            let genGold = cc.instantiate(self.mPrefab);
            genGold.parent = self.node;
            moneyPref.push(genGold);
        }
        bgPref = cc.instantiate(self.bgPrefab);
        bgPref.parent = self.node;

        global.socket.on("moneyFlow", function (Info) {
            //get money
            let f = 0,t=0;
            self.schedule(function() {
                if(f==2) f++;
                if( Info.get[f] > 0 ) self.trigger(f,2);
                else cc.log("get 0$ from"+f+", no anime");
                //cc.log("from" + f+"to me");
                f++;
            }, 1, 3, 0);//interval repeat delay
            //give money
            self.schedule(function() {
                if(t==2) t++;
                if( Info.give[t] > 0 ) self.trigger(2,t);
                else cc.log("give 0$ to"+t+", no anime");
                //cc.log("from me to" + t);
                t++;
            }, 1, 3, 6);//interval repeat delay
        });
    },

    trigger(from,to){
        //money
        for(var i = 0;i<20;i++) {
            var a = Math.floor(Math.random() * (19 - 0 + 1)) + 1;//亂數產生1~20
            cc.log("pass" + from + "," + to);
            moneyPref[i].getComponent("moneyAnime").moneyFlow(from,to,10*i-100,10*i-100, i+a );
        }
        //money shine
        bgPref.getComponent("moneyBgAnime").moneyShine(to);
    },
});

