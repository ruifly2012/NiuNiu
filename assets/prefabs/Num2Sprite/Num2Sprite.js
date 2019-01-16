import { setTimeout, setInterval } from "timers";
// timers 是可下載的模組(人家寫好的)

cc.Class({
    extends: cc.Component,

    ctor: function () {
    },

    properties: {
        resourcedirectory: "",
    },

    UrlTable(char) {

        switch (char) {
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "0":
                return char;
            case "8":
                return "9";
            case "9":
                return "8";
            case ":":
                return "colon";
            case ",":
                return "comma";
            case ".":
                return "dot";
            case "-":
                return "hyphen";
        };
    },

    onLoad() {
        cc.loader.loadResDir(this.resourcedirectory, function (err, assets) { });
    },

    setNum: function (num, resourcedirectory = this.resourcedirectory) {

        var self = this;

        if (num == null) {
            self.node.removeAllChildren();
            return;
        }

        var resoureURLArray = [];
        var str = num;

        if (typeof (str) != "string")
            str = num.toString();

        cc.loader.loadRes(resourcedirectory, cc.SpriteAtlas, function (err, atlas) {

            self.node.removeAllChildren();

            // 程式化的在Money下加入新的節點，添加sprite組件，把相對應的美術圖片放入
            for (var i = 0; i < str.length; i++) {
                var newNode = new cc.Node();
                newNode.addComponent(cc.Sprite);
                newNode.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(self.UrlTable(str[i]));
                self.node.addChild(newNode);
            }

        });
    }
});
