import Converter,* as Define from "../Define";
import Game from "../Game";
import UIMgr from "../UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BetUIMgr extends cc.Component {

    @property([cc.Label])
    betButton: cc.Label[] = [];

    private rate: number[] = [3,5,7,11,15];

    private isChoosed: boolean = false;

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
     * @param send 是否傳出封包
     */
    placeBetClick(event, index: number, send: boolean = true){
        //avoid send data twice
        if(this.isChoosed) return;
        this.isChoosed = true;
        
        cc.warn("[place_bet]click"+index+",rate:"+this.rate[index]);
        
        if(send)
            this.sendBetRate(this.rate[index]);

        UIMgr.Inst.showPlaceBet(false);
        UIMgr.Inst.players[0].setStatus(Define.BetType.PlaceBet,this.rate[index]);
    }

    sendBetRate(rate : number){
        let data= {
            "event" : "bet",
            "grab_rate" : rate
        };
        Game.Inst.networkMgr.sendMessage(data);
    }

}
