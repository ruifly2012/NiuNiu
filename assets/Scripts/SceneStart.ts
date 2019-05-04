import Game from "./Game";
import { GameState } from "./MainStateMgr";
import NetworkMgr from "./NetworkManager";

/*  
    Oid test data
	13:  2 player NiuNiu
*/

const {ccclass, property} = cc._decorator;

@ccclass
export default class SceneStart extends cc.Component 
{
    @property(cc.EditBox) editbox_oid: cc.EditBox = null;
    @property(cc.EditBox) editbox_token: cc.EditBox = null;
    
    onLoad()
    {
        cc.view.enableAntiAlias(true);
        Game.Inst.init = true;

        if (!Game.Inst.init) {
            Game.Inst.mainStateMgr.changeStage(GameState.Start);
            return;
        }

        //preload game
        Game.Inst.mainStateMgr.preloadStage(GameState.Game);

        //connect server at first
        Game.Inst.networkMgr.ConnectServer();

        //Game.Inst.mainStateMgr.changeStage(GameState.Loading);

        Game.Inst.EventListener.on("enterGame",()=>{
            cc.log("enterGame");
            Game.Inst.mainStateMgr.changeStage(GameState.Loading);
        })
    }

    testButton(){
        this.connect(this.editbox_oid.string, this.editbox_token.string);
    }

    connect(oid: string, token: string){ 
        Game.Inst.networkMgr.LogIn(oid, token);
    }

    restart(){
        Game.Inst.mainStateMgr.changeStage(GameState.Start);
    }
}
