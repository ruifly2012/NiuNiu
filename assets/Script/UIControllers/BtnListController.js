cc.Class({
    extends: cc.Component,

    properties: {
        List: {
            default: null,
            type: cc.Node,
        },
        CloseArea: {
            default: null,
            type: cc.Node,
        }
    },
    ExpandBtnList() {
        if (this.List.active == true)
            this.CloseBtnList();
        else {
            this.List.active = true;
            this.CloseArea.active = true;
        }
    },
    CloseBtnList() {
        this.List.active = false;
        this.CloseArea.active = false;
    }
});
