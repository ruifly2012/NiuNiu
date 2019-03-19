import Global from "../Common/Global";


const {ccclass, property} = cc._decorator;

@ccclass
export default class HomeViewController extends cc.Component {

    @property(cc.Node)
    public loginMenu: cc.Node;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let self = this;
        //connect server when start
        Global.Instance.network.ConnectServer();

        // 換場景註冊
        Global.Instance.eventlistener.on("SwitchScene", function (SceneIndex) {
            switch(SceneIndex){
                case 0:
                    cc.log("login active");
                    self.loginMenu.active = false;
                    break;
                default:
                    cc.log("login hide");
                    self.loginMenu.active = true;
            }
            
        });

        // 一開始的場景
        Global.Instance.eventlistener.notify("SwitchScene", 0);

    }

    start () {
    
    }

    // update (dt) {}
}
