import global from "../Common/Global";
import animationManager from "../Common/AnimationMgr";

const {ccclass, property} = cc._decorator;
var animation = ["gameStart", "hasniu", "niuniu", "silvercow", "goldcow", "fivecows", "bomb", "allkill",
    "victory", "kingicon"];

@ccclass
export default class AnimationController extends cc.Component {

    private animation: any = {
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

    private moneyPrefabs = [];
    private bgPref:cc.Node[] = [];
    
    @property(cc.Node)
    testButton: cc.Node = null;

    @property(cc.Prefab)
    mPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    bgPrefab: cc.Prefab = null;
    
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

        for (let index: number = 0; index < 5; index++) {
            let positionPrefabs:cc.Node[] = [];
            this.moneyPrefabs.push(positionPrefabs);
            for(let i: number = 0;i<20;i++){
                //generate 20 coin for each position 
                let genGold: cc.Node = cc.instantiate(this.mPrefab);
                genGold.parent = this.node;
                this.moneyPrefabs[index].push(genGold);
            }
            let shineBg: cc.Node = cc.instantiate(this.bgPrefab);
            shineBg.parent = this.node;
            this.bgPref.push(shineBg);
        }
    }

    onLoad() {
        this.init();

        var self = this;

        global.Instance.EventListener.on("moneyFlow", function (event,Info) {
            cc.log("get money pack");
            let king = Info.king;
            for (let index = 0; index < 5; index++) {
                if (index == king) index++;
                if( Info.give[index] > 0 ) self.trigger(king,index,index);
                else cc.log("give 0$ to"+index+", no anime");
                cc.log("from me to" + index);
                cc.log("king = " + king + "  index = " + index);
            }

            /*

            self.schedule(function() {
                for (let index = 0; index < 5; index++) {
                    if (index == king) index++;
                    if( Info.get[index] > 0 ) self.trigger(index,king,index);
                    else cc.log("get 0$ from"+index+", no anime");
                    cc.log("from" + index+"to me");
                }
            }, 1);//delay 3s
            */
            
        });

        global.Instance.EventListener.on("playTestMoneyFlow", function (event) {
            cc.log("test money");
            self.trigger(0,1,1);

            /*
            let king = Info.king;
            for (let index = 0; index < 5; index++) {
                if (index == king) index++;
                if( Info.give[index] > 0 ) self.trigger(king,index,index);
                else cc.log("give 0$ to"+index+", no anime");
                cc.log("from me to" + index);
                cc.log("king = " + king + "  index = " + index);
            }


            self.schedule(function() {
                for (let index = 0; index < 5; index++) {
                    if (index == king) index++;
                    if( Info.get[index] > 0 ) self.trigger(index,king,index);
                    else cc.log("get 0$ from"+index+", no anime");
                    cc.log("from" + index+"to me");
                }
            }, 1);//delay 3s
            */
            
        });

        global.Instance.EventListener.on("Animation", function (event, animationName) {
            var index = animation.indexOf(animationName);
            cc.log("trigger anime : " + animationName);
            self.play(index);
        });

    }

    play(AnimationIndex) {
        cc.log("playing animation at aniCtrler");
        if (AnimationIndex < 0) return;
        this.node.getChildren()[AnimationIndex].active = true;
        this.node.getChildren()[AnimationIndex].getComponent(cc.Animation).play();
    }

    showAllTestButton() {
        var self = this;
        self.testButton.active = !self.testButton.active;
    }

    testButtonPress(event, customEventData) {
        var self = this;
        if (customEventData === "10") global.Instance.EventListener.notify("playTestMoneyFlow");
        else self.play(customEventData);
    }

    trigger(from:number,to:number,pos:number){
        cc.log("trigger money");
        //money
        let self = this;
        for(let i = 0;i<20;i++) {
            let a = Math.floor(Math.random() * (19 - 0 + 1)) + 1;//亂數產生1~20
            cc.log("pass" + from + "," + to);
            self.moneyPrefabs[pos][i].getComponent("moneyAnime").moneyFlow(from,to,10*i-100,10*i-100, i+a );
        }
        //money shine
        self.bgPref[pos].getComponent("moneyBgAnime").moneyShine(to);
    }

}
