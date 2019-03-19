import Global from "./Global";

const {ccclass, property, executionOrder} = cc._decorator;

@ccclass
@executionOrder(-1) //Make sure register to Instance in the first
export default class AudioMgr extends cc.Component {
   
    @property
    isMusic: boolean = true;

    @property
    isEffect: boolean = true;

    private curBGM: string = '';

    private loadingList:[string, cc.AudioClip][] = [];
   

    onLoad () 
    {
        Global.Instance.audio = this;
        cc.game.on(cc.game.EVENT_HIDE, function () {
            cc.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });

        cc.game.on(cc.game.EVENT_SHOW, function () {
            cc.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
        });

    }

    playMusic(_clip:string, _isloop: boolean = true) 
    {
        if(!this.isMusic)
            return

        let url = "Audio/Music/" + _clip;
        if (this.curBGM === url)
            return;
      
        let isLoad = this.loadingList.find( x => x[0] === url);

        if(isLoad) {
            cc.audioEngine.playMusic(isLoad[1], _isloop);
        }
        else {
            let self = this;
            cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
                if(err) {
                    cc.error(err);              
                    return 
                }

                if(self.curBGM !== '') {
                    cc.audioEngine.stopMusic();
                }
    
                cc.audioEngine.playMusic(clip, _isloop);
                self.curBGM = url;
                self.loadingList.push([url, clip]);
            });       
        }
       
    }

    playEffect(_clip:string, _isloop: boolean = false, _callback: Function = null) 
    {
        if(!this.isEffect)
            return


        let url = "Audio/Effect/";
        let isLoad = this.loadingList.find( x => x[0] === url);
        if(isLoad) {
            cc.audioEngine.playEffect(isLoad[1], _isloop);
        }
        else {            
            cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {       
                if(err) {
                    cc.error(err);              
                    return 
                }    
                cc.audioEngine.playEffect(clip, _isloop);
            });
        }
    }

    releaseAll()
    {
        for(let i = 0; i < this.loadingList.length; i++ ) {
            cc.loader.releaseAsset(this.loadingList[i][1]);            
        }
        this.loadingList = [];
    }

    pauseAll()
    {
        cc.audioEngine.pauseAll();
    }
    
    resumeAll()
    {
        cc.audioEngine.resumeAll();
    }

    muteMusic(_mute: boolean = true) 
    {
        this.isMusic = !_mute;

        if(_mute) {
            cc.audioEngine.setMusicVolume(0);
        }
        else {
            cc.audioEngine.setMusicVolume(1);
        }
    }

    muteEffect(_mute: boolean = true) 
    {
        this.isEffect = !_mute;

        if(_mute) {
            cc.audioEngine.setEffectsVolume(0);
        }
        else {
            cc.audioEngine.setEffectsVolume(1);
        }
    }

    // update (dt) {}
}
