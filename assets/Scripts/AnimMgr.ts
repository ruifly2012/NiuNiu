import Game from "./Game";
import Converter, * as Define from "./Define";
import DistributePokerAnimation from "./Anime/DistributePokerAnimation";
import CoinFlowAnimation from "./Anime/CoinFlowAnimation";
import UIMgr from "./UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AnimMgr extends cc.Component {
    @property(cc.Node) startGame: cc.Node = null;
    @property(DistributePokerAnimation) pokerAnime: DistributePokerAnimation = null;
    @property(CoinFlowAnimation) coinAnime:CoinFlowAnimation = null;
    @property(cc.Node) playePokerRoot: cc.Node = null;
    


    onLoad() {
        if (this.startGame != null) this.startGame.active = false;

    }

    playStartGame(callback?) {
        this.startGame.active = true;
        Game.Inst.animationMgr.play("StartGameAnim", 0.2, false, () => {
            this.startGame.active = false;
            if (callback != undefined) {
                callback();
            }
        })
    }

    playCardTypeError(){
        Game.Inst.animationMgr.play("CardTypeErrorAnim", 0.2,false,()=>{cc.warn("cardErrorAnim finish");}); 
    }

    playCoinFlow(fromSeat: number, toSeat: number, callback?){
        this.coinAnime.fromSeat = fromSeat;
        this.coinAnime.toSeat = toSeat;
        Game.Inst.animationMgr.play("CoinFlowAnim",1,false,()=>{
            cc.warn("coin flow complete");
            if (callback != undefined) {
                callback();
            }
        }); 
    }

    playChooseCompleteAnim(){
        let pos: cc.Vec2 =cc.v2(-80,-365);
        let Interval: number = 1;
        for (let index:number = 0; index < 5; index++) {
            let node:cc.Node = this.playePokerRoot.children[index];
            node.active = true;
            //set start position
            let action:cc.ActionInstant = cc.spawn(
                cc.moveTo( Interval , pos.x + 40*index , pos.y).easing(cc.easeQuinticActionOut()),
                cc.scaleTo(Interval,0.8).easing(cc.easeQuinticActionOut())
            )
            node.runAction(action);  
        }     
    }

    /**
     * 發牌動畫
     */
    playDistributePoker(callback?) {
        //set player number
        this.pokerAnime.playerCount = Define.GameInfo.Inst.playerCount;
        Game.Inst.animationMgr.play("DistributePokerAnim", 3, false, () => {
            if (callback != undefined)
                callback();
        });
    }

    playShowAllCardAnim(callback?){
        //hide complete UI
        for(let index = 0;index< Define.GameInfo.Inst.playerCount;index++)
            UIMgr.Inst.CardStatusUIMgr.setComplete(index,false);
        let playerCount = Define.GameInfo.Inst.playerCount;
        cc.warn("playerTotal"+playerCount);
        cc.warn("playing"+0+"type"+Define.GameInfo.Inst.players[0].cardType);
        this.playCardTypeAnim(Define.GameInfo.Inst.players[0].cardType);
        for(let index = 1; index < playerCount - 1; index++){
            this.scheduleOnce(()=>{ 
                //cc.log("schedule player" + index);
                this.playShowCardAnim(index);
            },index*2);
        };
        this.scheduleOnce(()=>{ 
            //cc.log("schedule player" + (playerCount - 100));
            this.playShowCardAnim(playerCount - 1,callback);
        },(playerCount-1)*2);
        

    }

    playShowCardAnim(seat: number, callback?){
        //cc.log("play Type show card"+seat);
        UIMgr.Inst.cardUIMgr.setCard(seat,()=>{
            UIMgr.Inst.CardStatusUIMgr.setType(seat,Define.GameInfo.Inst.players[seat].cardType);
            this.scheduleOnce(function(){
                cc.warn("playing"+seat+"type"+Define.GameInfo.Inst.players[seat].cardType);
                this.playCardTypeAnim(Define.GameInfo.Inst.players[seat].cardType, callback);
            },1);
        });
    }

    /**牌型動畫(若普通牌型則直接callback) */
    playCardTypeAnim(type: Define.CardType, callback?){
        let animName: string = Converter.getCardTypeAnimText(type);
        let animRate: number = Converter.getCardTypeAnimRate(type);
        if(animName == "NoneType") {
            if (callback != undefined)
                callback();
        }
        else{
            Game.Inst.animationMgr.play(animName, animRate,false, callback); 
        }
        //cc.log("playType:"+animName + "RATE : "+animRate);
    }

    playAllKill(callback?){
        Game.Inst.animationMgr.play("allKillText", 0.5,false);
        this.scheduleOnce(()=>{
            Game.Inst.animationMgr.play("allKillLight", 1.4,false, callback);
        },0.4);
    }

    playVictory(callback?){
        Game.Inst.animationMgr.play("victory", 0.7,false, callback);
    }

    testPlay(){
        this.playStartGame(()=>{
            this.playDistributePoker(()=>{
                this.playAllKill(()=>{
                    this.playCardTypeAnim(Define.CardType.smallCow,()=>{
                        this.playCardTypeAnim(Define.CardType.cowCow,()=>{
                            this.playCardTypeAnim(Define.CardType.goldCow,()=>{
                                this.playCardTypeAnim(Define.CardType.silverCow,()=>{
                                    this.playCardTypeAnim(Define.CardType.bomb,()=>{
                                        this.playVictory(()=>{
                                            this.playCardTypeError();
                                        })
                                    })
                                })
                            })
                        })
                    })
                });
            });
        });
    }

    testMoney(){
        let from = Math.floor(Math.random()*4.99);
        let to = Math.floor(Math.random()*4.99);
        while(to == from){
            to = Math.floor(Math.random()*4.99);
        }
        
        this.playCoinFlow(from,to,()=>{
            UIMgr.Inst.players[to].setShiny();
            UIMgr.Inst.players[to].moneyChange(200,40);
        });
    }

    testAllKIll(){
        this.playAllKill();
    }

    testRec(){
        Game.Inst.networkMgr.get_record();
    }

}
