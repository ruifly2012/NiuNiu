"use strict";
cc._RF.push(module, '85b67Atl7FGRbR/UkiFamyG', 'OptionPageController');
// prefabs/UIControllers/OptionPageController.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    ExpandOptionPage: function ExpandOptionPage() {
        this.node.active = true;
    },
    CloseOptionPage: function CloseOptionPage() {
        this.node.active = false;
    }
});

cc._RF.pop();