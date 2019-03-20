import NetworkManager from "../Network/NetworkManager";
import Transitions from "./Transitions";
import EventListener from "./EventListener";
import AnimationMgr from "./AnimationMgr";
import AudioMgr from "./AudioMgr";
import ResourcesMgr from "./ResourcesMgr";
import MiscTool from "./MiscTool";
import Util from "./Util";
const {ccclass, requireComponent} = cc._decorator;

@ccclass
@requireComponent(AudioMgr)
@requireComponent(ResourcesMgr)
export default class Global extends cc.Component{

    private static instance: Global;
    public uid:string;

    static get Instance() : Global 
    {

        if (!this.instance) {
            Global.instance = new Global();
            Global.instance.EventListener = new EventListener();
            Global.instance.network = new NetworkManager();
            Global.instance.transitions = new Transitions();
            Global.instance.animation = new AnimationMgr();   
            Global.instance.misc = new MiscTool();        
        }
        return this.instance;
    }

    EventListener: EventListener = null;
    network: NetworkManager = null;    
    transitions: Transitions = null;
    animation: AnimationMgr = null;
    misc: MiscTool = null;

    audio: AudioMgr = null;   
    resources: ResourcesMgr = null;    
    util: Util = null;
    
 
}
