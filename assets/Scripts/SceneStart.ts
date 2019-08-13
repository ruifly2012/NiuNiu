import Game, { SessionData } from "./Game";
import * as Define from "./Define";
import { GameState } from "./MainStateMgr";
import NetworkManager from "./NetworkManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SceneStart extends cc.Component 
{
    @property(cc.EditBox) editbox_oid: cc.EditBox = null;
    @property(cc.EditBox) editbox_token: cc.EditBox = null;
    @property(cc.Label) version: cc.Label = null;
    @property(cc.Node) inputField: cc.Node = null;
    
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

            NetworkManager.Oid = session.oid.toString();
            NetworkManager.Token = session.token;
            NetworkManager.ServerURL = session.ip;

            cc.warn("login from session data.\nOid: " + session.oid + "\nToken: " + session.token);
            Game.Inst.mainStateMgr.changeStage(GameState.Loading);
        }
        else
        {
            if (Game.Inst.develop == true) {
                
                this.inputField.active = true;
            } else {
                var url = window.location.href
                var arr = url.split("/");
                window.open(arr[0] + '//' + arr[2] + '/index.html', '_self');
            }
        }

        this.editbox_oid.string = "20";
        this.editbox_token.string = this.generateToken();

    }

    generateToken(): string{
        return"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZl9hY2NvdW50IjoiZ3Vlc3RfMDE1NjU3MDUxNTUxNTk3MTIiLCJyb2xlX2NvZGVfaWQiOiIwIiwiZXhwIjoxNTY1NzMzOTU1fQ.zkaaMZnZMncsf6Jo-jTtITk36JaHR4oiwFcUUFTUyBA";
    }

    testButton(){
        this.connect(this.editbox_oid.string, this.editbox_token.string);
    }

    connect(oid: string, token: string){
        NetworkManager.Oid = oid;
        NetworkManager.Token = token;
        Game.Inst.mainStateMgr.changeStage(GameState.Loading);
    }

    restart(){
        Game.Inst.mainStateMgr.changeStage(GameState.Start);
    }
}
