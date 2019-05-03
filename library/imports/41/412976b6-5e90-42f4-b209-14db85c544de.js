"use strict";
cc._RF.push(module, '41297a2XpBC9LIJFNuFxUTe', 'NetworkManager');
// Scripts/Network/NetworkManager.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("../Common/Global");
var NN = require("../NNDefine");
var PlayerInfoViewController_1 = require("../Home/Player/PlayerInfoViewController");
var NetworkManager = /** @class */ (function () {
    function NetworkManager() {
        //private serverURL:string = "http://140.118.175.76:5070/";
        this.serverURL = "http://60.251.26.6:8073/";
        this.self = this;
    }
    NetworkManager.prototype.ConnectServer = function () {
        cc.log("con server");
        this._socket = io.connect(this.serverURL, {
            reconnection: false
        });
        cc.log("connect success");
        this.eventRegister();
    };
    ;
    NetworkManager.prototype.socket = function () { return this._socket; };
    NetworkManager.prototype.LogIn = function (token) {
        var self = this;
        var no = 6006;
        var json = {
            "no": no,
            "data": token
        };
        //console.log("token Reg : "+ token);
        this._socket.emit("action", json, function (data) {
            console.log("token callback : " + JSON.stringify(data));
            //req table after token register finish
            var tableJson = {
                "no": 6001,
                "data": { "oid": 13 }
            }; //2 player
            console.log("table req:" + tableJson);
            self._socket.emit("action", tableJson, function (errCode, message) {
                console.log("table req callback: " + JSON.stringify(errCode) + "," + message);
            });
        });
    };
    /**
     * 搶莊
     * @param rate 倍率
     */
    NetworkManager.prototype.rob_bet = function (rate) {
        var no = 6072;
        var json = {
            "no": no,
            "data": {
                "rob_bet": rate
            }
        };
        this._socket.emit("action", json, function (code, data) {
            cc.log("code : " + code);
            if (code != 200)
                cc.warn("rob_bet error : " + data.error);
            else
                cc.log("rob_bet success");
        });
    };
    /**
     * 一般倍率下注
     * @param rate 倍率
     */
    NetworkManager.prototype.place_bet = function (rate) {
        var no = 6073;
        var json = {
            "no": no,
            "data": {
                "place_bet": rate
            }
        };
        this._socket.emit("action", json, function (code, data) {
            cc.log("code : " + code);
            if (code != 200)
                cc.warn("place_bet error : " + data.error);
            else
                cc.log("place_bet success");
        });
    };
    NetworkManager.prototype.eventRegister = function () {
        var self = this;
        //socket event listener
        this._socket.on("SwitchScene", function (SceneIndex) {
            //cc.log("get switch scene req");
            Global_1.default.Instance.EventListener.notify("SwitchScene", SceneIndex);
        });
        this._socket.on("roomReady", function (Info) {
            //cc.log("network get : ", Info);
            Global_1.default.Instance.EventListener.notify("roomReady", Info);
        });
        this._socket.on("stageChange", function (stage, timeout) {
            Global_1.default.Instance.EventListener.notify("stageChange", stage, timeout);
        });
        this._socket.on("stageChange", function (stage, timeout) {
            Global_1.default.Instance.EventListener.notify("stageChange", stage, timeout);
        });
        this._socket.on("action", function (data) {
            console.log("action : " + JSON.stringify(data));
        });
        this._socket.on("response", function (data) {
            console.log("response : " + JSON.stringify(data));
            if (data == 6001) //get table success
                Global_1.default.Instance.EventListener.notify("SwitchScene", 1);
            switch (data.no) {
                ///////stage info////////////
                case 6101: //rob bet stage info
                    self.receiveStageInfo(data);
                    break;
                case 6103: //place bet stage info
                    self.placeBetStageInfo(data);
                    break;
                case 6107:
                    self.receiveCard(data);
                    break;
                //////bet///////////////    
                case 6102:
                    self.receiveRobBet(data);
                    break;
                case 6104:
                    self.receivePlaceBet(data);
                    break;
                //////clock / stage change///////    
                case 6107:
                    Global_1.default.Instance.EventListener.notify("stageChange", data.stage, data.time);
                    cc.warn("change stage" + data.stage + "time:" + data.time);
                    break;
                default:
                    break;
            }
        });
        this._socket.on("kingsRate", function (Info) {
            //cc.log("Network get kingsRate");
            Global_1.default.Instance.EventListener.notify("kingsRate", Info);
        });
        this._socket.on("playersRate", function (Info) {
            //cc.log("Network get playersRate");
            Global_1.default.Instance.EventListener.notify("playersRate", Info);
        });
        this._socket.on("myCard", function (Info) {
            Global_1.default.Instance.EventListener.notify("myCard", Info);
        });
        this._socket.on("eachPlayerCard", function (Info) {
            Global_1.default.Instance.EventListener.notify("eachPlayerCard", Info);
        });
        this._socket.on("pokerAnimation", function (Info) {
            Global_1.default.Instance.EventListener.notify("pokerAnimation", Info);
        });
        this._socket.on("Animation", function (animationName) {
            Global_1.default.Instance.EventListener.notify("Animation", animationName);
        });
        this._socket.on("moneyFlow", function (Info) {
            Global_1.default.Instance.EventListener.notify("moneyFlow", Info);
        });
    };
    /**
     * 6101
     * @param data
     */
    NetworkManager.prototype.receiveStageInfo = function (data) {
        //stage info
        //room
        //data.room
        //get players data
        var playerCount = 2;
        var gameInfo = NN.GameInfo.Inst;
        gameInfo.playerCount = playerCount;
        for (var index = 0; index < playerCount; index++) {
            gameInfo.players.push(new NN.Player());
        }
        gameInfo.players[0].uid = data.main_player.uid;
        gameInfo.players[0].money = data.main_player.coins;
        gameInfo.players[0].name = data.main_player.nickname;
        gameInfo.players[0].iconID = data.main_player.avatar;
        var playerIndex = 0;
        for (var _key in data.players) {
            playerIndex++;
            gameInfo.players[playerIndex].uid = data.players[_key].uid;
            gameInfo.players[playerIndex].money = data.players[_key].coins;
            gameInfo.players[playerIndex].name = data.players[_key].nickname;
            gameInfo.players[playerIndex].iconID = data.players[_key].avatar;
            gameInfo.players[playerIndex].vip = data.players[_key].vip;
        }
        PlayerInfoViewController_1.default.Inst.init();
        PlayerInfoViewController_1.default.Inst.updatePlayer();
    };
    /**
     * 6103
     * @param data
     */
    NetworkManager.prototype.placeBetStageInfo = function (data) {
    };
    /**
     * 6102
     * @param data
     */
    NetworkManager.prototype.receiveRobBet = function (data) {
    };
    /**
     * 6103
     * @param data
     */
    NetworkManager.prototype.receivePlaceBet = function (data) {
    };
    /**
     * 6107
     * @param data
     */
    NetworkManager.prototype.receiveCard = function (data) {
    };
    return NetworkManager;
}());
exports.default = NetworkManager;

cc._RF.pop();