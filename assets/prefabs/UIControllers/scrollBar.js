cc.Class({
    extends: cc.Component,

    properties: {
        bar: {
            default: null,
            type: cc.Node
        },
        back: {
            default: null,
            type: cc.Node
        },
        scrollview: {
            default: null,
            type: cc.ScrollView
        },
        content: {
            default: null,
            type: cc.Node
        },

    },
    start() {
        this.bar.y = 350;
    },
    onLoad() {
        this.bar.y = 350;
        this.scrollview.node.on('scrolling', this.callback, this);
    },
    callback() {
        let offset = Math.floor(this.scrollview.getScrollOffset().y);
        var Max = this.scrollview.getMaxScrollOffset().y
        let backHeight = this.back.height - 40;
        let newY = backHeight / 2 - offset / Max * backHeight
        this.bar.y = newY
    },
});
