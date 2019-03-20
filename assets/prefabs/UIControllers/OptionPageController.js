cc.Class({
    extends: cc.Component,

    properties: {

    },

    ExpandOptionPage(){
        this.node.active = true;
    },
    CloseOptionPage(){
        this.node.active = false;
    }
});
