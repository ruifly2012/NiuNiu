"use strict";
cc._RF.push(module, 'ad93cEdi89ONaZpHgsCBu9+', 'HomeViewController');
// Scripts/Home/HomeViewController.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("../Common/Global");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var HomeViewController = /** @class */ (function (_super) {
    __extends(HomeViewController, _super);
    function HomeViewController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loginMenu = null;
        _this.message = null;
        _this.editBox = null;
        return _this;
    }
    HomeViewController.prototype.LoginbuttonClick = function (event, customData) {
        var self = this;
        //chek empty ID
        if (this.editBox.string.length === 0) {
            self.message.string = "Empty is not allowed";
            return;
        }
        //emit id to server
        Global_1.default.Instance.EventListener.notify("login", this.editBox.string);
        cc.log("click login");
    };
    HomeViewController.prototype.onLoad = function () {
        var self = this;
        cc.log("before con server");
        //connect server when start
        Global_1.default.Instance.network.ConnectServer();
        // 換場景註冊
        Global_1.default.Instance.EventListener.on("SwitchScene", function (event, SceneIndex) {
            cc.log("switch scene to" + SceneIndex);
            switch (SceneIndex) {
                case 0:
                    cc.log("login active");
                    self.loginMenu.active = true;
                    break;
                case 1:
                    cc.log("game active");
                    self.loginMenu.active = false;
                    break;
                default:
                    cc.log("login hide");
                    self.loginMenu.active = false;
            }
        });
        // start scene ==> login menu
        Global_1.default.Instance.EventListener.notify("SwitchScene", 0);
        Global_1.default.Instance.EventListener.on("login", function (event, uid) {
            Global_1.default.Instance.network.socket().emit("login", uid, function (Success) {
                if (Success) {
                    Global_1.default.Instance.uid = uid; // 代表global所儲存的是以本使用者的訊息為主軸，存入使用者填寫的名子
                    cc.log("globalID : %s", Global_1.default.Instance.uid);
                    Global_1.default.Instance.EventListener.notify("SwitchScene", 1); // 要windowsController換到遊戲場景
                }
                else {
                    cc.log("log fail");
                    self.message.string = "This name has been registered";
                }
            });
        });
    };
    __decorate([
        property(cc.Node)
    ], HomeViewController.prototype, "loginMenu", void 0);
    __decorate([
        property(cc.Label)
    ], HomeViewController.prototype, "message", void 0);
    __decorate([
        property(cc.EditBox)
    ], HomeViewController.prototype, "editBox", void 0);
    HomeViewController = __decorate([
        ccclass
    ], HomeViewController);
    return HomeViewController;
}(cc.Component));
exports.default = HomeViewController;

cc._RF.pop();