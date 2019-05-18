

const {ccclass, property} = cc._decorator;

@ccclass
export default class HelpBtnComponent extends cc.Component {
    @property(cc.Node) mainObj: cc.Node = null;
    sprite: cc.Sprite = null;
}
