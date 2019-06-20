import Game from "../Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TouchEffect extends cc.Component {

    @property(String) clickSound: string = "SFX_MouseClick";
    btn: cc.Button = null;

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchBegan, this);
        this.btn = this.node.getComponent(cc.Button);
    }

    touchBegan()
    {
        let interactable = true;
        if (this.btn !== null)
            interactable = this.btn.interactable;

        if (interactable && this.clickSound != "")
        {
            Game.Inst.audioMgr.playEffect(this.clickSound);
        }
    }
}
