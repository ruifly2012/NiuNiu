cc.Class({

    extends: cc.Component,


    ctor: function () {
        this.roomInfo = {
            id: null
        };
        this.RoomObj = {

        };
        this.autoPlaying = null;
    },

    properties: {

    },


    /*initObj() {

        this.RoomObj = {
            odds: cc.find("Point/Odds", this.node).getChildren()[0],
            playerPoint: cc.find("Point/playerPoint", this.node).getChildren()[0],
            currentOdds: cc.find("Point/currentOdds", this.node).getChildren()[0],
        };

    },*/

    onLoad() {
        var self = this;

        //this.initObj();

        global.socket.on("roomInfo", function (Info) {
            self.roomInfo = Info;
            global.roomid = Info.roomid;
            //self.UpdateRoom(Info);
        });
        // 等待server回應
    },


    UpdateRoom(roomInfo) {

        //this.RoomObj.playerPoint.getComponent("Num2Sprite").setNum(roomInfo.playerPoint);
        //this.RoomObj.currentOdds.getComponent("Num2Sprite").setNum(roomInfo.currentOdds);
        //this.RoomObj.odds.getComponent("Num2Sprite").setNum(roomInfo.odds);
    }




});
