import Game from "./Game";
import MassageBoxCtr, { ButtonSetting } from "./components/MessageBoxCtr";

const { ccclass, property } = cc._decorator;

/**
 * 通用功能物件
 */
@ccclass
export default class Utils extends cc.Component {

    get screenWidth(): number {
        let size = cc.view.getVisibleSize();
        if (size.width > 1080)
            size.width = 1080;
        return size.width;
    }

    constructor()
    {
        super();
        
        
        this.addEscEvent();
    }

    /**
     * 重新調整視窗大小比例
     */
    resize() {
        let cvs = cc.find("Canvas").getComponent(cc.Canvas);
        if (cc.isValid(cvs)) {
            let size = cc.view.getVisibleSize();
            cc.warn("getVisibleSize: " + size);

            if (size.height / size.width > 0.5625) {
                cvs.fitHeight = true;
                cvs.fitWidth = false;
            }
            else {
                cvs.fitHeight = true;
                cvs.fitWidth = false;
            }
        }
    }

    /**
     * 生成並顯示提示視窗，本功能依照你提供的參數多寡分3種模式
     * 1. 純文字提示窗(不給firstbtn與secondbtn)
     * 2. 單BTN提示窗(只多給firstbtn)
     * 3. 雙BTN提示窗(參數全給)
     * @param background 提示窗背景
     * @param titletext 提示窗標題文字圖
     * @param titlebackground 提示窗標題背景圖
     * @param contenttext 提示窗主要顯示文字
     * @param firstbtn 是否有1個BTN
     * @param secondbtn 是否有2個BTN
     */
    createMessageBox(background:cc.SpriteFrame,
        titletext:cc.SpriteFrame,
        titlebackground:cc.SpriteFrame,
        contenttext: string,
        firstbtn?: ButtonSetting,
        secondbtn?: ButtonSetting)
    {
        let prefabPath = "prefabs/Messagebox";
        let mentionBoxCtr: MassageBoxCtr = null;

        cc.loader.loadRes(prefabPath, (error: Error, prefab) => 
        {
            let root = cc.find("Canvas");
            let mentionBoxRoot = cc.instantiate(prefab);
            mentionBoxRoot.name = "DefaultMessageBox"
            root.addChild(mentionBoxRoot);
            mentionBoxCtr = mentionBoxRoot.getComponent(MassageBoxCtr);
            let btnSetting: ButtonSetting = new ButtonSetting();
            
            if(firstbtn == undefined && secondbtn == undefined)
                mentionBoxCtr.showMsgContent(background,titletext,titlebackground,contenttext);
            else if(secondbtn == undefined)
                mentionBoxCtr.showOneEventContent(background,titletext,titlebackground,contenttext,firstbtn);
            else
                mentionBoxCtr.showTwoEventContent(background,titletext,titlebackground,contenttext,firstbtn,secondbtn);
        });
        
        return mentionBoxCtr;
    }

    /**
     * 消除當前畫面中所有提示視窗
     */
    hideAllMessageBox(){
        let root = cc.find("Canvas");
        for (let i = 0; i < root.childrenCount; i++)
        {
            if (root.children[i].name === "DefaultMessageBox")
                root.children[i].destroy();
        }
    }

    /**
     * 新增結束程式事件監聽
     */
    addEscEvent()
    {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, (event)=>
        {
            //cc.vv.alert.show("提示","确定要退出游戏吗？",function(){
            //    cc.game.end();
            //},true);
            switch(event.keyCode){
                case cc.macro.KEY.enter:
                    break;
                case cc.macro.KEY.space:
                    break;
            }
        }, null);
    }
}
