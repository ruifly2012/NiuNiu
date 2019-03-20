import global from "../Common/Global";


const {ccclass, property} = cc._decorator;

@ccclass
export default class HomeViewController extends cc.Component {

    @property(cc.Node)
    public loginMenu: cc.Node = null;

    @property(cc.Label)
    public message: cc.Label = null;

    @property(cc.EditBox)
    public editBox: cc.EditBox = null;

    
    LoginbuttonClick(event, customData) {

        //將gameController的this關鍵字儲存,讓下方functions可調用到this.Message
        var self = this;

        //檢查使用者輸入的名子是否為空白
        if (this.editBox.string.length === 0) {
            self.message.string = "Empty is not allowed";
            return;
        }

        //觸發login事件(在onLoad()中註冊),發送uid(使用者輸入的名子)給server
        global.Instance.EventListener.notify("login", this.editBox.string);
		cc.log("click login");

    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let self = this;
        //connect server when start
        global.Instance.network.ConnectServer();

        // 換場景註冊
        global.Instance.EventListener.on("SwitchScene", function (name,SceneIndex) {
            cc.log("switch scene to" + SceneIndex);
            switch(SceneIndex){
                case 0:
                    cc.log("login active");
                    self.loginMenu.active = true;
                    break;
                default:
                    cc.log("login hide");
                    self.loginMenu.active = false;
            }
            
        });

        // 一開始的場景
        global.Instance.EventListener.notify("SwitchScene", 0);

        global.Instance.EventListener.on("login", function (name,uid) { // uid 是使用者輸入的名子
            //將user ID 傳給伺服器端
            cc.log("emit");
            global.Instance.network.socket().emit("login", uid, function (Success) { // 按了login，只是換到遊戲場景
                cc.log("login callback");
                if (Success) {
                    global.Instance.uid = uid; // 代表global所儲存的是以本使用者的訊息為主軸，存入使用者填寫的名子
					cc.log("globalID : %s",global.Instance.uid);
                    global.Instance.EventListener.notify("SwitchScene", 1); // 要windowsController換到遊戲場景
                    //global.socket.emit('LoadGame', global.uid); // 要伺服器給遊戲場景的各個資訊
                }
                else {
					cc.log("log fail");
                    self.message.string = "This name has been registered";
                }
            });
        });

    }

    start () {
    
    }

    // update (dt) {}
}
