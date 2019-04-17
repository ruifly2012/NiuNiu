"use strict";
cc._RF.push(module, '41297a2XpBC9LIJFNuFxUTe', 'NetworkManager');
// Scripts/Network/NetworkManager.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("../Common/Global");
var NetworkManager = /** @class */ (function () {
    function NetworkManager() {
        //private serverURL:string = "http://140.118.175.76:5070/";
        this.serverURL = "http://60.251.26.6:8073/";
    }
    NetworkManager.prototype.ConnectServer = function () {
        cc.log("con server");
        this._socket = io.connect(this.serverURL, {
            reconnection: false
        });
        cc.log("connect success");
        var no = 6006;
        var data = { "oid": 1 };
        var json = {
            "no": no,
            "data": data
        };
        console.log("json:" + json);
        this._socket.emit("action", json, function (data) {
            console.log(data);
        });
        this.eventRegister();
    };
    ;
    NetworkManager.prototype.socket = function () { return this._socket; };
    NetworkManager.prototype.eventRegister = function () {
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
            console.log("action : " + data);
        });
        this._socket.on("response", function (data) {
            console.log("response : " + data);
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
    return NetworkManager;
}());
exports.default = NetworkManager;

cc._RF.pop();