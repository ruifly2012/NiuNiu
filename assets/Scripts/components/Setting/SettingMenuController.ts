import Game from "../../Game";
import MenuBase from "./MenuBase";

const { ccclass, property } = cc._decorator;

export enum SettingMenuType {
    None = 0,
    Option,
    History,
    Help
}

@ccclass
export default class SettingMenuController extends cc.Component {

    @property(cc.Node) mainPanel: cc.Node = null;
    @property(cc.Button) controlBtn: cc.Button = null;
    @property([MenuBase]) menus: MenuBase[] = [];


    flagIsOpen: boolean = false;
    menuType: SettingMenuType = SettingMenuType.None;

    onLoad() {
        this.init();
    }

    init() {
        this.close();
        this.menuType = SettingMenuType.None;

        for(let i = 0;i < this.menus.length;i++){
            this.menus[i].close();
        }
    }

    controlPanel() {
        if (this.flagIsOpen) {
            this.close();
        }
        else {
            this.open();
        }
    }

    enable() {
        this.controlBtn.interactable = true;
    }
    disable() {
        this.close();
        this.controlBtn.interactable = false;
    }

    private open() {
        this.flagIsOpen = true;
        this.mainPanel.active = true;
    }
    private close() {
        this.flagIsOpen = false;
        this.mainPanel.active = false;
    }

    openMenu(event, customEventData) {
        this.disable();
        this.menuType = Number(customEventData) as SettingMenuType;

        this.menus[this.menuType - 1].open();
    }

    closeMenu(){
        this.menus[this.menuType - 1].close();

        this.menuType = SettingMenuType.None;
        this.enable();
    }
}
