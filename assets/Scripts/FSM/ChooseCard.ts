import StateBase from "../components/StateBase";
import * as Define from "../Define";
import Game from "../Game";
import UIMgr from "../UIMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChooseCard extends StateBase {

    @property({type:cc.Enum(Define.GameState),serializable:true})
    public state:Define.GameState = Define.GameState.ChooseCard;

    /**自己選完牌 */
    isSelfComplete: boolean = false;
    /**所有其餘玩家選牌完成 */
    isAllOtherComplete: boolean = false;
    /**完成選牌玩家數量 */
    otherComplete: number = 0;

    onLoad(){
        
    }
    
    public stateInitialize(){
        cc.warn("choose card!!!");
        UIMgr.Inst.animMgr.playDistributePoker(()=>{
            this.startCountDown();
            this.registerEvent();
            UIMgr.Inst.players.forEach(element => {
                element.hideStatus();
            });
            UIMgr.Inst.showChooseCard(true);
            UIMgr.Inst.cardUIMgr.activate();
        });
    }

    public stateRelease(){
        cc.warn("change to calc");
        //hide UI & clear listener
        UIMgr.Inst.showChooseCard(false);
        Game.Inst.EventListener.off("cardChooseComplete");
        Game.Inst.EventListener.off("getTime");
        
        UIMgr.Inst.stopClock();
        UIMgr.Inst.cardUIMgr.unRegClickEvent();
        //hide complete UI
        for(let index = 0;index< Define.GameInfo.Inst.playerCount;index++)
            UIMgr.Inst.CardStatusUIMgr.setComplete(index,false);
    }
    public stateUpdate(dt: number){
    }

    startCountDown() {
        UIMgr.Inst.setClockAct(12,()=>{
            this.completeChoose();
            this.m_FSM.setState(Define.GameState.Calc);
        });
    }

    registerEvent(){
        
        this.registerTimeSync();
        this.registerComplete();
    }

    /**發牌 */
    playDistribute(callback?){
        UIMgr.Inst.animMgr.playDistributePoker(callback);
    }

    registerComplete(){
        Game.Inst.EventListener.on("cardChooseComplete",()=>{
            this.otherComplete++;
            cc.warn("complete num : " + this.otherComplete);
            if(this.otherComplete + 1 == Define.GameInfo.Inst.playerCount){
                cc.warn("all other complete" );
                this.isAllOtherComplete = true;
                //change stage when all complete
                if(this.isSelfComplete){
                    this.m_FSM.setState(Define.GameState.Calc);
                }
            }
        })
    }

    /**
     * get time from server to sync
     */
    registerTimeSync(){
        Game.Inst.EventListener.on("getTime",(data)=>{
            if(data.stage == Define.GameState.ChooseCard){
                // cc.warn("update time : " + data.time);
                UIMgr.Inst.clock.countDown = data.time;
            }
        })
    }

    /**
     * 點擊有牛/無牛按鈕
     * @param event 
     * @param customdata 0:無牛/1:有牛
     */
    niuClick(event, customdata: number){
        let pressNiu: boolean = false;
        if(customdata == 1) pressNiu = true;
        if(UIMgr.Inst.cardUIMgr.niuClickCorrect(pressNiu)){
            this.completeChoose();
            //change stage when all complete
            if(this.isAllOtherComplete){
                this.m_FSM.setState(Define.GameState.Calc);
            }
        }
        else
            UIMgr.Inst.animMgr.playCardTypeError();
    }

    //move card & send complete
    completeChoose(){
        UIMgr.Inst.showChooseCard(false);
            UIMgr.Inst.cardUIMgr.unRegClickEvent();
            Game.Inst.networkMgr.chooseCardComplete();
            this.isSelfComplete = true;
            //choose complete anime
            UIMgr.Inst.animMgr.playChooseCompleteAnim();
            //show card type
            UIMgr.Inst.CardStatusUIMgr.setType(0,Define.GameInfo.Inst.players[0].cardType);
            UIMgr.Inst.AudioMgr.playCardTypeTalk(Define.GameInfo.Inst.players[0].cardType, Define.GameInfo.Inst.players[0].gender);
    }

}
