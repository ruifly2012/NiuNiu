"use strict";
cc._RF.push(module, 'cd721NBRF9ODIFVuiBbToMJ', 'EventListener');
// Scripts/Common/EventListener.ts

Object.defineProperty(exports, "__esModule", { value: true });
var EventListener = /** @class */ (function () {
    function EventListener() {
        this._callbacks = [];
    }
    Object.defineProperty(EventListener.prototype, "length", {
        get: function () { return this._callbacks.length; },
        enumerable: true,
        configurable: true
    });
    EventListener.prototype.on = function (self, callback_func) {
        var check = this._callbacks.find(function (x) { return x.func == callback_func && x.owner == self; });
        if (check) {
            console.log('Bind Event Error!!');
            return;
        }
        var obj = { func: callback_func, owner: self };
        this._callbacks.push(obj);
    };
    EventListener.prototype.off = function (self, callback_func) {
        this._callbacks = this._callbacks.filter(function (x) {
            return !(x.func == callback_func && x.owner == self);
        });
    };
    EventListener.prototype.notify = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var tmp_callback = this._callbacks.filter(function (x) { return x.owner === args[0]; });
        tmp_callback.map(function (x) { x.func.bind(x.owner).apply(void 0, args); });
    };
    EventListener.prototype.clear = function () {
        this._callbacks = [];
    };
    return EventListener;
}());
exports.default = EventListener;

cc._RF.pop();