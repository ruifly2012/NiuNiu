

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIRoomInfo extends cc.Component {
    @property(cc.Node) roomInfoRoot: cc.Node = null;
    @property(cc.Label) roomInfo: cc.Label = null;
    @property(cc.Label) roomName: cc.Label = null;
    @property(cc.Label) antes: cc.Label = null;

    onLoad(){
        this.init();
    }

    init(){
        this.roomInfo.string = ":0000000";
        this.roomName.string = "a";
        this.antes.string = "50";
        this.setVisible();
    }

    setVisible(visible: boolean = false){
        if(visible) this.roomInfoRoot.opacity = 255;
        else this.roomInfoRoot.opacity = 0;
    }

    setRoomInfo(info: string){
        this.roomInfo.string = ":" + info;
    }

    setRoomName(name: string){
        this.roomName.string = name;
    }

    setAntes(amount: number){
        this.antes.string = ":" + amount.toString();
    }
}
