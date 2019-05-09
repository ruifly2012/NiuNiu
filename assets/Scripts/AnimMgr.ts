import Game from "./Game";
import Converter, * as Define from "./Define";
import DistributePokerAnimation from "./Anime/DistributePokerAnimation";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AnimMgr extends cc.Component {
    @property(cc.Node) startGame: cc.Node = null;
    @property(DistributePokerAnimation) pokerAnime: DistributePokerAnimation = null;
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

    playCoinFlow(callback?){
        Game.Inst.animationMgr.play("CoinFlowAnim",1,false,()=>{
            cc.warn("coin flow complete");
            if (callback != undefined) {
                //callback();
                cc.log(callback);
            }
        }); 
    }

    playChooseCompleteAnim(){
        let pos: cc.Vec2 = cc.v2(-875,-730);
        let Interval: number = 1;
        for (let index:number = 0; index < 5; index++) {
            let node:cc.Node = this.playePokerRoot.children[index];
            cc.warn("moveto"+ (pos.x + 40*index)+ "," +  pos.y);
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
        Game.Inst.animationMgr.play("DistributePokerAnim", 1.5, false, () => {
            if (callback != undefined)
                callback();
        });
    }

// 	/**
//      * 三墩動畫
//      */
//     playThreeHand(callback?) {
//         let pokerAnime: DistributePokerAnimation = this.distribute.getComponent(DistributePokerAnimation);
//         //all player change to three hand mode
//         for (let seat = 0; seat < TW.TWGamInfo.Inst.playerCount; seat++)
//             pokerAnime.oneLine2threeLine(seat);
//         this.scheduleOnce(() => {
//             if (callback != undefined)
//                 callback();
//         }, 1);
//     }

//     /**
//      * 牌上下移動動畫
//      */
//     playPokerHover() {
//         let pokerHover: PokerHoverAnimation = this.pokerHover.getComponent(PokerHoverAnimation);
//         //set player number
//         pokerHover.playerCount = TW.TWGamInfo.Inst.playerCount;
//         Game.Inst.animationMgr.play("PokerHoverAnim", 1, false);
//     }

//     /**
//      * 停止牌上下移動動畫
//      */
//     stopPokerHover() {
//         Game.Inst.animationMgr.stop("PokerHoverAnim");
//     }

//     /**
//      * 特殊牌型(牌上標示)
//      */
//     playSpecialType(type: TW.TWSpecialCardType) {

//         let spine: DynamicSpineAnimation = this.specialType.getComponent(DynamicSpineAnimation);
//         this.specialType.active = true;

//         //file name
//         let fileName: string = "CS_";
//         if (type < 10) fileName += "0";
//         fileName += type;

//         spine.pathName = "Spine/CardStyle";
//         spine.spineName = fileName;

//         Game.Inst.animationMgr.play("SpecialTypeAnim");
//     }

//     playGunShot(){
        
//     }

//     /**
//      * 特殊牌型結果表演
//      * @param type 
//      */
//     playSpecialResultType(type: TW.TWSpecialCardType) {
//         let resultType = TWDefineConverter.getSpecialResultTypeConvert(type);
//         if (resultType == TW.TWSpecialResultType.None) {
//             return;
//         }

//         let typeRoot: cc.Node = this.specialResult.getChildByName("Type" + resultType.toString());
//         let text;
//         let speed = 0.5;

//         this.specialResult.active = true;
//         typeRoot.active = true;

//         //text nameSetting
//         if (resultType == TW.TWSpecialResultType.Type1) {
//             text = typeRoot.getChildByName("Text").getComponent(SequenceAnimation);
//             text.clip_name = TWDefineConverter.getSpecialResultTypeAnimText(type);
//         }
//         else {
//             text = typeRoot.getChildByName("Text").getComponent(DynamicSpineAnimation);
//             text.spineName = TWDefineConverter.getSpecialResultTypeAnimText(type);
//         }

//         //speed set
//         if (resultType == TW.TWSpecialResultType.Type4) {
//             speed = 1.0;
//         }

//         Game.Inst.animationMgr.play("SpecialResultType" + resultType.toString() + "Bg", speed, false, () => {
//             this.specialResult.active = false;
//             typeRoot.active = false;
//         });

//         Game.Inst.animationMgr.play("SpecialResultType" + resultType.toString() + "Text", speed, false);
//     }
}
