import global from "../Common/Global";
const {ccclass, property} = cc._decorator;

@ccclass
export default class TimeController extends cc.Component {

    private Obj: any = {
        clock: null,
        timer: null,
        countdownSecond: 0,
        stage: 0,
        time: null,
        time2: null
    }
    

    @property(cc.Node)
    stage: cc.Node = null;

    Reset() {
        this.Obj.clock.active = false;
        this.activeButton(null); // 下方宣告此函式的細節，要啟動哪一個階段
    }

    init() {

        //var self = this;
        this.Obj = {
            clock: cc.find("Clock", this.node),
            time: cc.find("Clock/time", this.node),
            time2: cc.find("Clock/time2", this.node)
           
        };

    }

    callback() {
        var self = this;
        if (self.Obj.countdownSecond === 1) {
            // 在第六次执行回调时取消这个计时器
            this.unschedule(this.callback);
        }
        self.Obj.countdownSecond--;
        self.UpdateTimer2(self.Obj.countdownSecond);
    }

    start() { // 進入點
        var self = this;

        this.init(); // 找clock位置

        /*global.Instance.socket().on("roomReady", function (Info) {
            self.activeButton(0);
            cc.log("activeButton : 0");
            //self.scheduleOnce(function() {self.activeButton(2);}, 2);
        });*/
        // =====>
        global.Instance.EventListener.on("roomReady", function (event, Info) {
            self.activeButton(0);
            cc.log("activeButton : 0");
        });

        /*global.socket.on("stageChange", function (stage, timeout) {
            cc.log("activeButton : %d", stage);
            self.activeButton(stage);
            cc.log("activeFinish : %d", stage);
            if (stage == 2 || stage == 3 || stage == 4) {
                cc.log("enter clock activte...");
                self.Obj.countdownSecond = timeout;
                self.Obj.clock.active = true;
                self.UpdateTimer2(timeout);
                self.schedule(self.callback, 1);
            }
            else {
                cc.log("enter clock hide...");
                self.Obj.clock.active = false;
            }
        });*/
        // =====>
        global.Instance.EventListener.on("stageChange", function (event, stage, timeout) {
            cc.log("activeButton : %d", stage);
            self.activeButton(stage);
            cc.log("activeFinish : %d", stage);
            if (stage == 2 || stage == 3 || stage == 4) {
                cc.log("enter clock activte...");
                self.Obj.countdownSecond = timeout;
                self.Obj.clock.active = true;
                self.UpdateTimer2(timeout);
                self.schedule(self.callback, 1);
            }
            else {
                cc.log("enter clock hide...");
                self.Obj.clock.active = false;
            }
        });


        this.Reset();// 讓時鐘消失，回到無階段
        //this.activeButton(0); // 沒有任何階段被啟動
        this.activeButton(-1); // 階段waiting被啟動
    }

    unscheduleTimer(){
        var self = this;
        self.unschedule(self.callback);
        self.Obj.clock.active = false;
    }

    activeButton(Type) { // 啟動哪一個階段
        cc.log("active %d", Type);
        for (var i = 0; i < this.stage.getChildren().length; i++) {
            this.stage.getChildren()[i].active = (i == Type);
        }
        // 根據的是stage中，每一個階段的位子，例如搶樁是位置1，下注是位置2，等等

    }

    //更新倒數計時鬧鐘(當從SERVER傳來時)
    UpdateCounter(timerInfo) {
        var self = this;
        this.Reset();// 先讓時鐘消失，回到階段0

        this.activeButton(timerInfo.active);// timerInfo是server傳來的資料，包含在哪一個階段

        if (timerInfo.whosTurn == "Result") { // 如果到了顯示結果階段，但是牛牛不用(我們還沒改server，所以先不刪)
            // 在stage中，Result/timer的組件Num2Sprite
            cc.find("Result/timer", this.stage).getComponent("Num2Sprite").setNum(timerInfo.countdownSecond);
        }
        else
            if (timerInfo.whosTurn != null) {
                this.Obj.clock.active = true; // 啟動時鐘
                this.Obj.clock.getComponent("Clock").settime(timerInfo.countdownSecond, self); // 寫上剩餘時間
                if (timerInfo.countdownSecond < 10) // 如果剩餘時間小於10，撥放動畫
                    this.Obj.clock.getComponent(cc.Animation).play();
            }

       
    }

    UpdateTimer(timerInfo){
        var self = this;
        this.Obj.clock.getComponent("Clock").settime(timerInfo.countdownSecond, self); // 寫上剩餘時間
    }

    UpdateTimer2(time){
        var self = this;
        if (time == 9) time = 8;
        else if (time == 8) time = 9;
        this.Obj.clock.getComponent("Clock").settime(time, self); // 寫上剩餘時間
    }

}
