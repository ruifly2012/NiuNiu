import Game from "./Game";
import { GameState } from "./MainStateMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SceneLoading extends cc.Component {
    
    @property(cc.Label) tipLabel: cc.Label = null;

    stateStr: string = "Loading";
    progress: number;
    isLoading: boolean;
    

    onLoad(){
        
        Game.Inst.utils.resize();
        cc.warn("onLoading");
        this.progress = 0;
        //this.tipLabel.string = this.stateStr;
        this.startPreloading();
    }

    start(){
        //Game.Inst.animationMgr.play("LogoAnim",1.0,true);
    }

    startPreloading()
    {
        this.stateStr = "Loading";
        this.isLoading = true;
        
        Game.Inst.resourcesMgr.preload((p) => {
            this.progress = p;

            if (this.progress >= 1.0){
                this.onLoadComplete();
            }
        });
    }

    onLoadComplete()
    {
        if (!this.isLoading)
            return;

        this.isLoading = false;
        this.stateStr = "SwitchingScene";
        Game.Inst.mainStateMgr.changeStage(GameState.Game);
    }

    // called every frame, uncomment this function to activate update callback
    update(dt) 
    {
        if (this.stateStr.length == 0)
        {
            return;
        }

        this.tipLabel.string = this.stateStr + " ";
        if (this.isLoading)
        {
            this.tipLabel.string += Math.floor(this.progress * 100) + "%";
        }
    }
}
