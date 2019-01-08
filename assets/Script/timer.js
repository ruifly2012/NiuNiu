//const alarm = 5;//剩N張牌時想警鈴
// 掌管倒數鬧鐘的時間和階段的切換

cc.Class({
    extends: cc.Component,


    ctor: function () {
        this.Obj = {
            clock: null,
            timer: null,
            countdownSecond: 0,
            stage: 0,
            time: null,
            time2: null
            /*Me: null,
            Pre: null,
            Next: null,*/
            //Middle: null
            /*warning: { // warning 牛牛不需要
                Me: null,
                Pre: null,
                Next:null,
            }*/
        }
    },

    properties: {

        stage: {
            default: null,
            type: cc.Node
        },
    },

    Reset() {

        /*this.Obj.warning.Me.active = false;
        this.Obj.warning.Pre.active = false;
        this.Obj.warning.Next.active = false;*/
        this.Obj.clock.active = false;
        this.activeButton(null); // 下方宣告此函式的細節，要啟動哪一個階段
    },

    init() {

        var self = this;
        this.Obj = {
            clock:cc.find("Clock", this.node),
            time:cc.find("Clock/time", this.node),
            time2:cc.find("Clock/time2", this.node)
            /*Me: cc.find("Me", this.node),
            Pre: cc.find("Pre", this.node),
            Next: cc.find("Next", this.node),*/
            //Middle: cc.find("Middle", this.node)
            /*warning: {
                Me: cc.find("warning/Me", this.node),
                Pre: cc.find("warning/Pre", this.node),
                Next: cc.find("warning/Next", this.node),
            }*/
        };


        /*let obj = this.Obj;
            obj.timer = setInterval(function(){
            if(obj.countdownSecond !== 0){
                obj.countdownSecond-=1;
            }
            let Info = {
                countdownSecond: obj.countdownSecond,
            };
            self.UpdateTimer(Info);

        }, 1000);*/

    },
    start() { // 進入點
        var self = this;

        this.init(); // 找clock位置
		global.socket.on("roomReady", function (Info) {
			self.activeButton(1);
			cc.log("activeButton : 1");
			self.scheduleOnce(function() {self.activeButton(2);}, 2);
        });
		
		global.socket.on("stageChange", function (stage) {
			cc.log("activeButton : %d",stage);
			self.activeButton(stage);
			cc.log("activeFinish : %d",stage);
        });
		/*
        global.socket.on("timer", function (Info) {
            //將計數器更新
            self.UpdateCounter(Info);
        });
		*/
        // 等待伺服器回傳訊息，更新剩餘時間
		/*
        global.EventListener.on("EndMyturn", function (roomid) {
            global.socket.emit("EndMyturn", global.uid);

        });
		*/
        // 註冊函式EndMyturn，內容是向server傳遞結束回合的人的名子


        this.Reset();// 讓時鐘消失，回到階段0
        this.activeButton(-1); // 沒有任何階段被啟動

    },

    activeButton(Type) { // 啟動哪一個階段
		cc.log("active %d",Type);
        for (var i = 0; i < this.stage.getChildren().length; i++) {
            this.stage.getChildren()[i].active = (i == Type);
        }
        // 根據的是stage中，每一個階段的位子，例如搶樁是位置1，下注是位置2，等等

    },

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
            this.Obj.clock.getComponent("clock").settime(timerInfo.countdownSecond, self); // 寫上剩餘時間
            if (timerInfo.countdownSecond < 10) // 如果剩餘時間小於10，撥放動畫
                this.Obj.clock.getComponent(cc.Animation).play();
        }

        /*this.Obj.countdownSecond = timerInfo.countdownSecond;
        clearInterval(this.Obj.timer);
        this.Obj.timer = null;
        this.Obj.timer = setInterval(function(){
            if(this.Obj.countdownSecond !== 0){
                this.Obj.countdownSecond-=1;
            }
            let Info = {
                countdownSecond: this.Obj.countdownSecond,
            };
            self.UpdateTimer(Info);

        }, 1000);*/
    },

    UpdateTimer(timerInfo){
        var self = this;
        this.Obj.clock.getComponent("clock").settime(timerInfo.countdownSecond, self); // 寫上剩餘時間
    },

    //結束我的回合(出牌)
    EndMyturn() {
        global.EventListener.fire("EndMyturn", global.roomid);
        global.ButtonCounting = -1;
    }

});

