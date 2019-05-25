

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewScrollBar extends cc.Component {

    @property(cc.Node) bar: cc.Node = null;
    @property(cc.Node) back: cc.Node = null;
    @property(cc.ScrollView) scrollview: cc.ScrollView = null;
    @property(cc.Node) content: cc.Node = null;

    onLoad(){
        this.bar.y = this.back.height / 2;
        this.scrollview.node.on("scrolling",this.callback,this);
    }

    reset(){
        this.bar.y = this.back.height / 2;
        if(this.content.height <= this.scrollview.node.height){
            this.back.active = false;
        }
        else{
            this.back.active = true;
        }
    }

    callback(){
        let offset = Math.floor(this.scrollview.getScrollOffset().y);
        var Max = this.scrollview.getMaxScrollOffset().y
        let backHeight = this.back.height;
        let newY = backHeight / 2 - offset / Max * backHeight;
        this.bar.y = newY;
    }
}

