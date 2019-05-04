const { ccclass, property } = cc._decorator;

@ccclass
export default class SpriteTextButton extends cc.Component {
    /**起始狀態Button背景 */
    @property(cc.SpriteFrame) originBtnBackground: cc.SpriteFrame = null;
    /**起始狀態Button文字 */
    @property(cc.SpriteFrame) originBtnText: cc.SpriteFrame = null;
    /**被點擊時Button背景 */
    @property(cc.SpriteFrame) clickedBtnBackground: cc.SpriteFrame = null;
    /**被點擊時Button文字 */
    @property(cc.SpriteFrame) clickedBtnText: cc.SpriteFrame = null;
    /**未啟動時Button背景 */
    @property(cc.SpriteFrame) disableBtnBackground: cc.SpriteFrame = null;
    /**未啟動時Button文字 */
    @property(cc.SpriteFrame) disableBtnText: cc.SpriteFrame = null;

    onLoad() {
        this.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.originBtnBackground;
        this.node.getChildByName("Background").getChildByName("Text").getComponent(cc.Sprite).spriteFrame = this.originBtnText;
        this.node.setContentSize(this.originBtnBackground.getOriginalSize());

        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.clickedBtnBackground;
            this.node.getChildByName("Background").getChildByName("Text").getComponent(cc.Sprite).spriteFrame = this.clickedBtnText;
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.originBtnBackground;
            this.node.getChildByName("Background").getChildByName("Text").getComponent(cc.Sprite).spriteFrame = this.originBtnText;
        }, this);
    }

    setInteractable(isactive: boolean = true) {
        if (isactive) {
            this.node.getComponent(cc.Button).interactable = true;
            this.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.originBtnBackground;
            this.node.getChildByName("Background").getChildByName("Text").getComponent(cc.Sprite).spriteFrame = this.originBtnText;
        }
        else {
            this.node.getComponent(cc.Button).interactable = false;
            this.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.originBtnBackground;
            this.node.getChildByName("Background").getChildByName("Text").getComponent(cc.Sprite).spriteFrame = this.originBtnText;
        }
    }
}
