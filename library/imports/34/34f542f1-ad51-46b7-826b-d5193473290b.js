"use strict";
cc._RF.push(module, '34f54LxrVFGt4Jr1Rk0cykL', 'BtnListController');
// prefabs/UIControllers/BtnListController.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        List: {
            default: null,
            type: cc.Node
        },
        CloseArea: {
            default: null,
            type: cc.Node
        }
    },
    ExpandBtnList: function ExpandBtnList() {
        if (this.List.active == true) this.CloseBtnList();else {
            this.List.active = true;
            this.CloseArea.active = true;
        }
    },
    CloseBtnList: function CloseBtnList() {
        this.List.active = false;
        this.CloseArea.active = false;
    }
});

cc._RF.pop();