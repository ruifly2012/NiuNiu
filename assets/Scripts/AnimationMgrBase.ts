import AnimationBase from "./components/animation/AnimationBase";

const { ccclass, property } = cc._decorator;

/**
 * 動畫管理物件
 */
@ccclass
export default class AnimationMgr extends cc.Component {

    private animationList: Array<any>;

    constructor() {
        super();

        this.animationList = [];
        cc.game.addPersistRootNode(this.node);
    }

    /**
     * 取得已註冊的動畫片段
     * @param clipname 動畫片段名稱
     */
    private getAnimationClip(clipname: string) {
        for (let i = 0; i < this.animationList.length; i++) {
            if (this.animationList[i].name == clipname) {
                return this.animationList[i].clip;
            }
        }
        return undefined;
    }

    /**
     * 註冊動畫片段
     * @param _name 動畫片段名稱
     * @param _clip 動畫片段物件
     */
    registAnimationClip(_name: string, _clip: AnimationBase) {
        if (this.getAnimationClip(_name) != undefined) {
            console.log("Bind Animation Error!!");
            return;
        }

        let obj = { clip: _clip, name: _name };
        this.animationList.push(obj);
    }

    /**
     * 註銷動畫片段
     * @param clipname 動畫片段名稱
     */
    unregistAnimationClip(clipname: string) {
        this.animationList = this.animationList.filter((x) => {

            return !(x.name == clipname);
        });
    }

    /**
     * 清空所有可播放的動畫片段
     */
    clear() {
        this.animationList;
    }

    /**
     * 播放已註冊的動畫片段
     * @param anim 動畫片段名稱
     * @param speed 動畫播放速度
     * @param loop 是否重複播放(預設為false)
     * @param onfinished 播放結束後callback
     */
    play(anim: string, speed: number = 1.0, loop: boolean = false, onfinished?) {
        this.getAnimationClip(anim).play(speed, loop, onfinished);
    }

    /**
     * 暫停已註冊的動畫片段
     * @param anim 動畫片段名稱
     */
    pause(anim: string) {
        this.getAnimationClip(anim).pause();
    }

    /**
     * 停止已註冊的動畫片段
     * @param anim 動畫片段名稱
     */
    stop(anim: string) {
        this.getAnimationClip(anim).stop();
    }

    /**
     * 回復已註冊的動畫片段
     * @param anim 動畫片段名稱
     */
    resume(anim: string) {
        this.getAnimationClip(anim).resume();
    }
}
