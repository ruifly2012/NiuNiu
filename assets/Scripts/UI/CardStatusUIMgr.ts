import Converter,* as Define from "../Define";
import CardStatus from "../components/CardStatus";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CardStatusUIMgr extends cc.Component {

    @property([CardStatus])
    cardStatus: CardStatus[] = [];

    activate(){
        this.hideAllType();
    }

    setType(seat: number, type:Define.CardType){
        this.cardStatus[seat].setType(type);
    }

    hideAllType(){
        for(let index = 0;index<Define.GameInfo.Inst.playerCount;index++){
            this.cardStatus[index].hideType();
        }
    }

    setComplete(seat: number, activate: boolean = false){
        cc.warn(seat+"complete"+activate);
        this.cardStatus[seat].showChoosed(activate);
    }



}
