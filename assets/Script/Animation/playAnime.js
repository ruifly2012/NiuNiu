
cc.Class({
    extends: cc.Component,

    properties: {
        animation : cc.Animation,
		clipName : ""
    },

    play() {
		if(!this.animation) {
			cc.warn("Set a target animation first!");
			return;
		}
		var clip = (this.clipName == "") && null || this.clipName;
		this.animation.play(clip); 
	},
});

