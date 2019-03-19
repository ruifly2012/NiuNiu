import Global from "./Global";

const {ccclass, property} = cc._decorator;

export enum ResourceIndex
{
    Lobby,
    BAG,
    LB, //LeaderBoard
    

    HistoryController = 100,
}

@ccclass
export default class ResourcesMgr extends cc.Component {

    private spriteFrame = {};
    private assetList = {};

    private loadingList:[string, any][] = [];

    constructor()
    {
        super();
        Global.Instance.resources = this;
        // ResourceIndex.Lobby
        let list = [];
        list.push("faces");
        list.push("icons");
        list.push("share");
        list.push("BC");
        list.push("gameRoom");
        this.assetList[ResourceIndex.Lobby] = list;

        // ResourceIndex.BAG
        list = [];
        list.push("faces");
        list.push("icons");
        list.push("share");
        list.push("BC");
        list.push("gameRoom");
        this.assetList[ResourceIndex.BAG] = list;
    }

    preloadSprits(idx: ResourceIndex, onLoading=null)
    {
        cc.log("ResourcesMgr.preload(" + idx + ")");

        let assetListComplete = 0;
        let assetList: [string] = this.assetList[idx.toString()];
        for (let i = 0; i < assetList.length; i++)
        {
            cc.loader.loadResDir("textures/" + assetList[i], cc.SpriteFrame,
            (completedCount, totalCount, item) => {}, 
            (err, assets) =>
            {
                for (let i = 0; i < assets.length; i++)
                {
                    //cc.log("check " + assets[i].name);   
                    if (this.spriteFrame[assets[i].name] == null)
                    {
                        this.spriteFrame[assets[i].name] = assets[i];
                        //cc.log("[[Resources]] " + assets[i].name + " loaded.");        
                    }
                }
                
                assetListComplete++;
                if (onLoading != null)
                    onLoading(assetListComplete / assetList.length);
            });
        }
    }

    releaseSprits(idx: ResourceIndex)
    {
        cc.log("ResourcesMgr.releaseRes(" + idx + ")");

        let assetListComplete = 0;
        let assetList: [string] = this.assetList[idx.toString()];
        for (let i = 0; i < assetList.length; i++)
        {
            cc.loader.release("textures/" + assetList[i]);
        }
    }

    getloadAssets(_name: string, _callback:Function = null) : Promise<any>
    {
        let isLoad = this.loadingList.find( x => x[0] === _name);
        let self = this;
        return new Promise( function (resolve, reject) {
            if(isLoad == null)      
            {                
                cc.loader.loadRes(_name, function (err, prefab) {
                    if(err)
                    {
                        cc.error(err);
                        reject(err);
                    }
                    self.loadingList.push([_name, prefab]);  
                    cc.log('Load : '+ _name);
                    resolve(prefab);             
                });                
            }
            else
            {
                resolve(isLoad[1]);
            }
        });
    }


}
