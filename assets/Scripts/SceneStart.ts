import Game, { SessionData } from "./Game";
import * as Define from "./Define";
import { GameState } from "./MainStateMgr";

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
    @property(cc.Label) version: cc.Label = null;
    
    onLoad()
    {
        cc.view.enableAntiAlias(true);
        Game.Inst.init = true;

        if (!Game.Inst.init) {
            Game.Inst.mainStateMgr.changeStage(GameState.Start);
            return;
        }

        //show build ver
        if (window.version != null)
            this.version.string = window.version;
		
		let data = sessionStorage.getItem("key");
        if (data != null)
        {
            let session: SessionData = JSON.parse(data);            
            NetworkMgr.Oid = session.oid.toString();
            NetworkMgr.Token = session.token;

            cc.warn("login from session data.\nOid: " + NetworkMgr.Oid + "\nToken: " + NetworkMgr.Token);
            Game.Inst.mainStateMgr.changeStage(GameState.Loading);
        }

        this.editbox_oid.string = "13";
        this.editbox_token.string = Math.floor(Math.random()*10000).toString();

    }

    testButton(){
        this.connect(this.editbox_oid.string, this.editbox_token.string);
    }

    connect(oid: string, token: string){ 
        //Game.Inst.networkMgr.LogIn(oid, token);
        Define.RoomInfo.Inst.game_option_id = Number(oid);
        Define.GameInfo.Inst.token = token;
        Game.Inst.mainStateMgr.changeStage(GameState.Loading);
    }

    restart(){
        Game.Inst.mainStateMgr.changeStage(GameState.Start);
    }
}
