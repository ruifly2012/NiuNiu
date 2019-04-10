"use strict";
cc._RF.push(module, 'f1b93zifZhEGJfbw/zJdWLp', 'scrollBar');
// prefabs/UIControllers/scrollBar.js

'use strict';

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
        }

    },
    start: function start() {
        this.bar.y = 350;
    },
    onLoad: function onLoad() {
        this.bar.y = 350;
        this.scrollview.node.on('scrolling', this.callback, this);
    },
    callback: function callback() {
        var offset = Math.floor(this.scrollview.getScrollOffset().y);
        var Max = this.scrollview.getMaxScrollOffset().y;
        var backHeight = this.back.height - 40;
        var newY = backHeight / 2 - offset / Max * backHeight;
        this.bar.y = newY;
    }
});

cc._RF.pop();