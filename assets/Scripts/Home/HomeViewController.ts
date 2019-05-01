import global from "../Common/Global";


const {ccclass, property} = cc._decorator;

@ccclass
export default class HomeViewController extends cc.Component {

    @property(cc.Node)
    loginMenu: cc.Node = null;

    @property(cc.Node)
    playGround: cc.Node = null;

    @property(cc.Label)
    public message: cc.Label = null;

    @property(cc.EditBox)
    public editBox: cc.EditBox = null;

    
    LoginbuttonClick(event, customData) {
        var self = this;

        //chek empty ID
        if (this.editBox.string.length === 0) {
            self.message.string = "Empty is not allowed";
            return;
        }

        //emit id to server
        //global.Instance.EventListener.notify("login", this.editBox.string);


        cc.log("click login");
        global.Instance.network.LogIn(this.editBox.string);

    }

    onLoad () {
        let self = this;
        //hide all
        this.loginMenu.active = false;
        this.playGround.active = false;
        //connect server when start
        global.Instance.network.ConnectServer();


        // 換場景註冊
        global.Instance.EventListener.on("SwitchScene", function (event,SceneIndex) {
            cc.log("switch scene to" + SceneIndex);
            switch(SceneIndex){
                case 0:
                    cc.log("[switch scene] login active");
                    self.loginMenu.active = true;
                    self.playGround.active = false;
                    break;
                case 1:
                    cc.log("[switch scene] game active");
                    self.loginMenu.active = false;
                    self.playGround.active = true;
                    break;
                default:
                    cc.log("[switch scene] WTF?");
                    break;
            }
            
        });

        // start scene ==> login menu
        global.Instance.EventListener.notify("SwitchScene", 0);

        /*
        global.Instance.EventListener.on("login", function (event,uid) { 
            global.Instance.network.socket().emit("login", uid, function (Success) { // 按了login，只是換到遊戲場景
                if (Success) {
                    global.Instance.uid = uid; // 代表global所儲存的是以本使用者的訊息為主軸，存入使用者填寫的名子
					cc.log("globalID : %s",global.Instance.uid);
                    global.Instance.EventListener.notify("SwitchScene", 1); // 要windowsController換到遊戲場景
                }
                else {
					cc.log("log fail");
                    self.message.string = "This name has been registered";
                }
            });
        });
        */
    }
}
