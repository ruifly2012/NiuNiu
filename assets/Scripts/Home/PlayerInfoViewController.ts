import PlayerInfo from "../PlayerInfo/Model/PlayerInfo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerInfoViewController extends cc.Component {

    @property(cc.Sprite)
    head: cc.Sprite = null;

    @property(cc.Label)
    username: cc.Label = null;

    @property(cc.Label)
    level: cc.Label = null;

    @property(cc.Sprite)
    vip_icon: cc.Sprite = null;
    
    playerinfo: PlayerInfo = null;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.init();
    }

    start () {        
    }

    private init() 
    {
        //Get player info from API
        //this.playerinfo = 

        if(this.playerinfo == null) {
            console.log('Player Info Empty!!');
            return;
        }
        
        //update UI by data
        this.username.string = this.playerinfo.user_name;
        this.level.string = 'Lv.'+this.playerinfo.user_level;
    }

}
