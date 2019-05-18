import MenuBase from "./MenuBase";
import HistoryComponent from "./HistoryComponent";
import MiscHelper from "../../MiscHelper";


const {ccclass, property} = cc._decorator;

@ccclass
export default class HistoryMenu extends MenuBase {
    @property(cc.Prefab) contentComponent: cc.Prefab = null;
    @property(cc.ScrollView) scrollView: cc.ScrollView = null;
    @property(cc.Node) contentNode: cc.Node = null;

    open(){
        this.init();
        this.node.active = true;
    }

    close(){
        this.node.active = false;
    }

    init(){
        let historyCount: number = 0;
        let tempComponent: HistoryComponent;
        let componentHeight: number;
        for(historyCount = 0;historyCount < 30;historyCount++){
            tempComponent = cc.instantiate(this.contentComponent).getComponent(HistoryComponent);
            let tempProfit: number = MiscHelper.randomInt(-100,100);
            tempComponent.init(historyCount,"abc","十三水",(tempProfit >= 0),Math.abs(tempProfit).toString(),3876544);
            componentHeight = tempComponent.Height;

            tempComponent.node.parent = this.contentNode;
            tempComponent.node.position = cc.v2(tempComponent.node.position.x, tempComponent.node.position.y - componentHeight * historyCount);

        }
        this.contentNode.setContentSize(this.contentNode.getContentSize().width, componentHeight * historyCount);
        this.scrollView.scrollToTop();
    }
}
