import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MarqueeManager extends cc.Component {
    @property(cc.Prefab) MarqueeTextPrefab: cc.Prefab = null;
    @property(cc.Node) MarqueeParent: cc.Node = null;
    @property(cc.Node) MarqueeMask: cc.Node = null;

    @property([cc.String]) DefaultMessages: string[] = [];
    @property(Number) Speed: number = 0;
    @property(Number) UpBound: number = 0;
    @property(Number) LowBound: number = 0;
    @property(Number) IntervalWidth: number = 0;
    @property(Number) RequestInterval: number = 0;

    private previousMarqueeText: cc.Node = null;
    private m_defaultIndex = 0;
    private m_MarqueeQueue: Array<Array<marquee>>;

    
    onLoad() {
        this.m_MarqueeQueue = [];
        this.MarqueeParent.scaleX = 0;

        for (let i = 0; i < 6; i++) {
            this.m_MarqueeQueue.push([]);
        }

        this.updateMarquee();
        Game.Inst.networkMgr.registerEvent("marquee", (msg) => { this.onReceiveMarquee(msg); }); 
    }

    onReceiveMarquee(msg: marqueeResponse){
         this.handleUpdateMarqueeQueue(msg);
    }

    CheckHideMarquee(){  
        if(this.previousMarqueeText.x <= this.LowBound + 10 ){ 
            let action = cc.scaleTo(0.3,0 ,1);       
            this.MarqueeParent.runAction(action);
        } 
    }

    playMarquee(marqueeReference: marquee){
        let marquee: cc.Node = null;
        marquee = cc.instantiate(this.MarqueeTextPrefab);
        marquee.color = new cc.Color(parseInt(marqueeReference.color.substr(1,2),16), parseInt(marqueeReference.color.substr(3,2),16), parseInt(marqueeReference.color.substr(5,2),16));
        marquee.getComponent(cc.Label).string =  marqueeReference.content;
        marquee.parent = this.MarqueeMask;
        //cc.log(marquee.width);
        marquee.getComponent("MarqueeAnimation").init(new cc.Vec2(this.UpBound,-8),new cc.Vec2(this.LowBound - marquee.width,-8));
        marquee.getComponent("MarqueeAnimation").play(this.Speed, false,()=>{
            this.CheckHideMarquee();
            marquee.destroy();
        });


        if(this.MarqueeParent.scaleX == 0){     
            let action = cc.scaleTo(0.3,1 ,1);
            this.MarqueeParent.runAction(action);
        }

        this.previousMarqueeText = marquee;

        let hnd = setInterval(() => {
            if(this.previousMarqueeText == null || (this.previousMarqueeText.x + this.previousMarqueeText.width + this.IntervalWidth) < this.UpBound ){
                clearInterval(hnd);
                this.updateMarquee();
            } 
        },100);
    }

    updateMarquee(){
        let marqueeReference: marquee = null;
        for (let i = 0; i < 6; i++) {
            while (this.m_MarqueeQueue[i].length != 0) {
                marqueeReference = this.m_MarqueeQueue[i].shift();
                break;
            }
            if (marqueeReference != null) { 
                break;
            }
        }
        // if (marqueeReference == null) {
        //     marqueeReference = {
        //         "type": "default",
        //         "color": "#fdfb9c",
        //         "content": this.DefaultMessages[this.m_defaultIndex]
        //     }
        //     this.m_defaultIndex ++;
        //     this.m_defaultIndex %= this.DefaultMessages.length;
        // }
        if (marqueeReference != null)
            this.playMarquee(marqueeReference);
    }

    handleUpdateMarqueeQueue(msg: marqueeResponse){
        for(let i = 0; i < msg.data.system.length; i++){
            this.m_MarqueeQueue[0].push(msg.data.system[i]);
        }
        for(let i = 0; i < msg.data.hyper_reward.length; i++){
            this.m_MarqueeQueue[1].push(msg.data.hyper_reward[i]);
        }
        for(let i = 0; i < msg.data.big_reward.length; i++){
            this.m_MarqueeQueue[2].push(msg.data.big_reward[i]);
        }
        for(let i = 0; i < msg.data.reward.length; i++){
            this.m_MarqueeQueue[3].push(msg.data.reward[i]);
        }
        for(let i = 0; i < msg.data.event.length; i++){
            this.m_MarqueeQueue[4].push(msg.data.event[i]);
        }
        for(let i = 0; i < msg.data.other.length; i++){
            this.m_MarqueeQueue[5].push(msg.data.other[i]);
        }

        this.updateMarquee();
    }
}

export interface marqueeResponse {
    event: string;
    data: marquees;
}
export interface marquees {
    system: marquee[];
    hyper_reward: marquee[];
    big_reward: marquee[];
    reward: marquee[];
    event: marquee[];
    other: marquee[]
}
export interface marquee {
    type: string;
    content: string;
    color: string
}
