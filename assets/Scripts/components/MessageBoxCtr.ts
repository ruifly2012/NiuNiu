const {ccclass, property} = cc._decorator;

/**MsgBox中對於Button的設定檔 */
export class ButtonSetting{
    /**起始狀態Button背景 */
    originBtnBackground:cc.SpriteFrame;
    /**起始狀態Button文字 */
    originBtnText:cc.SpriteFrame;
    /**被點擊時Button背景 */
    clickedBtnBackground:cc.SpriteFrame;
    /**被點擊時Button文字 */
    clickedBtnText:cc.SpriteFrame;
    /**被點擊後的callback */
    callback;
    /**被點擊後是否隱藏MsgBox */
    closePanel: boolean;
}

@ccclass
export default class MessageBoxCtr extends cc.Component {

    @property(cc.Sprite) backGround: cc.Sprite = null;

    @property(cc.Sprite) titleText: cc.Sprite = null;

    @property(cc.Sprite) titleBackGround: cc.Sprite = null;

    @property(cc.Label) contentText: cc.Label = null;

    @property(cc.Button) oneCheckBtn: cc.Button = null;

    @property(cc.Button) twoCheckBtnLeft: cc.Button = null;

    @property(cc.Button) twoCheckBtnRight: cc.Button = null;
    
    //不確定是否會用到
    //spriteAtlas:cc.SpriteAtlas;

    contentColor: cc.Color = cc.Color.BLACK;

    contentSize: number = 40;

    onLoad(){
        this.backGround.spriteFrame = null;
        this.titleText.spriteFrame = null;
        this.titleBackGround.spriteFrame = null;
        this.contentText.string = "";
        this.oneCheckBtn.node.active = false;
        this.twoCheckBtnLeft.node.active = false;
        this.twoCheckBtnRight.node.active = false;
    }

    /**
     * 顯示純文字事件提示框
     * @param _backGround 提示框背景
     * @param _titleText 提示框標題(圖片)
     * @param _titleBackGround 提示框標題背景
     * @param _contentText 提示框提示文字
     */
    showMsgContent(_background:cc.SpriteFrame,_titletext:cc.SpriteFrame,_titlebackground:cc.SpriteFrame,_contenttext: string){
        this.backGround.spriteFrame = _background;
        this.titleText.spriteFrame = _titletext;
        this.titleBackGround.spriteFrame = _titlebackground;

        this.node.color = this.contentColor;
        this.contentText.fontSize = this.contentSize;
        this.contentText.lineHeight = this.contentSize;
        this.contentText.string = _contenttext;

        this.showPopUp();
    }

    showOneEventContent(
        _background:cc.SpriteFrame,
        _titletext:cc.SpriteFrame,
        _titlebackground:cc.SpriteFrame,
        _contenttext: string,
        _onecheckbtnsetting: ButtonSetting
        )
    {
        this.backGround.spriteFrame = _background;
        this.titleText.spriteFrame = _titletext;
        this.titleBackGround.spriteFrame = _titlebackground;

        this.node.color = this.contentColor;
        this.contentText.fontSize = this.contentSize;
        this.contentText.lineHeight = this.contentSize;
        this.contentText.string = _contenttext;

        this.oneCheckBtn.node.active = true;
        this.oneCheckBtn.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = _onecheckbtnsetting.originBtnBackground;
        this.oneCheckBtn.node.getChildByName("Background").getChildByName("Text").getComponent(cc.Sprite).spriteFrame = _onecheckbtnsetting.originBtnText;

        this.oneCheckBtn.node.on(cc.Node.EventType.TOUCH_START, () => 
        {
            this.oneCheckBtn.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = _onecheckbtnsetting.clickedBtnBackground;
            this.oneCheckBtn.node.getChildByName("Background").getChildByName("Text").getComponent(cc.Sprite).spriteFrame = _onecheckbtnsetting.clickedBtnText;
        },this);

        this.oneCheckBtn.node.on(cc.Node.EventType.TOUCH_END, () => 
        {
            this.oneCheckBtn.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = _onecheckbtnsetting.originBtnBackground;
            this.oneCheckBtn.node.getChildByName("Background").getChildByName("Text").getComponent(cc.Sprite).spriteFrame = _onecheckbtnsetting.originBtnText;

            if (_onecheckbtnsetting.callback != undefined)
                _onecheckbtnsetting.callback();

            if (_onecheckbtnsetting.closePanel)
                this.hidePopUp();
        },this);
        
        this.showPopUp();
    }

