import Global from "./Global";
import FlexDialog from "./FlexDialog";

/**
 * Functions/Tool that all can use, and depend with cocos creator 
 */
const {ccclass, property, executionOrder} = cc._decorator;

@ccclass
@executionOrder(-1) //Make sure register to Instance in the first
export default class Util extends cc.Component{
    onLoad()
    {        
        Global.Instance.misc = this;
    }

    async instanceFlexDialog(_text: string, _OK_callback: Function = null)
    {    
        //waite resource loading and instance
        let _prefab = await Global.Instance.resources.getloadAssets("Template/Dialog");
        let newNode: cc.Node = cc.instantiate(_prefab);

        //setup callback function when press OK
        newNode.getComponent(FlexDialog).setupCallback(_OK_callback);

        //Add to scene
        cc.director.getScene().addChild(newNode);
    }   
}
