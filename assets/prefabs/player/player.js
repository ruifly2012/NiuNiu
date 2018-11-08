cc.Class({
    extends: cc.Component,

    ctor: function () {
        this.Obj= { // include name/img/money
            name: null
        };
        this.Info = { // name only
            name:null
        };
    },


    onLoad() {
        var self = this;
        //初始化，找到name/img/money的位址
        this.Obj.name = cc.find("nameandcoin/name", this.node).getComponent(cc.Label);
        this.Obj.img = cc.find("pic", this.node).getComponent(cc.Sprite);
        this.Obj.money = cc.find("nameandcoin/Money", this.node).getComponent("Num2Sprite");
        this.node.active = false;
    },

    setName: function (name) {

        if (name == '') {
            this.node.active = false;
        } else {
            this.node.active = true;
        }

        this.Info.name = name;
        this.Obj.name.string = name;
    },

    setImg: function (Img) {

        this.Obj.img.spriteFrame = Img;
    },

    setCoin: function (coin) {
        this.Obj.money.setNum(coin); // 呼叫Num2Sprite的函式
    }


});
