import global from "../Common/Global";

export default class NetworkManager {
    
    private _socket;
    //private serverURL:string = "http://140.118.175.76:5070/";
    private serverURL:string = "http://60.251.26.6:8073/";
    

    ConnectServer() {
        cc.log("con server");
        this._socket = io.connect(this.serverURL, {
            reconnection: false
        });
        cc.log("connect success");
        this.eventRegister();
    };

    socket(){ return this._socket; }

    LogIn(token:string){
        let no:number = 6006;
        let json= {
            "no" : no,
            "data" : token
        };
        console.log("token Reg : "+ token);
        this._socket.emit("action",json ,function(data){
            console.log("token callback : "+data);
        })

        let tableJson= {
            "no" : 6001,
            "data" : {"oid": 1}
        };
        console.log("table req:"+tableJson); 
        this._socket.emit("action",JSON.stringify(tableJson) ,function(data){
            console.log("table req callback: "+data);
        })
    }

    eventRegister(){
        //socket event listener
        this._socket.on("SwitchScene", function (SceneIndex) {
            //cc.log("get switch scene req");
            global.Instance.EventListener.notify("SwitchScene", SceneIndex);
        });

        this._socket.on("roomReady", function (Info) {
            //cc.log("network get : ", Info);
            global.Instance.EventListener.notify("roomReady", Info);
        });

        this._socket.on("stageChange", function (stage, timeout) {
            global.Instance.EventListener.notify("stageChange", stage, timeout);
        });

        this._socket.on("stageChange", function (stage, timeout) {
            global.Instance.EventListener.notify("stageChange", stage, timeout);
        });

        this._socket.on("action", function (data) {
            console.log("action : " + data);
        });

        this._socket.on("response", function (data) {
            console.log("response : " + data);
        });

        this._socket.on("kingsRate", function (Info) {
            //cc.log("Network get kingsRate");
            global.Instance.EventListener.notify("kingsRate", Info);
        });

        this._socket.on("playersRate", function (Info) {
            //cc.log("Network get playersRate");
            global.Instance.EventListener.notify("playersRate", Info);
        });
        this._socket.on("myCard", function (Info) {
            global.Instance.EventListener.notify("myCard", Info);

        });
        this._socket.on("eachPlayerCard", function (Info) {
            global.Instance.EventListener.notify("eachPlayerCard", Info);

        });
        this._socket.on("pokerAnimation", function (Info) {
            global.Instance.EventListener.notify("pokerAnimation", Info);
        });

        this._socket.on("Animation", function (animationName) {
            global.Instance.EventListener.notify("Animation", animationName);
        });

        this._socket.on("moneyFlow", function (Info) {
            global.Instance.EventListener.notify("moneyFlow", Info);
        });
        

    }
    

}
