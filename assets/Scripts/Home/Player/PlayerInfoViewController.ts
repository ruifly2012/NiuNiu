import global from "../../Common/Global";
import * as NN from "../../NNDefine";
import Player from "./Player";
const { ccclass, property } = cc._decorator;

enum player{
    prepre = 0,
    pre,
    me,
    next,
    nextnext
}

@ccclass
export default class PlayerInfoViewController extends cc.Component {

    //ctor
    //=====================================================================
    private playerInfo: any = null; 
    private playerScript: Player[] = [];
    private defaultImgs: any = ["newnew/common/playerPic1", "newnew/common/playerPic2", "newnew/common/playerPic3", "newnew/common/playerPic4", "newnew/common/playerPic5", "newnew/common/playerPic6"];
    private autoPlaying: cc.Node;
    private playerCount: number;
    //=====================================================================

    //property
    //================================================
    @property(cc.Node)
    players: cc.Node[] = [];

    // IF WANT TO CHANGE TO ARRAY, HERE IS THE SOLUTION
    /*@property(cc.Node)
    fiveRival: cc.Node[] = [];*/

    @property(cc.Node)
    Autoplaying: cc.Node = null;
    //=================================================

    private static inst: PlayerInfoViewController = null;

    static get Inst(): PlayerInfoViewController{
        if(!PlayerInfoViewController.inst){
            return undefined
        }
        return this.inst;
    }

    autoPlay() {
        global.Instance.EventListener.notify("AIswitch");
    }

    onLoad() {
        let self = this;
        PlayerInfoViewController.inst = this;
        /*
        this.playerScript.PreRival = this.PreRival.getComponent("Player");
        this.playerScript.Me = this.Me.getComponent("Player");
        this.playerScript.NextRival = this.NextRival.getComponent("Player");
        this.playerScript.PrePreRival = this.PrePreRival.getComponent("Player");
        this.playerScript.NextNextRival = this.NextNextRival.getComponent("Player");
        */

        cc.loader.loadResDir("newnew/common", function (err, assets) { });

        /*global.Instance.EventListener.on("roomReady", function (event, Info) {
            //cc.log("roomReady in PlayerInfoViewCtrlr");
            //cc.log("piv get ", Info);
            self.UpdateRoom(Info);
            //cc.log("RoomReady in Player Done");
        });*/
    }

    init(){
        PlayerInfoViewController.inst.playerCount = NN.GameInfo.Inst.playerCount;
        for(let index = 0;index< this.playerCount;index++){
            cc.log("get player" + index + this.players[index]);
            cc.log(this);
            PlayerInfoViewController.inst.playerScript[index] = this.players[index].getComponent("Player");
            PlayerInfoViewController.inst.playerScript[index].test();
            PlayerInfoViewController.inst.playerScript[index].setHeadSprite("playerPic1");
        }
    }

    updatePlayer(){
        for(let index = 0;index< this.playerCount;index++){
            PlayerInfoViewController.inst.playerScript[index].setName(NN.GameInfo.Inst.players[index].name);
            PlayerInfoViewController.inst.playerScript[index].setMoney(NN.GameInfo.Inst.players[index].money);
        }
    }

    showKingAnime(kingUID) {
        //this.Me.getChildByName("dizhuIcon").active = true;
    }

    // UpdateRoom(playerInfo) {
    //     cc.log("updateRoom");
    //     let self = this;

    //     //cc.log(playerInfo);
        
    //     this.playerScript.Me.setName(playerInfo.Me.name);
    //     this.playerScript.PreRival.setName(playerInfo.Pre.name);
    //     this.playerScript.NextRival.setName(playerInfo.Next.name);
    //     this.playerScript.PrePreRival.setName(playerInfo.PrePre.name);
    //     this.playerScript.NextNextRival.setName(playerInfo.NextNext.name);


    //     this.playerScript.Me.setCoin(playerInfo.Me.coin);
    //     this.playerScript.PreRival.setCoin(playerInfo.Pre.coin);
    //     this.playerScript.NextRival.setCoin(playerInfo.Next.coin);
    //     this.playerScript.PrePreRival.setCoin(playerInfo.PrePre.coin);
    //     this.playerScript.NextNextRival.setCoin(playerInfo.NextNext.coin);

    //     if (playerInfo.Me.img != null)
    //         cc.loader.loadRes(this.defaultImgs[playerInfo.Me.img], cc.SpriteFrame, function (err, spriteFrame) {

    //             self.playerScript.Me.setImg(spriteFrame);
    //         });


    //     if (playerInfo.Pre.img != null)
    //         cc.loader.loadRes(this.defaultImgs[playerInfo.Pre.img], cc.SpriteFrame, function (err, spriteFrame) {
    //             self.playerScript.PreRival.setImg(spriteFrame);
    //         });


    //     if (playerInfo.Next.img != null)
    //         cc.loader.loadRes(this.defaultImgs[playerInfo.Next.img], cc.SpriteFrame, function (err, spriteFrame) {
    //             self.playerScript.NextRival.setImg(spriteFrame);
    //         });

    //     if (playerInfo.PrePre.img != null)
    //         cc.loader.loadRes(this.defaultImgs[playerInfo.PrePre.img], cc.SpriteFrame, function (err, spriteFrame) {
    //             self.playerScript.PrePreRival.setImg(spriteFrame);
    //         });


    //     if (playerInfo.NextNext.img != null)
    //         cc.loader.loadRes(this.defaultImgs[playerInfo.NextNext.img], cc.SpriteFrame, function (err, spriteFrame) {
    //             self.playerScript.NextNextRival.setImg(spriteFrame);
    //         });


    // }
}
