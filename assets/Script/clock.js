cc.Class({
    extends: cc.Component,

    ctor: function () {
        this.Obj = {
            time: null
        };
    },

    onLoad() {
        this.Obj.time = cc.find("time", this.node).getComponent("Num2Sprite");

    },


    settime: function (time) {
        this.Obj.time.setNum(time);
    }

});