import AnimationBase from "../components/animation/AnimationBase";
import MiscHelper from "../MiscHelper";
import NodePool from "../components/NodePool";
const {ccclass, property} = cc._decorator;

@ccclass
export default class CoinFlowAnimation extends AnimationBase {


    @property(cc.Node)
    coinRoot: cc.Node = null;

    @property(NodePool)
    coinPool: NodePool = null;

    /**座位座標 */
    private pos: cc.Vec2[] = [
        cc.v2(-515,-325),//me
        cc.v2(-810,45),//left
        cc.v2(-420,325),//left up
        cc.v2(415,325),//right up
        cc.v2(810,45),//right
    ]

    /**x 離散參數 */
    private xFloat: number = 200;
    /**y 離散參數 */
    private yFloat: number = 100;
    /** 每次生成金幣數量 */
    private moneyNum: number = 20;
    

    /**玩家數量 */
    public playerCount: number = 4;

    private duration: number = 1;

    /**起點編號 */
    fromSeat: number;
    /**終點編號 */
    toSeat: number;


    pause() {
        throw new Error("Method not implemented.");
    }
    stop() {
        throw new Error("Method not implemented.");
    }
    resume() {
        throw new Error("Method not implemented.");
    }
    /**
     * 
     * @param speed 撥放速度
     * @param onfinished callBackFunc
     */
    play(speed: number,loop: boolean,onfinished?){
        this.duration = 1/speed;

        //generate random test data
        this.fromSeat = MiscHelper.randomInt(0,4);
        this.toSeat = MiscHelper.randomInt(0,4);


        //this.init();
        this.sendCoin(this.pos[this.fromSeat],this.pos[this.toSeat],this.duration);
        
        
        if ( onfinished != undefined ){
            this.scheduleOnce(function(){
                onfinished();
            },this.duration);
        }
        
    }


    onLoad(){
        super.onLoad();
    }

    /**
     * 發金幣
     * @param fromSeat 出金幣玩家編號
     * @param toSeat 得金幣玩家編號
     * @param Interval 動畫時間
     */
    sendCoin(fromPos: cc.Vec2, toPos: cc.Vec2, Interval:number = 1){

        for (let index:number = 0; index < this.moneyNum; index++) {
            //calc random curve
            let midPoint:cc.Vec2 = cc.v2(
                toPos.x*0.5 + fromPos.x*0.5 - Math.random()*this.xFloat , 
                Math.max(toPos.y,fromPos.y) + Math.random()*this.yFloat
            );
            let path = [fromPos,midPoint,toPos];

            let delay: number = Math.random()*0.3 + 0.1;

            //getNode
            let node:cc.Node = this.coinPool.request();
            node.parent = this.coinRoot;

            //set start position
            let action:cc.ActionInstant = cc.sequence(
                cc.place(fromPos),
                cc.delayTime(delay),
                cc.bezierTo(Interval, path),
                cc.callFunc(()=>{
                    //destroy coin
                   this.coinPool.return(node);
                })
            );
            node.runAction(action);  
        }        
    }

}
