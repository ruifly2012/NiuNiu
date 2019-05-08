import Poker, { PokerValue } from "../components/Poker";
import Converter,* as Define from "../Define";
import Game from "../Game";
import UIMgr from "../UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChooseCardUIMgr extends cc.Component {

    @property(cc.Node)
    pokerRoot: cc.Node = null;

    @property([cc.Label]) 
    numDisplay: cc.Label[] = [];

    private poker:cc.Node[] = [];
    private choosed:number[] = [];
    private chooseCardNum: number = 0;
    choosedNiu: boolean = false;

    onLoad() {
        this.chooseCardNum = 0;
        this.choosed = [];
    }

    activate(){
        for(let index = 0;index<5;index++){
            this.poker.push(this.pokerRoot.children[index]);
            
        }
        Game.Inst.EventListener.on("getCard",()=>{
            this.setCard();
        });
    }

    setCard(){
        let pokerVal:number[] = Define.GameInfo.Inst.players[0].poker;
        for(let index = 0;index<5;index++){
            let val:PokerValue = Converter.getServerPokerConvert(pokerVal[index]);
            this.poker[index].getComponent(Poker).setPokerValue(val.type,val.value, 0.9);
            this.registerClickEvent();
        }
    }

    /**set card clickable */
    registerClickEvent(){
        for(let index = 0;index < 5;index++){
            this.poker[index].getComponent(Poker).setClickAble(true);
        }
    }

    /**set unclickable */
    unRegClickEvent(){
        for(let index = 0;index < 5;index++){
            this.poker[index].getComponent(Poker).setClickAble(false);
        }
    }
    
    cardClick(index: number){
        //cc.log("click"+index);
        if(this.poker[index].getComponent(Poker).isSelect){
            this.poker[index].getComponent(Poker).setCardLight(false);
            let removeIndex = this.choosed.indexOf(index);
            if(removeIndex > -1) this.choosed.splice(removeIndex,1);
            this.chooseCardNum--;
        }
        else{
            if(this.chooseCardNum < 3){
                this.poker[index].getComponent(Poker).setCardLight(true);
                this.choosed.push(index);
                this.chooseCardNum++;
            }
            else{
                this.poker[this.choosed[0]].getComponent(Poker).setCardLight(false);
                this.choosed[0] = this.choosed[1];
                this.choosed[1] = this.choosed[2];
                this.choosed[2] = index;
            }
        }
        this.updateChooseCard();
        
    }

    /**
     * 更新亮框 & 數字顯示
     */
    updateChooseCard(){
        //cc.warn("update card");
        //light
        this.choosed.forEach(element => {
            //cc.log("choosed pos"+element);
            this.poker[element].getComponent(Poker).setCardLight(true);
        });
        //num
        //clear
        for(let index = 0;index < 4;index++)
            this.numDisplay[index].string=  "";
        //write
        let sum: number = 0;
        let index = 0;
        this.choosed.forEach(element => {
            let tmpNum: number = this.poker[element].getComponent(Poker).cardVal;
            if(tmpNum > 10) tmpNum = 10;
            this.numDisplay[index].string = tmpNum.toString();
            sum += tmpNum;
            //cc.log("choosed"+tmpNum);
            index++;
        });
        this.numDisplay[3].string = sum.toString();
        //update choose niu or not
        if(sum %10 == 0)
            this.choosedNiu = true;
        else 
            this.choosedNiu = false;
    }

    niuClickCorrect(pressNiu: boolean): Boolean{
        //card type error or choosed < 3 card
        if(pressNiu != this.choosedNiu || this.chooseCardNum < 3)
            return false;
        return true;
            
    }

}
