"use strict";

//全域變數 用於儲存客戶端的socket

var EventListener = function EventListener(obj) {

    var Register = {};

    //新增觸發事件name
    obj.on = function (name, method) {

        //若觸發事件名稱第一次使用初始新空間
        if (!Register.hasOwnProperty(name)) {
            Register[name] = [];
        }

        //將方法對應名稱儲存
        Register[name].push(method);
    };

    //引發事件name
    obj.fire = function (name) {

        if (Register.hasOwnProperty(name)) {

            //儲存所有對應的functions
            var handleList = Register[name];

            //依序run每個function
            for (var i = 0; i < handleList.length; i++) {

                var handler = handleList[i];
                var args = [];

                //用keyword arguments取得執行此function(fire)傳入的args
                //從1開始是因為arguments[0]為想要觸發事件的名稱(變數name),之後才開始為參數
                //console.log(arguments);
                for (var j = 1; j < arguments.length; j++) {
                    args.push(arguments[j]);
                }

                return handler.apply(handler, args);
            }
        }
    };

    return obj;
};

var global = {

    //T4 307
    // ServerURL: "http://140.118.175.76:3001/",

    //TR509
    ServerURL: "http://127.0.0.1:3000/",

    EventListener: EventListener({}),
    socket: null,
    uid: null,
    roomid: null,
    ButtonCounting: -1,
    ConnectServer: function ConnectServer() {
        this.socket = io(this.ServerURL, {
            reconnection: false
        });
    }

};