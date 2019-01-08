// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    ctor:function(){ // 要讓他能.active，驗先用constructor(reference by playerInfo)
        this.button = null;
    },

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.button = cc.find("button", this.node);
    },

    start () {

    },

    threeButtonClick(){
        global.socket.emit("playerRate", global.uid, 3);
        this.button.active = false;
		cc.log("3bet");
        //global.EventListener.fire("dealerButton", 0);
    },
    sixButtonClick(){
        global.socket.emit("playerRate", global.uid, 6);
        this.button.active = false;
		cc.log("6bet");
        //global.EventListener.fire("dealerButton", 1);
    },
    nineButtonClick(){
        global.socket.emit("playerRate", global.uid, 9);
		cc.log("9bet");
        this.button.active = false;
        //global.EventListener.fire("dealerButton", 2);
    },
    twelveButtonClick(){
        global.socket.emit("playerRate", global.uid, 12);
		cc.log("12bet");
        this.button.active = false;
        //global.EventListener.fire("dealerButton", 3);
    },
    fifteenButtonClick(){
        global.socket.emit("playerRate", global.uid, 15);
		cc.log("15bet");
        this.button.active = false;
        //global.EventListener.fire("dealerButton", 3);
    },
    // update (dt) {},
});
