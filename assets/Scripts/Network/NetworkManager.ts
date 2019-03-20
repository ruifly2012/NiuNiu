import global from "../Common/Global";

export default class NetworkManager {
    
    private _socket;
    private serverURL:string = "http://127.0.0.1:5070/";

    ConnectServer() {
        cc.log("con server");
        this._socket = io.connect(this.serverURL, {
            reconnection: false
        });
        cc.log("connect success");
        this.eventRegister();
    };

    socket(){ return this._socket; }

    eventRegister(){
        //socket event listener
        this._socket.on("SwitchScene", function (SceneIndex) {
            cc.log("get switch scene req");
            global.Instance.EventListener.notify("SwitchScene", SceneIndex);
        });

        this._socket.on("roomReady", function (Info) {
            cc.log("network get : ", Info);
            global.Instance.EventListener.notify("roomReady", Info);
        });

        this._socket.on("stageChange", function (stage, timeout) {
            global.Instance.EventListener.notify("stageChange", stage, timeout);
        });

        this._socket.on("kingsRate", function (Info) {
            cc.log("Network get kingsRate");
            global.Instance.EventListener.notify("kingsRate", Info);
        });

        this._socket.on("playersRate", function (Info) {
            cc.log("Network get playersRate");
            global.Instance.EventListener.notify("playersRate", Info);
        });
        this._socket.on("myCard", function (Info) {
            //將牌更新
            global.Instance.EventListener.notify("myCard", Info);

        });
        this._socket.on("eachPlayerCard", function (Info) {
            //將牌更新
            global.Instance.EventListener.notify("eachPlayerCard", Info);

        });
        this._socket.on("pokerAnimation", function (Info) {
            global.Instance.EventListener.notify("pokerAnimation", Info);
        });
        /*this._socket.on("Animation", function (animationName) {
            global.Instance.EventListener.notify("Animation", animationName);
        });*/
    }
    

}
