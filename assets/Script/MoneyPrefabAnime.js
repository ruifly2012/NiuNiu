var moneyPref1 = new Array;
var moneyPref2 = new Array;
var moneyPref3 = new Array;
var moneyPref4 = new Array;
var moneyPref5 = new Array;
var moneyPrefabs = [moneyPref1,moneyPref2,moneyPref3,moneyPref4,moneyPref5];
var bgPref = [];
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
        for (let index = 0; index < 5; index++) {
            for(var i = 0;i<20;i++){
                let genGold = cc.instantiate(self.mPrefab);
                genGold.parent = self.node;
                moneyPrefabs[index].push(genGold);
            }
            let shineBg = cc.instantiate(self.bgPrefab);
            shineBg.parent = self.node;
            bgPref.push(shineBg);
        }


        global.socket.on("moneyFlow", function (Info) {
            let king = Info.king;
            for (let index = 0; index < 5; index++) {
                if (index == king) index++;
                if( Info.give[index] > 0 ) self.trigger(king,index,index);
                else cc.log("give 0$ to"+index+", no anime");
                cc.log("from me to" + index);
            }


            self.schedule(function() {
                for (let index = 0; index < 5; index++) {
                    if (index == king) index++;
                    if( Info.get[index] > 0 ) self.trigger(index,king,index);
                    else cc.log("get 0$ from"+index+", no anime");
                    cc.log("from" + index+"to me");
                }
            }, 3);//delay 3s
            
        });
    },

    trigger(from,to,pos){
        //money
        for(var i = 0;i<20;i++) {
            var a = Math.floor(Math.random() * (19 - 0 + 1)) + 1;//亂數產生1~20
            cc.log("pass" + from + "," + to);
            moneyPrefabs[pos][i].getComponent("moneyAnime").moneyFlow(from,to,10*i-100,10*i-100, i+a );
        }
        //money shine
        bgPref[pos].getComponent("moneyBgAnime").moneyShine(to);
    },
});

