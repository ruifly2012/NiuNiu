import Game from "../Game";
import Converter, * as Define from "../Define";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardStatus extends cc.Component 
{
    @property(cc.Node) choosed: cc.Node = null;
    @property(cc.Sprite) typeBG: cc.Sprite  = null;
    @property(cc.Sprite) typeText: cc.Sprite  = null;
    
    
    start() {
        this.init();
    }

    init(){
        this.showChoosed(false);
        this.hideType();
    }

    showChoosed(active: boolean = false){
        this.choosed.active = active;
    }

    hideType(){
        this.typeBG.spriteFrame = null;
        this.typeText.spriteFrame = null;
    }

    setType(type: Define.CardType){
        cc.log("[typeStatus]" + "Award_text_" + type + ",");
        let text = Game.Inst.resourcesMgr.load("Award_text_" + type);
        let bg = Game.Inst.resourcesMgr.load("Award_frame_01");
        
        if (text != null)
            this.typeText.spriteFrame = text;
        else
            cc.error("Error: Load " + "Award_text_" + type + " failed.");

        if (bg != null)
            this.typeBG.spriteFrame = bg;
        else
            cc.error("Error: Load " + "Award_frame_01" + " failed.");
        
    }

}
