import Game from "../Game";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Coin extends cc.Component {

    /**single pic duration time */
    private changeTime: number = 0.03;
    private curTime: number = 0;
    private curIndex: number = 0;

    /** sequence anime pic num */
    private picNum: number = 11;

    /**coin1 or coin2 */
    private coinType: number = 1;

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    onLoad() {
        this.init();
    }

    init(){
        //get coin type
        this.coinType = Math.floor(Math.random() * 2) + 1;
        //random initial pic
        this.curIndex = Math.floor(Math.random() * (this.picNum));
        this.changePic();
    }

    changePic(){
        this.curIndex++;
        if(this.curIndex > this.picNum) this.curIndex = 0;
        this.sprite.spriteFrame = Game.Inst.resourcesMgr.load(this.getFileName(this.curIndex));
    }

    getFileName(index: number):string{
        let fileName: string = "coin" + this.coinType + "_0";
        if(index < 10) fileName += "0";
        fileName += index;
        return fileName;
    }

   update(dt: number){
       //auto change pic to implement sequence anime
       this.curTime+=dt;
       if(this.curTime > this.changeTime){
            this.changePic();
            this.curTime = 0;
       }
   }
}
