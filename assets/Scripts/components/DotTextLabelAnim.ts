

const {ccclass, property} = cc._decorator;

@ccclass
export default class DotTexLableAnim extends cc.Component {

    @property(cc.Label) label: cc.Label = null;
    @property(Number) dotAmount: number = 3;
    @property(Number) speed: number = 1.0;

    counter = 0;
    timer = undefined;

    onLoad() {
        this.init();
        this.timer = function () {
            if (this.counter < this.dotAmount){
                this.label.string += ".";
                this.counter++;
            }
            else {
                this.label.string = this.label.string.substr(0,this.label.string.length - this.dotAmount);
                this.counter = 0;
            }
        }.bind(this);
    }

    init() {
        this.counter = 0;
    }

    play() {
        this.init();
        this.schedule(this.timer,this.speed);
    }

    stop() {
        this.unschedule(this.timer);
    }

}
