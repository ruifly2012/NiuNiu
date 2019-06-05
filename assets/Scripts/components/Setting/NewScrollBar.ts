

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewScrollBar extends cc.Component {

    @property(cc.Node) bar: cc.Node = null;
    @property(cc.Node) back: cc.Node = null;
    @property(cc.ScrollView) scrollview: cc.ScrollView = null;
    @property(cc.Node) content: cc.Node = null;

    onLoad(){
        this.bar.y = this.back.y + this.back.height/2 - 10;
        this.scrollview.node.on("scrolling",this.callback,this);
    }

    reset(){
        cc.warn("reset");
        this.bar.y = this.back.y + this.back.height/2 - 10;
        if(this.content.height <= this.scrollview.node.height+70){
            this.back.active = false;
        }
        else{
            this.back.active = true;
        }
        cc.warn(this.content.height + "," + this.scrollview.node.height);
    }

    callback(){
        let offset = Math.floor(this.scrollview.getScrollOffset().y);
        var Max = this.scrollview.getMaxScrollOffset().y
        let backHeight = this.back.height;
        let newY = this.back.y + backHeight/2- offset / Max * backHeight - 10;
        this.bar.y = newY;
    }
}

