cc.Class({
    extends: cc.Component,

    properties: {
        TalkMenu: {
            default: null,
            type: cc.Node,
        },
        TalkMenuOpenBtn: {
            default: null,
            type: cc.Button
        },
        TalkMenuCloseBtn: {
            default: null,
            type: cc.Button
        },
        isOpened: false,
        content: cc.Node,
        Me: cc.Node,
        Next: cc.Node,
        Pre: cc.Node,
        NextNext: cc.Node,
        PrePre: cc.Node,
        nextCounter: -1,
        PreCounter: -1,
        nextNextCounter: -1,
        PrePreCounter: -1,
    },
    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },
    openMenu() {
        if (this.isOpened == true)
            this.closeMenu();
        else {
            this.TalkMenu.active = true;
            //this.TalkMenuCloseBtn.active = true;
            this.isOpened = true;
        }
    },
    closeMenu() {
        this.TalkMenu.active = false;
        //this.TalkMenuCloseBtn.active = false;
        this.isOpened = false;
    },
    Talk(event, customEventData) {
        this.Me.active = true;
        var temp = this.content.getChildByName(event.currentTarget._name).getChildByName("Label").getComponent(cc.Label).string

        var wid = 0;
        for (var i = 0; i < temp.length; i++) {
            if (temp[i] >= 'A' && temp[i] <= 'Z')
                wid += 15;
            else if (temp[i] >= 'a' && temp[i] <= 'z')
                wid += 13;
            else {
                wid += 23
            }
        }
        this.Me.width = wid + 23 * 2
        var label = this.Me.getChildByName("Label").getComponent(cc.Label);
        label.string = temp;
        label.node.x = 23
        this.TalkMenuOpenBtn.active = false;
        this.closeMenu();
        this.scheduleOnce(function () {
            this.closeLabel(this.Me);
        }, 1.5);
    },
    closeLabel(label) {
        label.active = false;
        this.TalkMenuOpenBtn.active = true;

    },
    onKeyDown: function (event) {
        //cc.log(event.keyCode)
        switch (event.keyCode) {
            case 69: // E鑑，NextNext
                this.NextNext.active = true;
                this.nextNextCounter++;
                if (this.nextNextCounter > 9)
                    this.nextNextCounter = 0;
                var temp = this.content.getChildByName("option" + this.nextNextCounter).getChildByName("Label").getComponent(cc.Label).string

                var wid = 0;
                for (var i = 0; i < temp.length; i++) {
                    if (temp[i] >= 'A' && temp[i] <= 'Z')
                        wid += 15;
                    else if (temp[i] >= 'a' && temp[i] <= 'z')
                        wid += 13;
                    else {
                        wid += 23
                    }
                }
                this.NextNext.width = wid + 23 * 2
                var label = this.NextNext.getChildByName("Label").getComponent(cc.Label);
                label.string = temp;
                label.node.x = 23
                this.TalkMenuOpenBtn.active = false;
                this.closeMenu();
                this.scheduleOnce(function () {
                    cc.log("NextNext active false");
                    this.closeLabel(this.NextNext);
                    this.NextNext.active = false;
                }, 1.5);
                break;
            case 68: // D鑑，Next
                this.Next.active = true;
                this.nextCounter++;
                if (this.nextCounter > 9)
                    this.nextCounter = 0;
                var temp = this.content.getChildByName("option" + this.nextCounter).getChildByName("Label").getComponent(cc.Label).string

                var wid = 0;
                for (var i = 0; i < temp.length; i++) {
                    if (temp[i] >= 'A' && temp[i] <= 'Z')
                        wid += 15;
                    else if (temp[i] >= 'a' && temp[i] <= 'z')
                        wid += 13;
                    else {
                        wid += 23
                    }
                }
                this.Next.width = wid + 23 * 2
                var label = this.Next.getChildByName("Label").getComponent(cc.Label);
                label.string = temp;
                label.node.x = 23
                this.TalkMenuOpenBtn.active = false;
                this.closeMenu();
                this.scheduleOnce(function () {
                    this.closeLabel(this.Next);
                    this.Next.active = false;
                }, 1.5);
                break;
            case 65: // A鑑，Pre
                this.Pre.active = true;
                this.PreCounter++;
                if (this.PreCounter > 9)
                    this.PreCounter = 0;
                var temp = this.content.getChildByName("option" + this.PreCounter).getChildByName("Label").getComponent(cc.Label).string

                var wid = 0;
                for (var i = 0; i < temp.length; i++) {
                    if (temp[i] >= 'A' && temp[i] <= 'Z')
                        wid += 15;
                    else if (temp[i] >= 'a' && temp[i] <= 'z')
                        wid += 13;
                    else {
                        wid += 23
                    }
                }
                this.Pre.width = wid + 23 * 2
                var label = this.Pre.getChildByName("Label").getComponent(cc.Label);
                label.string = temp;
                label.node.x = 23
                this.TalkMenuOpenBtn.active = false;
                this.closeMenu();
                this.scheduleOnce(function () {
                    this.closeLabel(this.Pre);
                    this.Pre.active = false;
                }, 1.5);
                break;
            case 81: // Q鑑，PrePre
                this.PrePre.active = true;
                this.PrePreCounter++;
                if (this.PrePreCounter > 9)
                    this.PrePreCounter = 0;
                var temp = this.content.getChildByName("option" + this.PrePreCounter).getChildByName("Label").getComponent(cc.Label).string

                var wid = 0;
                for (var i = 0; i < temp.length; i++) {
                    if (temp[i] >= 'A' && temp[i] <= 'Z')
                        wid += 15;
                    else if (temp[i] >= 'a' && temp[i] <= 'z')
                        wid += 13;
                    else {
                        wid += 23
                    }
                }
                this.PrePre.width = wid + 23 * 2
                var label = this.PrePre.getChildByName("Label").getComponent(cc.Label);
                label.string = temp;
                label.node.x = 23
                this.TalkMenuOpenBtn.active = false;
                this.closeMenu();
                this.scheduleOnce(function () {
                    this.closeLabel(this.PrePre);
                    this.PrePre.active = false;
                }, 1.5);
                break;
        }
    },


});
