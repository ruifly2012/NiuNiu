import Game from "../Game";
import Player from "./Player";
import { SpamMessageRespone } from "../MiscHelper";


const { ccclass, property } = cc._decorator;

@ccclass
export default class TalkMenuController extends cc.Component {
    @property(cc.Prefab) innerBtnPrefab: cc.Prefab = null;
    @property(cc.Node) mainPanel: cc.Node = null;
    @property(cc.Node) innerContentNode: cc.Node = null;
    @property(cc.ScrollView) scrollView: cc.ScrollView = null;
    @property(cc.Button) controlBtn: cc.Button = null;
    @property(Player) mainPlayer: Player = null;
    @property([Player]) otherPlayer: Player[] = [];

    flagIsOpen: boolean = false;
    interactableDuration: number = 4;

    onLoad() {
        this.initInnerContent();
        this.mainPanel.active = false;
        this.flagIsOpen = false;

        Game.Inst.EventListener.on("spam_message", (msg) => { this.receiveSpamMassage(msg); });
    }

    onDestroy() {
        Game.Inst.EventListener.off("spam_message");
    }

    private initInnerContent() {
        if (!Game.Inst.init) return;
        let btnString: string;
        let tempBtn: cc.Node;
        let btnHight: number = 130;
        let btnCount: number = 0;
        for (btnCount = 0; ; btnCount++) {
            btnString = "";
            btnString = Game.Inst.text.get("TalkMenu" + btnCount.toString());
            if (btnString == "") break;

            tempBtn = cc.instantiate(this.innerBtnPrefab);
            tempBtn.parent = this.innerContentNode;
            tempBtn.position = cc.v2(tempBtn.position.x, tempBtn.position.y - btnCount * btnHight);
            tempBtn.getChildByName("Label").getComponent(cc.Label).string = btnString;

            let event: cc.Component.EventHandler = new cc.Component.EventHandler();
            event.target = this.node;
            event.component = "TalkMenuController";
            event.handler = "talk";
            event.customEventData = btnCount.toString();
            tempBtn.getComponent(cc.Button).clickEvents.push(event);
        }
        this.innerContentNode.setContentSize(this.innerContentNode.getContentSize().width, btnHight * btnCount);
        // for(let i = 0;i < this.testList.length;i++){
        //     tempBtn = cc.instantiate(this.innerBtnPrefab);
        //     tempBtn.parent = this.innerContentNode;
        //     tempBtn.position = cc.v2(tempBtn.position.x,tempBtn.position.y - i * btnHight);
        //     tempBtn.getChildByName("Label").getComponent(cc.Label).string = this.testList[i];
        // }
        // this.innerContentNode.setContentSize(this.innerContentNode.getContentSize().width,btnHight * this.testList.length);
        // cc.log(this.innerContentNode.getContentSize());
    }

    controlPanel() {
        if (this.flagIsOpen) {
            this.close();
        }
        else {
            this.open();
        }
    }

    enable(){
        this.controlBtn.interactable = true;
    }

    disable(){
        this.close();
        this.controlBtn.interactable = false;
    }

    private open() {
        this.flagIsOpen = true;
        this.scrollView.scrollToTop();
        this.mainPanel.active = true;
    }
    private close() {
        this.flagIsOpen = false;
        this.mainPanel.active = false;
    }

    talk(event, customEventData) {
        this.disable();

        this.mainPlayer.talk(Number(customEventData));
        let data = { "event": "spam_message", "message_index": Number(customEventData) };
        Game.Inst.networkMgr.sendMessage(JSON.stringify(data));

        this.scheduleOnce(() => {
            this.enable();
        }, this.interactableDuration);
    }

    receiveSpamMassage(msg: SpamMessageRespone) {
        cc.warn("receiveUpdate interface example: ");
        cc.log(msg);

        for (let i = 0; i < this.otherPlayer.length; i++) {
            if (this.otherPlayer[i].getUID() == msg.speaker_uid) {
                this.otherPlayer[i].talk(msg.message_index);
                break;
            }
        }
    }
}
