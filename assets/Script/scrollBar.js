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
        oriY: 0

    },
    start() {
        this.bar.y = 300;
        this.oriY = this.bar.y;
    },
    onLoad() {
        this.bar.y = 300;
        this.oriY = this.bar.y;
        this.scrollview.node.on('scrolling', this.callback, this);
    },
    update() {
        if (this.scrollview.getScrollOffset().y < 5)
            this.bar.y = 300;
    },
    callback() {
        var offset = this.scrollview.getScrollOffset();

        if (this.oriY - this.back.height * ((offset.y) / this.content.height) * 2.3 < -340)
            this.bar.y = -340;
        else {
            this.bar.y = this.oriY - this.back.height * ((offset.y) / this.content.height) * 2.3;
        }
        cc.log("bar y position = ", this.bar.y);
        cc.log("offset.y = ", offset.y);


    },
});