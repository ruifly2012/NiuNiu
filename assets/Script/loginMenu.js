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

    //constructor:
    ctor: function(){
        this.warning = null;
    },

    properties: {

        //輸入使用者名稱的視窗
        edit_box: {
            default: null,
            type: cc.EditBox
        },

        //顯示錯誤訊息的label
        Message: {
            default: null,
            type: cc.Label
        },

    },

    //login的按鈕被按下時觸發
    LoginbuttonClick(event, customData) {

        //將gameController的this關鍵字儲存,讓下方functions可調用到this.Message
        var self = this;

        //檢查使用者輸入的名子是否為空白
        if (this.edit_box.string.length === 0) {
            self.Message.string = "Empty is not allowed";
            return;
        }

        //觸發login事件(在onLoad()中註冊),發送uid(使用者輸入的名子)給server
        global.EventListener.fire("login", this.edit_box.string);
		cc.log("click login");

    },
    onLoad() { // 一開始就做的動作，初始化一些東西，這裡註冊了login的
        var self = this;
        //創立接收login事件
        global.EventListener.on("login", function (uid) { // uid 是使用者輸入的名子
            //將user ID 傳給伺服器端
            global.socket.emit("login", uid, function (Success) {

                if (Success) {
                    global.uid = uid; // 代表global所儲存的是以本使用者的訊息為主軸，存入使用者填寫的名子
					cc.log("globalID : %s",global.uid);
                    global.EventListener.fire("SwitchScene", 1); // 要windowsController換到遊戲場景
                    global.socket.emit('LoadGame', global.uid); // 要伺服器給遊戲場景的各個資訊
                }
                else {
					cc.log("log fail");
                    self.Message.string = "This name has been registered";
                }
            });
        });
    }
});
