import Game from "./Game";
import * as Define from "./Define";

export default class NetworkManager {
    
    private _socket;
    
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

    LogIn(oid: string, token:string){
        //log oid for after use
        Define.RoomInfo.Inst.game_option_id = Number(oid);

        let json= {
            "no" : Number(6006),
            "data" : token
        };
        this._socket.emit("action",json ,function(code,data){
            console.log("token callback : "+code + data);
            if(code == 200){
                Game.Inst.EventListener.notify("enterGame");
            }
            
        })

       
    }

    getGameTable(){
        let tableJson= {
            "no" : 6001,
            "data" : {"oid": Define.RoomInfo.Inst.game_option_id}//13: 2player
        };//2 player
        console.log("table req:"+tableJson); 
        this._socket.emit("action",tableJson ,function(errCode,message){
            console.log("table req callback: "+JSON.stringify(errCode) +"," + message);
        })
    }

    /**
     * 搶莊
     * @param rate 倍率
     */
    rob_bet(rate: number){
        let no:number = 6072;
        let json= {
            "no" : no,
            "data" : {
                "rob_bet" : rate
            }
        };
        this._socket.emit("action",json ,function(code,data){
            cc.log("code : " + code);
            if(code != 200) cc.warn("rob_bet error : " + data.error);
            else cc.log("rob_bet success");
        })
    }

    /**
     * 一般倍率下注
     * @param rate 倍率
     */
    place_bet(rate: number){
        let no:number = 6073;
        let json= {
            "no" : no,
            "data" : {
                "place_bet" : rate
            }
        };
        this._socket.emit("action",json ,function(code,data){
            cc.log("code : " + code);
            if(code != 200) cc.warn("place_bet error : " + data.error);
            else cc.log("place_bet success");
        })
    }

    eventRegister(){
        let self = this;

        this._socket.on("response", function (data) {
            console.log("response : " + JSON.stringify(data));
            if(data == 6001)  //get table success
                Game.Inst.EventListener.notify("SwitchScene", 1); 
            switch(data.no){   
                ///////stage info////////////
                case 6101://rob bet stage info
                    Game.Inst.EventListener.notify("startGame");
                    Game.Inst.EventListener.notify("RobBetInfo",data);
                    break;
                // case 6103://place bet stage info
                //     self.placeBetStageInfo(data);
                //     break;
                // case 6105:
                //     self.receiveCard(data);
                //     break;
                // //////bet///////////////    
                // case 6102:
                //     self.receiveRobBet(data);
                //     break;
                // case 6104:
                //     self.receivePlaceBet(data);
                //     break;
                // //////clock / stage change///////    
                // case 6107:
                //     cc.warn("change stage" + data.stage + "time:"+data.time);
                //     Game.Inst.EventListener.notify("stageChange", data.stage, data.time);
                //     break;
                default:
                break;
            }
        });
        

    }
    



    /**
     * 6101
     * @param data 
     */
    // receiveStageInfo(data){
    //     //stage info
    //     //room
    //     //data.room

    //     //get players data
    //     let playerCount = 2;
    //     let gameInfo: NN.GameInfo = NN.GameInfo.Inst;
    //     gameInfo.playerCount = playerCount;
    //     for (let index = 0; index < playerCount; index++) {
    //         gameInfo.players.push(new NN.Player());
    //     }
    //     gameInfo.players[0].uid = data.main_player.uid;
    //     gameInfo.players[0].money = data.main_player.coins;
    //     gameInfo.players[0].name = data.main_player.nickname;
    //     gameInfo.players[0].iconID = data.main_player.avatar;
        
    //     let playerIndex = 0;
    //     for (let _key in data.players) {
    //         playerIndex++;
    //         gameInfo.players[playerIndex].uid = data.players[_key].uid;
    //         gameInfo.players[playerIndex].money = data.players[_key].coins;
    //         gameInfo.players[playerIndex].name = data.players[_key].nickname;
    //         gameInfo.players[playerIndex].iconID = data.players[_key].avatar;
    //         gameInfo.players[playerIndex].vip = data.players[_key].vip;
    //     }

    //     PlayerController.Inst.init();
    //     PlayerController.Inst.updatePlayer();                        
    // }

    /**
     * 6103
     * @param data 
     */
    placeBetStageInfo(data){

    }

    /**
     * 6102
     * @param data 
     */
    // receiveRobBet(data){
    //     cc.warn("rcv :" + data.rob_bet);
    //     stageController.Inst.dealerTest(data.rob_bet);
    // }

    /**
     * 6103
     * @param data 
     */
    receivePlaceBet(data){

    }

    /**
     * 6107
     * @param data
     */
    receiveCard(data){

    }

}
