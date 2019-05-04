import Game from "../Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MobileStatus extends cc.Component {

    @property(cc.Sprite) wifi: cc.Sprite = null;
    @property(cc.Sprite) powerBg: cc.Sprite = null;
    @property(cc.Sprite) powerShow: cc.Sprite = null;
    @property(cc.Label) date: cc.Label = null;
    @property(Number) lowPower: number = 15;

    lastWifiSetting: number = 0;
    flagPowerIsLow: boolean = false;

    onLoad() {
        // if(cc.sys.isMobile){
        //     this.node.active = true;
        // }
        // else{
        //     this.node.active = false;
        // }

        this.init();
    }

    init() {
        this.flagPowerIsLow = true;
        this.lastWifiSetting = 0;

        //wifi
        this.updateWifi();
        //power
        this.updatePower();
        //date
        this.updateDate();

        // this.schedule(() => {
        //     this.updatePower();
        //     this.updateWifi();
        // }, 1);
    }

    update() {
        this.updateDate();
        this.updatePower();
        this.updateWifi();
    }

    updateDate() {
        let nowDate = new Date();
        this.date.string = nowDate.getHours() + ":" + nowDate.getMinutes();
    }

    updateWifi() {
        let nowWifi: number = 3;
        if (this.lastWifiSetting != nowWifi) {
            switch (nowWifi) {
                case 0: this.wifi.spriteFrame = Game.Inst.resourcesMgr.load("WIFI_None"); break;
                case 1: this.wifi.spriteFrame = Game.Inst.resourcesMgr.load("WIFI_0"); break;
                case 2: this.wifi.spriteFrame = Game.Inst.resourcesMgr.load("WIFI_1"); break;
                case 3: this.wifi.spriteFrame = Game.Inst.resourcesMgr.load("WIFI_2"); break;
                case 4: this.wifi.spriteFrame = Game.Inst.resourcesMgr.load("WIFI_3"); break;
            }
            this.lastWifiSetting = nowWifi;
        }
    }

    updatePower() {
        let nowPower: number = 50;

        if (nowPower <= this.lowPower && !this.flagPowerIsLow) {
            this.powerBg.spriteFrame = Game.Inst.resourcesMgr.load("NonPowerBg");
            this.powerShow.spriteFrame = Game.Inst.resourcesMgr.load("NonPowerShow");
            this.flagPowerIsLow = true;
        }
        if (nowPower > this.lowPower && this.flagPowerIsLow) {
            this.powerBg.spriteFrame = Game.Inst.resourcesMgr.load("HavePowerBg");
            this.powerShow.spriteFrame = Game.Inst.resourcesMgr.load("HavePowerShow");
            this.flagPowerIsLow = false;
        }

        this.powerShow.node.scaleX = nowPower / 100;
    }
}
