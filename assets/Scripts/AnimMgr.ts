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

    playCardTypeAnim(type: Define.CardType, callback?){
        cc.log("playType:"+Converter.getCardTypeAnimText(type));
        Game.Inst.animationMgr.play(Converter.getCardTypeAnimText(type), 0.3,false, callback); 
    }

    /**
     * 發牌動畫
     */
    playDistributePoker(callback?) {
        //set player number
        this.pokerAnime.playerCount = Define.GameInfo.Inst.playerCount;
        Game.Inst.animationMgr.play("DistributePokerAnim", 1.5, false, () => {
            if (callback != undefined)
                callback();
        });
    }

    playShowAllCardAnim(callback?){
        for(let index = 1; index < Define.GameInfo.Inst.playerCount; index++){
            UIMgr.Inst.cardUIMgr.setCard(index,()=>{
                UIMgr.Inst.CardStatusUIMgr.setType(index,Define.GameInfo.Inst.players[index].cardType);
                if(callback != undefined)
                    callback();
            });
        }
    }

}
