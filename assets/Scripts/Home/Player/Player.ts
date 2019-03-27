
const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    private Obj: any = { // include name/img/money
        name: null
    }
    private Info: any = { // name only
        name:null
    }

    onLoad() {
        var self = this;
        //初始化，找到name/img/money的位址
        this.Obj.name = cc.find("nameandcoin/name", this.node).getComponent(cc.Label);
        this.Obj.img = cc.find("pic", this.node).getComponent(cc.Sprite);
        this.Obj.money = cc.find("nameandcoin/Money", this.node).getComponent("Num2Sprite");
        this.node.active = false;
    }

    setName(name) {

        if (name == '') {
            this.node.active = false;
        } else {
            this.node.active = true;
        }

        this.Info.name = name;
        this.Obj.name.string = name;
    }

    setImg(Img) {

        this.Obj.img.spriteFrame = Img;
    }

    setCoin(coin) {
        this.Obj.money.setNum(coin); // 呼叫Num2Sprite的函式
    }

}