    showTwoEventContent(_background:cc.SpriteFrame,
        _titletext:cc.SpriteFrame,
        _titlebackground:cc.SpriteFrame,
        _contenttext: string,
        _twocheckbtnleftsetting: ButtonSetting,
        _twocheckbtnrightsetting: ButtonSetting
        ){
        this.backGround.spriteFrame = _background;
        this.titleText.spriteFrame = _titletext;
        this.titleBackGround.spriteFrame = _titlebackground;

        this.node.color = this.contentColor;
        this.contentText.fontSize = this.contentSize;
        this.contentText.lineHeight = this.contentSize;
        this.contentText.string = _contenttext;

        //Left Btn Setting
        this.twoCheckBtnLeft.node.active = true;
        this.twoCheckBtnLeft.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = _twocheckbtnleftsetting.originBtnBackground;
        this.twoCheckBtnLeft.node.getChildByName("Background").getChildByName("Text").getComponent(cc.Sprite).spriteFrame = _twocheckbtnleftsetting.originBtnText;

        this.twoCheckBtnLeft.node.on(cc.Node.EventType.TOUCH_START, () => 
        {
            this.twoCheckBtnLeft.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = _twocheckbtnleftsetting.clickedBtnBackground;
            this.twoCheckBtnLeft.node.getChildByName("Background").getChildByName("Text").getComponent(cc.Sprite).spriteFrame = _twocheckbtnleftsetting.clickedBtnText;
        },this);

        this.twoCheckBtnLeft.node.on(cc.Node.EventType.TOUCH_END, () => 
        {
            this.twoCheckBtnLeft.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = _twocheckbtnleftsetting.originBtnBackground;
            this.twoCheckBtnLeft.node.getChildByName("Background").getChildByName("Text").getComponent(cc.Sprite).spriteFrame = _twocheckbtnleftsetting.originBtnText;

            if (_twocheckbtnleftsetting.callback != undefined)
                _twocheckbtnleftsetting.callback();

            if (_twocheckbtnleftsetting.closePanel)
                this.hidePopUp();
        },this);

        //Right Btn Setting
        this.twoCheckBtnRight.node.active = true;
        this.twoCheckBtnRight.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = _twocheckbtnrightsetting.originBtnBackground;
        this.twoCheckBtnRight.node.getChildByName("Background").getChildByName("Text").getComponent(cc.Sprite).spriteFrame = _twocheckbtnrightsetting.originBtnText;

        this.twoCheckBtnRight.node.on(cc.Node.EventType.TOUCH_START, () => 
        {
            this.twoCheckBtnRight.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = _twocheckbtnrightsetting.clickedBtnBackground;
            this.twoCheckBtnRight.node.getChildByName("Background").getChildByName("Text").getComponent(cc.Sprite).spriteFrame = _twocheckbtnrightsetting.clickedBtnText;
        },this);

        this.twoCheckBtnRight.node.on(cc.Node.EventType.TOUCH_END, () => 
        {
            this.twoCheckBtnRight.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = _twocheckbtnrightsetting.originBtnBackground;
            this.twoCheckBtnRight.node.getChildByName("Background").getChildByName("Text").getComponent(cc.Sprite).spriteFrame = _twocheckbtnrightsetting.originBtnText;

            if (_twocheckbtnrightsetting.callback != undefined)
                _twocheckbtnrightsetting.callback();

            if (_twocheckbtnrightsetting.closePanel)
                this.hidePopUp();
        },this);
        
        this.showPopUp();
    }

    /**
     * 銷毀事件提示框
     */
    onDisable(){
        this.destroy();
    }

    showPopUp(onFinished?)
    {
        this.node.active = true;
        let t = 0.35;

        //背景黑幕動畫
        let dark: cc.Sprite = this.node.getChildByName("dark").getComponent(cc.Sprite);
        //停止先前所有播放的動畫
        dark.node.stopAllActions();
        //執行動畫(效果：此物件的透明值在0.35秒內更改至191，線性內插)
        dark.node.runAction(cc.fadeTo(t, 191));

        //背景黑幕動畫
        let panel: cc.Node = this.node.getChildByName("panel");
        //停止先前所有播放的動畫
        panel.stopAllActions();
        panel.scale = 0;

        //製作一段順序動畫流程，內部各段動畫會按順序執行
        let seq = cc.sequence(
            //同步動畫流程，內部各段動畫同時播放
            cc.spawn(
                cc.scaleTo(t, 1).easing(cc.easeBezierAction(0, 1, 1.12, 1)),
                //cc.scaleTo(t, 1).easing(cc.easeBackOut()),
                cc.show()
            ),
            //暫停t段時間
            cc.delayTime(t),
            //執行callback function
            cc.callFunc(()=>
            {                    
                if (onFinished !== undefined)
                    onFinished();
            })
        );
        //執行動畫(效果：panel會在顯現的同時進行縮放，在scale到1時(花t秒時間)，暫停t秒時間後執行callback function)
        panel.runAction(seq);
    }

    hidePopUp(onFinished?)
    {
        let t = 0.3;
        let panel: cc.Node = this.node.getChildByName("panel");
        let dark: cc.Sprite = this.node.getChildByName("dark").getComponent(cc.Sprite);
        dark.node.stopAllActions();
        dark.node.runAction(cc.fadeOut(t));
        
        panel.stopAllActions();
        let seq = cc.sequence(
            cc.scaleTo(t, 0).easing(cc.easeBackIn()),
            cc.delayTime(t),
            cc.callFunc(()=>
            {
                this.node.active = false;

                if (onFinished !== undefined)
                    onFinished();

                this.onDisable();
            })
        );
        panel.runAction(seq);
    }
    
}
