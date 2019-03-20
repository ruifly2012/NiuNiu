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

    }
    

}
