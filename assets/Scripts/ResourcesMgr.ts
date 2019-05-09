import Game from "./Game";

const { ccclass, property } = cc._decorator;


/**
 * 動態資源管理物件
 */
@ccclass
export default class ResourcesMgr extends cc.Component {
    /**當前已讀取的檔案存放區 */
    private spriteFrame = {};
    /**預讀取的檔案列表 */
    private assetList = [];

    constructor() {
        super();

        // ResourceIndex.TW
        let list = [];
        list.push("MobileStatus");

        list.push("playerIcon");
        list.push("poker");
        list.push("text");
        list.push("CardType");
        list.push("coins/coin1");
        list.push("coins/coin2");
        this.assetList = list;

        cc.game.addPersistRootNode(this.node);
    }

    /**
     * 讀取動態資源
     * @param onloading loading中途觸發事件
     */
    preload(onloading: Function = undefined) {
        cc.log("ResourcesMgr.preload");

        let assetListComplete = 0;
        let assetList = this.assetList;
        if (assetList != undefined) {
            for (let i = 0; i < assetList.length; i++) {
                cc.loader.loadResDir("textures/" + assetList[i], cc.SpriteFrame,
                    (completedCount, totalCount, item) => { },
                    (err, assets) => {
                        for (let i = 0; i < assets.length; i++) {
                            //cc.log("check " + assets[i].name);   
                            if (this.spriteFrame[assets[i].name] == null) {
                                this.spriteFrame[assets[i].name] = assets[i];
                                cc.log("[[Resources]] " + assets[i].name + " loaded.");
                            }
                        }

                        assetListComplete++;
                        if (onloading != undefined)
                            onloading(assetListComplete / assetList.length);
                    });
            }
        }
        else {
            onloading(1);
        }

    }

    /**
     * 取得已讀取進遊戲的動態資源
     * @param name 動態資源名稱
     */
    load(name: string) {
        if (name in this.spriteFrame) {
            //cc.log("[Resources] Load " + name + " success");
            return this.spriteFrame[name];
        }
        cc.log("load fail");
        return null;
    }

    /**
     * 卸載指定場景的動態資源
     */
    unLoad() {

    }

    /**
     * 載入並播放連續圖動畫
     * @param animator 動畫播放器
     * @param path 片段(資料夾)路徑
     * @param clipname 片段(資料夾)名稱
     * @param speed 播放速度
     * @param loop 是否重複播放
     */
    loadSequenceAnumation(animator: cc.Animation,path: string = "Sequence", clipname: string, speed: number = 1.0, loop: boolean = false) {
        let sequenceSpriteFrame = [];

        cc.loader.loadResDir("Animations/" + path + "/" + clipname, cc.SpriteFrame,
            (completedCount, totalCount, item) => { },
            (err, assets) => {
                for (let i = 0; i < assets.length; i++) {
                    sequenceSpriteFrame.push(assets[i]);
                }
                sequenceSpriteFrame.sort((n1, n2) => {
                    let num1 = parseInt(n1.name.split("_", 2)[1]), num2 = parseInt(n2.name.split("_", 2)[1]);
                    if (num1 > num2) return 1;
                    else if (num1 < num2) return -1;
                    else return 0;
                });

                let clip = cc.AnimationClip.createWithSpriteFrames(sequenceSpriteFrame, sequenceSpriteFrame.length);
                clip.name = clipname;
                clip.speed = speed;
                clip.wrapMode = loop ? cc.WrapMode.Loop : cc.WrapMode.Default;
                animator.addClip(clip);
                animator.play(clipname);
            });
    }

}
