import MenuBase from "./MenuBase";
import Game from "../../Game";

const {ccclass, property} = cc._decorator;

export enum OptionMenuType {
    Music = 0,
    Sound,
    Voice
}

@ccclass
export default class OptionMenu extends MenuBase {
    @property([cc.Node]) muteButton: cc.Node[] = [];
    @property([cc.Slider]) volumnSlider: cc.Slider[] = [];
    @property([cc.Button]) volumnSliderButton: cc.Button[] = [];
    @property([cc.Label]) volumnLabel: cc.Label[] = [];
    @property([cc.Sprite]) volumnBar: cc.Sprite[] = [];
    @property(cc.Node) volumnBarBack: cc.Node = null;
    muteButtonObj: cc.Button[] = [];
    muteButtonSprite: cc.Sprite[] = [];
    barWidth: number = 0;

    flagIsInit: boolean = false;
    flagIsMute: boolean[] = [];

    open(){
        this.init();
        this.node.active = true;
    }

    close(){
        this.node.active = false;
    }

    init(){
        if(!this.flagIsInit){
            for (let i = 0; i < this.muteButton.length; i++) {
                this.muteButtonObj.push(this.muteButton[i].getComponent(cc.Button));
                this.muteButtonSprite.push(this.muteButton[i].getComponent(cc.Sprite));
                this.flagIsMute.push(false);
            }
            this.barWidth = this.volumnBarBack.width;
            this.flagIsInit = true;
        }
    }

    Mute(event, customEventData){
        let target = parseInt(customEventData);
        if(!this.flagIsMute[target]){
            this.disableButtonClickSprite(this.muteButtonObj[target]);
            this.volumnSlider[target].enabled = false;
            this.volumnSliderButton[target].interactable = false;
            this.volumnBar[target].spriteFrame = Game.Inst.resourcesMgr.load("panel_Off");
            this.flagIsMute[target] = true;
            
        }
        else if(this.flagIsMute[target] && this.volumnLabel[target].string != "0%"){
            this.enableButtonClickSprite(this.muteButtonObj[target]);
            this.volumnSlider[target].enabled = true;
            this.volumnSliderButton[target].interactable = true;
            this.volumnBar[target].spriteFrame = Game.Inst.resourcesMgr.load("panel_" + OptionMenuType[target]);
            this.flagIsMute[target] = false;
        }

    }

    sliderMove(event: cc.Slider, customEventData){
        let target = parseInt(customEventData);
        if(event.progress == 0){
            this.disableButtonClickSprite(this.muteButtonObj[target]);
            this.flagIsMute[target] = true;
        }
        else{
            if(this.flagIsMute[target]){
                this.enableButtonClickSprite(this.muteButtonObj[target]);
                this.flagIsMute[target] = false;
            }
        }
        this.volumnBar[target].node.width = event.progress * this.barWidth;
        this.volumnLabel[target].string = Math.floor(event.progress * 100).toString() + "%";
    }

    private enableButtonClickSprite(button: cc.Button){
        button.normalSprite = Game.Inst.resourcesMgr.load("Btnmute_b");;
        button.pressedSprite = Game.Inst.resourcesMgr.load("Btnmute_c");;
    }

    private disableButtonClickSprite(button: cc.Button){
        button.normalSprite = Game.Inst.resourcesMgr.load("Btnmute_a");;
        button.pressedSprite = null;
    }
}
