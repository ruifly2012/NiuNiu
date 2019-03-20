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

    properties: {
        Scenes: {

            default: [],
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let self = this;


        //連上伺服器
        global.ConnectServer();

        // 換場景註冊
        global.EventListener.on("SwitchScene", function (SceneIndex) {

            if (SceneIndex === 0)
                self.Scenes[0].active = true;
            else
                self.Scenes[0].active = false;
        });

        // 從伺服器傳來的資料取得換場景訊息(on 是開著等他丟資料的意思)
        global.socket.on("SwitchScene", function (SceneIndex) {
            global.EventListener.fire("SwitchScene", SceneIndex);
        });

        // 一開始的場景
        global.EventListener.fire("SwitchScene", 0);


    }



});
