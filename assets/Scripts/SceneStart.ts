import Game, { SessionData } from "./Game";
import * as Define from "./Define";
import { GameState } from "./MainStateMgr";
import NetworkManager from "./NetworkManager";

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
            this.inputField.active = true;
        }

        this.editbox_oid.string = "20";
        this.editbox_token.string = this.generateToken();

    }

    generateToken(): string{

        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZl9hY2NvdW50IjoiZ3Vlc3RfMTE1NjQ4MTU4OTY3NjY5NzYiLCJyb2xlX2NvZGVfaWQiOiIwIiwiZXhwIjoxNTY0ODQ0Njk3fQ.ifC2Eaos5SmosQvBGrDsyBw7CnWJBz4uotGKMSOfd8s";

        let seed: number = Math.floor(Math.random()*20);
        switch(seed){
            case 0: return "084jt09uzweln80qlq3scouzt89zn6vzhamjrkgh";
            case 1: return "g59o3o29822hm7vlnuisp853nytnx0goz23zcf98";
            case 2: return "cxipn45853yuocxzfcao2mbgiquxornr5vd6f968";
            case 3: return "8ibr53k80kr0u0r3qidzef62bxk5qfdmfgqeww39";
            case 4: return "zzwno7woxwuakudjxhqtlsarex4tgrxy1bxnl5s7";
            case 5: return "htwoaff5pibek8xtyka6m3e3dic8jf8olu36njuj";
            case 6: return "gm1ne5hfz7lzckdb3p5b9a0hebj3e9594zk8po6t";
            case 7: return "4rbd1eipqvae29v03z1t435oa78b8sc6gy74szqu";
            case 8: return "yye4336sopf7ygsa9bedub3r2kqpnqmwqr3j7uqy";
            case 9: return "49e4bwcz7zsjjg9x895c4b5r4mvlngb6zpr416o9";
            case 10: return "07y0ot5gew0e6hpklxricy20nlryflfwqkiel3l8";
            case 11: return "xobjwkd9ee3y2f71qewd5xs7vgb8lprky3lu5atn";
            case 12: return "i2ypeyk325ljcp7z9ut7kpg30y8ktg7yz6zqtyus";
            case 13: return "6bwv3fcvurz8sp54tmwtu4x0zzw2l2g38bhhuc30";
            case 14: return "wqo64yx1mlp8f2g3h8nfdixe6mh5wkv6dxa1awnm";
            case 15: return "24007devz9n46k5q8mio6tykqp7ejmscm71i54v1";
            case 16: return "rj2b613zbzryskrbws9jdopuyhzd2n2mdimsrz60";
            case 17: return "oik8ijd9nuwtm96cjarf3vhdp0xz9nnlccz4n1q9";
            default: return " xgyyr41q4mzwt7xx9twqjlctg3xpoy5od58j9egh";
            /* 
                    ys20lj9je8c1ey0s8qeqalto925gv02i80m0slj1
                    bx75ob6rou92k2h4b4a58hsd2swq555g2emrwjt8
                    wq6eiolilartmm5zv86vk1me2s3pvxdbbvfl72vr       
            */
        }
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
