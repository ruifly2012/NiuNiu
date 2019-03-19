const {ccclass, property} = cc._decorator;

@ccclass
export default class Transitions
{
    fadeIn(_node: cc.Node) 
    {
        _node.setScale(0.2);
        let ani = cc.scaleTo(0.2, 1);
        _node.runAction(ani);
    }

    fadeOut(_node: cc.Node) 
    {
        _node.setScale(1);
        let ani = cc.scaleTo(0.2, 0.2);
        _node.runAction(ani);
    }
}
