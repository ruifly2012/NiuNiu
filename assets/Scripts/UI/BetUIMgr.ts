import Converter,* as Define from "../Define";
import Game from "../Game";
import UIMgr from "../UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BetUIMgr extends cc.Component {

    @property([cc.Label])
    betButton: cc.Label[] = [];

    private rate: number[] = [3,5,7,11,15];

    /**show rate */
    activate(){
        for(let index = 0;index < 5; index++){
            this.betButton[index].string = this.rate[index].toString();
        }
    }

    setRate(betRate: number[]){
        this.rate = betRate;
    }

    /**
     * 下注倍數
     * @param event 
     * @param index 按壓按鈕編號 
     */
    placeBetClick(event, index: number){
        cc.warn("[place_bet]click"+index+",rate:"+this.rate[index]);
        Game.Inst.networkMgr.place_bet(this.rate[index]);
        UIMgr.Inst.showPlaceBet(false);
        UIMgr.Inst.players[0].setStatus(Define.BetType.PlaceBet,this.rate[index]);
    }



}
