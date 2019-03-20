//import PlayerInfo from "../PlayerInfo/Model/PlayerInfo";
import global from "../Common/Global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerInfoViewController extends cc.Component {

    //ctor
    //=====================================================================
    private playerInfo: any = null; // 所有玩家的名子、金錢、託管狀態
    private playerScript: any = {
        PreRival: null,
        Me: null,
        NextRival: null,
        PrePreRival: null,
        NextNextRival: null
    };
    private defaultImgs: any = ["newnew/common/playerPic1", "newnew/common/playerPic2", "newnew/common/playerPic3", "newnew/common/playerPic4", "newnew/common/playerPic5", "newnew/common/playerPic6"];
    private autoPlaying: cc.Node;
    //=====================================================================

    //property
    //================================================
    @property(cc.Node)
    Me: cc.Node = null;

    @property(cc.Node)
    PreRival: cc.Node = null;

    @property(cc.Node)
    NextRival: cc.Node = null;

    @property(cc.Node)
    PrePreRival: cc.Node = null;

    @property(cc.Node)
    NextNextRival: cc.Node = null;

    @property(cc.Node)
    Autoplaying: cc.Node = null;
    //=================================================

   

    autoPlay() {
        global.Instance.EventListener.notify("AIswitch");
    }

    onLoad() {
        var self = this;
        //this.autoPlaying = cc.find("AutoPlaying", this.node.parent);
        // 在playerInfo的parent folder(PlayGround)找AutoPlaying node，存入ctor宣告的this.autoPlaying

        this.playerScript.PreRival = this.PreRival.getComponent("player");
        this.playerScript.Me = this.Me.getComponent("player");
        this.playerScript.NextRival = this.NextRival.getComponent("player");
        this.playerScript.PrePreRival = this.PrePreRival.getComponent("player");
        this.playerScript.NextNextRival = this.NextNextRival.getComponent("player");
        //存入五個玩家的player(scrpit)

        cc.loader.loadResDir("newnew/common", function (err, assets) { });
        //load newnew/common 整包 美術圖

        global.Instance.EventListener.on("roomReady", function (event, Info) {
            cc.log("roomReady in PlayerInfoViewCtrlr");
            cc.log("piv get ", Info);
            self.UpdateRoom(Info);
            cc.log("RoomReady in Player Done");
        });

        /*global.Instance.network.socket()("roomReady", function (Info) {
            self.UpdateRoom(Info);
            cc.log("getRoomReady");
        });*/
        //等待server回傳所有玩家的Info，存入playerInfo，並呼叫函式

    }




    showKingAnime(kingUID) {
        this.Me.getChildByName("dizhuIcon").active = true;
    }

    // 當收到伺服器信息，此函式被呼叫，更改名子，金錢，有無託管
    UpdateRoom(playerInfo) {
        cc.log("updateRoom");
        var self = this;

        cc.log(playerInfo);
        
        this.playerScript.Me.setName(playerInfo.Me.name);
        this.playerScript.PreRival.setName(playerInfo.Pre.name);
        this.playerScript.NextRival.setName(playerInfo.Next.name);
        this.playerScript.PrePreRival.setName(playerInfo.PrePre.name);
        this.playerScript.NextNextRival.setName(playerInfo.NextNext.name);


        this.playerScript.Me.setCoin(playerInfo.Me.coin);
        this.playerScript.PreRival.setCoin(playerInfo.Pre.coin);
        this.playerScript.NextRival.setCoin(playerInfo.Next.coin);
        this.playerScript.PrePreRival.setCoin(playerInfo.PrePre.coin);
        this.playerScript.NextNextRival.setCoin(playerInfo.NextNext.coin);
        // 更改玩家託管狀態
        // this.autoPlaying.active = playerInfo.isAI;


        // load玩家圖片，並呼叫每個玩家player.js的函式setImg，幫所有玩家填上玩家圖片
        if (playerInfo.Me.img != null)
            cc.loader.loadRes(this.defaultImgs[playerInfo.Me.img], cc.SpriteFrame, function (err, spriteFrame) {

                self.playerScript.Me.setImg(spriteFrame);
            });


        if (playerInfo.Pre.img != null)
            cc.loader.loadRes(this.defaultImgs[playerInfo.Pre.img], cc.SpriteFrame, function (err, spriteFrame) {
                self.playerScript.PreRival.setImg(spriteFrame);
            });


        if (playerInfo.Next.img != null)
            cc.loader.loadRes(this.defaultImgs[playerInfo.Next.img], cc.SpriteFrame, function (err, spriteFrame) {
                self.playerScript.NextRival.setImg(spriteFrame);
            });

        if (playerInfo.PrePre.img != null)
            cc.loader.loadRes(this.defaultImgs[playerInfo.PrePre.img], cc.SpriteFrame, function (err, spriteFrame) {
                self.playerScript.PrePreRival.setImg(spriteFrame);
            });


        if (playerInfo.NextNext.img != null)
            cc.loader.loadRes(this.defaultImgs[playerInfo.NextNext.img], cc.SpriteFrame, function (err, spriteFrame) {
                self.playerScript.NextNextRival.setImg(spriteFrame);
            });


    }
}
