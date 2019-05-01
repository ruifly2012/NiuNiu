import global from "../Common/Global";
import * as NN from "../NNDefine";
import PlayerInfoViewController from "../Home/Player/PlayerInfoViewController"

export default class NetworkManager {
    
    private _socket;
    //private serverURL:string = "http://140.118.175.76:5070/";
    private serverURL:string = "http://60.251.26.6:8073/";
    
    private self = this;

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
        let self = this;
        let no:number = 6006;
        let json= {
            "no" : no,
            "data" : token
        };
        //console.log("token Reg : "+ token);
        this._socket.emit("action",json ,function(data){
            console.log("token callback : "+JSON.stringify(data));
            //req table after token register finish
            let tableJson= {
                "no" : 6001,
                "data" : {"oid": 13}
            };//2 player
            console.log("table req:"+tableJson); 
            self._socket.emit("action",tableJson ,function(errCode,message){
                console.log("table req callback: "+JSON.stringify(errCode) +"," + message);
            })
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
            console.log("action : " + JSON.stringify(data));
        });

        this._socket.on("response", function (data) {
            console.log("response : " + JSON.stringify(data));
            if(data == 6001)  //get table success
                global.Instance.EventListener.notify("SwitchScene", 1); 
            switch(data.no){    
                case 6101:
                    //stage info
                    
                    //room
                    //data.room

                    //get players data
                    let playerCount = 4;
                    let gameInfo: NN.GameInfo = NN.GameInfo.Inst;
                    gameInfo.playerCount = playerCount;
                    for (let index = 0; index < playerCount; index++) {
                        gameInfo.players.push(new NN.Player());
                    }
                    gameInfo.players[0].uid = data.main_player.uid;
                    gameInfo.players[0].money = data.main_player.coins;
                    gameInfo.players[0].name = data.main_player.nickname;
                    PlayerInfoViewController.Inst.init();
                    PlayerInfoViewController.Inst.updatePlayer();
                    break;
                case 6107:
                    global.Instance.EventListener.notify("stageChange", data.stage, data.time);
                    cc.warn("change stage" + data.stage + "time:"+data.time);
                    break;
                default:
                break;
            }
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
