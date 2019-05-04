
const { ccclass, property } = cc._decorator;

/**
 * 動態資源管理物件
 */
@ccclass
export default class ResourcesMgr extends cc.Component {
    /**當前已讀取的檔案存放區 */
    private spriteFrame = {};
    /**各場景須預讀取的檔案列表 */
    private assetList = [];

    constructor() {
        super();

        this.assetList.push("player/img");
        this.assetList.push("text");

        cc.game.addPersistRootNode(this.node);
    }

    /**
     * 讀取指定場景所需的動態資源
     * @param idx 指定場景ID
     * @param onloading loading中途觸發事件
     */
    preload(onloading: Function = undefined) {
        cc.log("ResourcesMgr.preload");

        let assetListComplete = 0;
        let assetList:any[] = this.assetList;
        if (assetList != undefined) {
            for (let i = 0; i < assetList.length; i++) {
                cc.loader.loadResDir(assetList[i], cc.SpriteFrame,
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
            cc.log("[Resources] Load " + name + " success");
            return this.spriteFrame[name];
        }
        cc.warn("[Resources] Load " + name + " fail");
        return null;
    }

}
