import MenuBase from "./MenuBase";
import Game from "../../Game";
import NewScrollBar from "./NewScrollBar";

const { ccclass, property } = cc._decorator;

export enum HelpMenuType {
    PlayIntroduce = 0,
    CardCalc,
    CardSize,
    CardRate,
    SettlementRules,
    AboutUs
}

@ccclass
export default class HelpMenu extends MenuBase {
    @property([cc.Node]) controlBtn: cc.Node[] = [];
    @property([cc.Node]) innerContent: cc.Node[] = [];
    @property(cc.ScrollView) content: cc.ScrollView = null;
    @property(NewScrollBar) scrollbar: NewScrollBar = null;
    @property(cc.Node) innerContentNode: cc.Node = null;
    controlBtnObj: cc.Button[] = [];
    controlBtnSprite: cc.Sprite[] = [];
    nowMenuType: HelpMenuType = HelpMenuType.PlayIntroduce;
    flagIsInit: boolean = false;

    open() {
        this.init();
        this.node.active = true;
    }

    close() {
        this.node.active = false;
    }

    init() {
        if (!this.flagIsInit) {
            for (let i = 0; i < this.controlBtn.length; i++) {
                this.controlBtnObj.push(this.controlBtn[i].getComponent(cc.Button));
                this.controlBtnSprite.push(this.controlBtn[i].getComponent(cc.Sprite));
            }
            this.flagIsInit = true;
        }
        this.nowMenuType = HelpMenuType.PlayIntroduce;
        this.setButton();
        this.setContent();
        this.content.scrollToTop();
        this.scrollbar.reset();
    }

    setMenu(event, customEventData) {
        this.content.stopAutoScroll();
        this.nowMenuType = Number(customEventData) as HelpMenuType;
        this.setButton();
        this.setContent();
        this.content.scrollToTop();
        this.scrollbar.reset();
    }

    private setButton() {
        for (let i = 0; i < this.controlBtn.length; i++) {
            cc.log(i);
            if (this.controlBtnObj[i].interactable) {
                this.controlBtnSprite[i].spriteFrame = Game.Inst.resourcesMgr.load(HelpMenuType[i] + "_a");
            }
            else {
                this.controlBtnSprite[i].spriteFrame = Game.Inst.resourcesMgr.load(HelpMenuType[i] + "_c");
            }
            this.controlBtn[i].scaleY = 0.8;
        }
        this.controlBtnSprite[this.nowMenuType].spriteFrame = Game.Inst.resourcesMgr.load(HelpMenuType[this.nowMenuType] + "_b");
        this.controlBtn[this.nowMenuType].scaleY = 1.0;
    }

    private setContent() {
        for (let i = 0; i < this.innerContent.length; i++) {
            this.innerContent[i].active = false;
        }
        this.innerContent[this.nowMenuType].active = true;
        this.innerContentNode.height = this.innerContent[this.nowMenuType].height;
    }

}
