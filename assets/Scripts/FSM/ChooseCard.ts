import StateBase from "../components/StateBase";
import * as Define from "../Define";
import Game from "../Game";
import UIMgr from "../UIMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChooseCard extends StateBase {

    @property({type:cc.Enum(Define.GameState),serializable:true})
    public state:Define.GameState = Define.GameState.PlayCard;

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
            UIMgr.Inst.showChooseCard(true);
            UIMgr.Inst.cardUIMgr.activate();
        });
    }

    public stateRelease(){
        cc.warn("change to calc");
        //hide UI & clear listener
        UIMgr.Inst.showChooseCard(false);
        
        UIMgr.Inst.stopClock();
        UIMgr.Inst.cardUIMgr.unRegClickEvent();
        //hide complete UI
        for(let index = 0;index< Define.GameInfo.Inst.playerCount;index++)
            UIMgr.Inst.CardStatusUIMgr.setComplete(index,false);
    }
    public stateUpdate(dt: number){
    }

    /**發牌 */
    playDistribute(callback?){
        UIMgr.Inst.animMgr.playDistributePoker(callback);
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
        UIMgr.Inst.completeChooseCard();
        this.sendPlayCard();
    }

    /**
     * tell server complete choose card
     */
    sendPlayCard(){
        let data= {
            "event" : "play_card"
        };
        Game.Inst.networkMgr.sendMessage(data);
    }

}
