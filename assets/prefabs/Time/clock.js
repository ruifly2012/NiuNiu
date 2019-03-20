cc.Class({
    extends: cc.Component,

    ctor: function () {
        this.Obj = {
            time: null,
            time2: null
        };
    },

    onLoad() {
        this.Obj.time = cc.find("time", this.node).getComponent("Num2Sprite");
        this.Obj.time2 = cc.find("time2", this.node).getComponent("Num2Sprite");
    },


    settime: function (time, timer) {
        if(time.toString().length == 2){
            timer.Obj.time2.active = true;
            timer.Obj.time.active = false;
            this.Obj.time2.setNum(time);
        }
        else{
            timer.Obj.time2.active = false;
            timer.Obj.time.active = true;
            this.Obj.time.setNum(time);
        }
    }

});