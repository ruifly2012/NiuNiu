import AnimationBase from "../components/animation/AnimationBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DistributePokerAnimation extends AnimationBase {

    @property(cc.Node) 
    pokerPool:cc.Node = null;

    @property(cc.Node)
    playerPoker:cc.Node = null;

    // private pos: {x: number, y: number}[] = [
    //     { x : -10, y: -325},//me
    //     { x : -10, y: 310},//up
    //     { x : -645, y: 10}, //left
    //     { x : 450, y: 10},//right
    // ]

    @property
    position: cc.Vec2[] = [
        cc.v2(360,-400),//me
        cc.v2(250,310),//right up
        cc.v2(-120,310),//left up
        cc.v2(-510,20),//left
        cc.v2(620,20),//right
    ]

    @property
    cardSize:number = 0.7;

    /**玩家數量 */
    public playerCount: number = 4;

    private duration: number = 1;

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
        this.initCard();
        for(let playerSeat = 1; playerSeat < this.playerCount;playerSeat++)
            this.deliverCard(playerSeat,this.duration);
        this.deliverSelfCard(this.duration);

        if ( onfinished != undefined ){
            this.scheduleOnce(function(){
                onfinished();
            },this.duration+1)
        }
        
    }


    onLoad(){
        super.onLoad();
    }

    /**
     * 生成poker, 0-12 player1, 13-25 player2 ...
     */
    initCard(){
        this.playerCount = 5;
        //clear exist poker
        this.pokerPool.getComponent("NodePool").clearAll();//didn't work?
        this.playerPoker.children.forEach(element => {
            element.destroy();
        });
        //generate self poker
        for (let index:number = 0; index < 5; index++) {
            let node:cc.Node = this.pokerPool.getComponent("NodePool").request();
            node.parent = this.playerPoker;
            node.getComponent("Poker").setShowBack(true); 
            node.active = false;
        }
        //generate other poker
        for (let index:number = 5; index < 5* this.playerCount; index++) {
            let node:cc.Node = this.pokerPool.getComponent("NodePool").request();
            node.parent = this.playerPoker;
            node.getComponent("Poker").setShowBack(true); 
            node.active = false;
        }
    }

    /**
     * 發牌
     * @param playerSeat 玩家座位(0~3)
     * @param Interval 時間間隔
     */
    deliverCard(playerSeat: number = 1, Interval:number = 1){
        cc.log("send to" + this.position[playerSeat].x  + "," + this.position[playerSeat].y);
        for (let index:number = 0; index < 5; index++) {
            let node:cc.Node = this.playerPoker.children[index+5*playerSeat];
            node.active = true;
            //set start position
            let action:cc.ActionInstant = cc.sequence(
                cc.spawn(cc.place(0,0),cc.scaleTo(0,this.cardSize)),//put in mid
                cc.delayTime(0.7),
                cc.moveTo( Interval , this.position[playerSeat].x - 30*index , this.position[playerSeat].y).easing(cc.easeQuinticActionOut())
            );
            node.runAction(action);  
        }        
    }

    deliverSelfCard(Interval:number = 1){
        cc.log("send to" + this.position[0].x  + "," + this.position[0].y);
        for (let index:number = 0; index < 5; index++) {
            let node:cc.Node = this.playerPoker.children[index];
            node.active = true;
            //set start position
            let action:cc.ActionInstant = cc.sequence(
                cc.spawn(cc.place(0,0),cc.scaleTo(0,this.cardSize)),//put in mid
                cc.delayTime(0.7),
                cc.spawn(
                    cc.moveTo( Interval , this.position[0].x - 170*index , this.position[0].y).easing(cc.easeQuinticActionOut()),
                    cc.scaleTo(Interval,1).easing(cc.easeQuinticActionOut())
                )
            );
            node.runAction(action);  
        }     
    }
}
