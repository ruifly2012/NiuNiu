
cc.Class({
    extends: cc.Component,

    ctor: function () {

        this.CardInfo = {
            canselect: true,
            selected: false,
            data: null
        };
        this.Num = { // 實際label->box位置
            first: null,
            second: null,
            third: null,
            total: null
        };
        this.selectedCard = []; // 紀錄被選中的卡片
        this.selectedCardPtr = 0;
        this.totalNumber = 0; // 紀錄總合為多少
    },

    properties : {
        poker1:{
            default: null,
            type: cc.Node
        },
        poker2:{
            default: null,
            type: cc.Node
        },
        poker3:{
            default: null,
            type: cc.Node
        },
        poker4:{
            default: null,
            type: cc.Node
        },
        poker5: {
            default: null,
            type: cc.Node
        },
        interface: {
            default: null,
            type: cc.Node
        },
        firstNum:{
            default: null,
            type: cc.Node
        },
        secondNum:{
            default: null,
            type: cc.Node
        },
        thirdNum:{
            default: null,
            type: cc.Node
        },
        totalNum:{
            default: null,
            type: cc.Node
        },
        cardError:{
            default: null,
            type: cc.Node
        }
    },
    showCard(pokers){
        this.poker1.getComponent("PokerControl").setCard(pokers.Me[0], true);
        this.poker2.getComponent("PokerControl").setCard(pokers.Me[1], true);
        this.poker3.getComponent("PokerControl").setCard(pokers.Me[2], true);
        this.poker4.getComponent("PokerControl").setCard(pokers.Me[3], true);
        this.poker5.getComponent("PokerControl").setCard(pokers.Me[4], true);
    },
    showButtonClick(){

        var pokerCardType = {
            spade: "spade",//黑桃
            hearts: "hearts",//红桃
            redslice: "redslice",//红方
            blackberry: "blackberry",//黑梅
        };
        var cardNo = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
        var pokerDataItem1 = {
            showTxt: cardNo[0],
            showType: pokerCardType["spade"],
            NO: 1
        };
        var pokerDataItem2 = {
            showTxt: cardNo[11],
            showType: pokerCardType["hearts"],
            NO: 2
        };
        var pokerDataItem3 = {
            showTxt: cardNo[12],
            showType: pokerCardType["redslice"],
            NO: 3
        };
        var pokerDataItem4 = {
            showTxt: cardNo[6],
            showType: pokerCardType["blackberry"],
            NO: 4
        };
        var pokerDataItem5 = {
            showTxt: cardNo[8],
            showType: pokerCardType["spade"],
            NO: 5
        };

        // 要存取自己的東西要先加this
        this.poker1.getComponent("PokerControl").setCard(pokerDataItem1, true);
        this.poker2.getComponent("PokerControl").setCard(pokerDataItem2, true);
        this.poker3.getComponent("PokerControl").setCard(pokerDataItem3, true);
        this.poker4.getComponent("PokerControl").setCard(pokerDataItem4, true);
        this.poker5.getComponent("PokerControl").setCard(pokerDataItem5, true);


        this.poker1.getComponent("PokerControl").CardInfo.canselect = true;
        this.poker2.getComponent("PokerControl").CardInfo.canselect = true;
        this.poker3.getComponent("PokerControl").CardInfo.canselect = true;
        this.poker4.getComponent("PokerControl").CardInfo.canselect = true;
        this.poker5.getComponent("PokerControl").CardInfo.canselect = true;
    },
    noBuffButtonClick(){
        global.socket.emit("getPlayersCard", global.uid);
        this.interface.active = false;
    },

    haveBuffButtonClick(){
        global.socket.emit("getPlayersCard", global.uid);
        this.interface.active = false;
    },
    onLoad(){
        var self = this;
        this.Num.first = this.firstNum.getComponent(cc.Label);
        this.Num.second = this.secondNum.getComponent(cc.Label);
        this.Num.third = this.thirdNum.getComponent(cc.Label);
        this.Num.total = this.totalNum.getComponent(cc.Label);
        global.EventListener.on("CardSelected", function () {
            self.fillTheBox();

        });
        global.EventListener.on("CardUnselected", function(){
            self.unfillTheBox();
        });
    },

    start () {

    },

    fillTheBox(){ //

        cc.log("Into fillTheBox");

        var self = this;

        // 步驟0 ： 如果原本的紀錄中(selectedCard(本文件global的陣列))已經有三張牌被選中，unselected第一張牌
        if(self.selectedCardPtr === 3){
            // selectedCard第一個卡unselected，剔除第一個值，所有值向前移動
            switch(self.selectedCard[0]){
                case 1:
                    self.poker1.getComponent("PokerControl").unselect();
                    break;
                case 2:
                    self.poker2.getComponent("PokerControl").unselect();
                    break;
                case 3:
                    self.poker3.getComponent("PokerControl").unselect();
                    break;
                case 4:
                    self.poker4.getComponent("PokerControl").unselect();
                    break;
                case 5:
                    self.poker5.getComponent("PokerControl").unselect();
                    break;
            }
            self.selectedCard[0] = self.selectedCard[1];
            self.selectedCard[1] = self.selectedCard[2];
            //self.selectedCardPtr--;

        }

        cc.log("selectedCardPtr = ", self.selectedCardPtr);

        // 步驟1 : 找到所有被選中的牌

        let selected = []; // 按照順序排列好的，被選中的牌
        let ptr = 0; // 被選中的牌個數

        for(let i = 1 ; i <= 5 ; i++){
            switch(i){
                case 1:
                    if(self.poker1.getComponent("PokerControl").isSelected()) selected[ptr++] = i;
                    break;
                case 2:
                    if(self.poker2.getComponent("PokerControl").isSelected()) selected[ptr++] = i;
                    break;
                case 3:
                    if(self.poker3.getComponent("PokerControl").isSelected()) selected[ptr++] = i;
                    break;
                case 4:
                    if(self.poker4.getComponent("PokerControl").isSelected()) selected[ptr++] = i;
                    break;
                case 5:
                    if(self.poker5.getComponent("PokerControl").isSelected()) selected[ptr++] = i;
                    break;
            }
        }

        // 步驟2 : 和selectedCard(本文件global的陣列)比較
        if(self.selectedCardPtr === 0) {
            self.selectedCard[self.selectedCardPtr++] = selected[0];
            cc.log(self.selectedCard[0]);
        }

        else if(self.selectedCardPtr < 3) { // 找到selectedCard沒有的，insert進去
            cc.log(1, 2 ,"card selected");
            let isFind = 0;
            for(let i = 0 ; i < ptr && !isFind; i++){
                for(let j = 0 ; j < self.selectedCardPtr && !isFind; j++){
                    if(selected[i] === self.selectedCard[j]) break;
                    else if(selected[i] !== self.selectedCard[j] && j === self.selectedCardPtr-1){
                        self.selectedCard[self.selectedCardPtr++] = selected[i];
                        isFind = 1;
                        break;
                    }
                }
            }
        }
        else { // (selectedCard第一個卡unselected，剔除第一個值，所有值向前移動)，找到selectedCard沒有的，insert進去
            cc.log(3 ,"card selected");
            // 找到selectedCard沒有的，insert進去
            self.selectedCardPtr--;
            let isFind = 0;
            for(let i = 0 ; i < ptr && !isFind; i++){
                for(let j = 0 ; j < self.selectedCardPtr && !isFind; j++){
                    if(selected[i] === self.selectedCard[j]) break;
                    else if(selected[i] !== self.selectedCard[j] && j === self.selectedCardPtr-1){
                        self.selectedCard[self.selectedCardPtr++] = selected[i];
                        isFind = 1;
                        break;
                    }
                }
            }
            for(let i = 0 ; i < self.selectedCardPtr ; i++){
                cc.log("selectedCard", i, " = ", self.selectedCard[i]);
            }

        }

        cc.log("selectedCardPtr = ", self.selectedCardPtr);

        self.write();



    },

    unfillTheBox(){
        // 步驟1 : 找到所有被選中的牌
        cc.log("Into unfillTheBox");
        var self = this;

        let selected = []; // 按照順序排列好的，被選中的牌
        let ptr = 0; // 被選中的牌個數

        for(let i = 1 ; i <= 5 ; i++){
            switch(i){
                case 1:
                    if(self.poker1.getComponent("PokerControl").isSelected()) selected[ptr++] = i;
                    break;
                case 2:
                    if(self.poker2.getComponent("PokerControl").isSelected()) selected[ptr++] = i;
                    break;
                case 3:
                    if(self.poker3.getComponent("PokerControl").isSelected()) selected[ptr++] = i;
                    break;
                case 4:
                    if(self.poker4.getComponent("PokerControl").isSelected()) selected[ptr++] = i;
                    break;
                case 5:
                    if(self.poker5.getComponent("PokerControl").isSelected()) selected[ptr++] = i;
                    break;
            }
        }

        // 步驟2 : 和selectedCard(本文件global的陣列)比較，陣列的牌 > 選中的牌
        let isFind = 0;
        for(let i = 0 ; i < self.selectedCardPtr && !isFind; i++){
            for(let j = 0 ; j < ptr && !isFind; j++){
                if(self.selectedCard[i] === selected[j]) break;
                else if(self.selectedCard[i] !== selected[j] && j === ptr-1){
                    if(i === 0){
                        self.selectedCard[0] = self.selectedCard[1];
                        self.selectedCard[1] = self.selectedCard[2];
                        self.selectedCardPtr--;
                        cc.log("order 0 of ordered selected card unequal");
                    }
                    else if(i === 1){
                        self.selectedCard[1] = self.selectedCard[2];
                        self.selectedCardPtr--;
                        cc.log("order 1 of ordered selected card unequal");
                    }
                    else{
                        self.selectedCardPtr--;
                        cc.log("order 2 of ordered selected card unequal");
                    }
                    isFind = 1;
                    break;
                }
            }
        }
        if(ptr === 0 && self.selectedCardPtr === 1){ // 最後一張卡片被按下來了(因此ptr為0)
            self.selectedCardPtr--;
            cc.log("0 selected card, clear memory");
        }


        cc.log("selectedCardPtr = ", self.selectedCardPtr);

        //步驟3：填寫數字
        self.write();
    },

    write(){
        var self = this;
        self.clear();
        let total = 0;

        let selected = []; // 按照順序排列好的，被選中的牌
        let ptr = 0; // 被選中的牌個數

        // 依照順序找到被選重的牌
        /*for(let i = 1 ; i <= 5 ; i++){
            switch(i){
                case 1:
                    if(self.poker1.getComponent("PokerControl").isSelected()) selected[ptr++] = i;
                    break;
                case 2:
                    if(self.poker2.getComponent("PokerControl").isSelected()) selected[ptr++] = i;
                    break;
                case 3:
                    if(self.poker3.getComponent("PokerControl").isSelected()) selected[ptr++] = i;
                    break;
                case 4:
                    if(self.poker4.getComponent("PokerControl").isSelected()) selected[ptr++] = i;
                    break;
                case 5:
                    if(self.poker5.getComponent("PokerControl").isSelected()) selected[ptr++] = i;
                    break;
            }
        }




        // 依照順序在格子中填數字
        for(let i = 0 ; i < ptr ; i++){
            switch(i){
                case 0:
                    switch(selected[i]){
                        case 1:
                            self.Num.first.string = self.poker1.getComponent("PokerControl").getNumber();
                            total += self.poker1.getComponent("PokerControl").getNumber();
                            break;
                        case 2:
                            self.Num.first.string = self.poker2.getComponent("PokerControl").getNumber();
                            total += self.poker2.getComponent("PokerControl").getNumber();
                            break;
                        case 3:
                            self.Num.first.string = self.poker3.getComponent("PokerControl").getNumber();
                            total += self.poker3.getComponent("PokerControl").getNumber();
                            break;
                        case 4:
                            self.Num.first.string = self.poker4.getComponent("PokerControl").getNumber();
                            total += self.poker4.getComponent("PokerControl").getNumber();
                            break;
                        case 5:
                            self.Num.first.string = self.poker5.getComponent("PokerControl").getNumber();
                            total += self.poker5.getComponent("PokerControl").getNumber();
                            break;
                    }
                    cc.log("first selected card");
                    break;
                case 1:
                    switch(selected[i]){
                        case 1:
                            self.Num.second.string = self.poker1.getComponent("PokerControl").getNumber();
                            total += self.poker1.getComponent("PokerControl").getNumber();
                            break;
                        case 2:
                            self.Num.second.string = self.poker2.getComponent("PokerControl").getNumber();
                            total += self.poker2.getComponent("PokerControl").getNumber();
                            break;
                        case 3:
                            self.Num.second.string = self.poker3.getComponent("PokerControl").getNumber();
                            total += self.poker3.getComponent("PokerControl").getNumber();
                            break;
                        case 4:
                            self.Num.second.string = self.poker4.getComponent("PokerControl").getNumber();
                            total += self.poker4.getComponent("PokerControl").getNumber();
                            break;
                        case 5:
                            self.Num.second.string = self.poker5.getComponent("PokerControl").getNumber();
                            total += self.poker5.getComponent("PokerControl").getNumber();
                            break;
                    }
                    cc.log("second selected card");
                    break;
                case 2:
                    switch(selected[i]){
                        case 1:
                            self.Num.third.string = self.poker1.getComponent("PokerControl").getNumber();
                            total += self.poker1.getComponent("PokerControl").getNumber();
                            break;
                        case 2:
                            self.Num.third.string = self.poker2.getComponent("PokerControl").getNumber();
                            total += self.poker2.getComponent("PokerControl").getNumber();
                            break;
                        case 3:
                            self.Num.third.string = self.poker3.getComponent("PokerControl").getNumber();
                            total += self.poker3.getComponent("PokerControl").getNumber();
                            break;
                        case 4:
                            self.Num.third.string = self.poker4.getComponent("PokerControl").getNumber();
                            total += self.poker4.getComponent("PokerControl").getNumber();
                            break;
                        case 5:
                            self.Num.third.string = self.poker5.getComponent("PokerControl").getNumber();
                            total += self.poker5.getComponent("PokerControl").getNumber();
                            break;
                    }
                    cc.log("third selected card");
                    break;
            }

        }*/

        for(let i = 0 ; i < self.selectedCardPtr ; i++){
            switch(i){
                case 0:
                    switch(self.selectedCard[i]){
                        case 1:
                            self.Num.first.string = self.poker1.getComponent("PokerControl").getNumber();
                            total += self.poker1.getComponent("PokerControl").getNumber();
                            break;
                        case 2:
                            self.Num.first.string = self.poker2.getComponent("PokerControl").getNumber();
                            total += self.poker2.getComponent("PokerControl").getNumber();
                            break;
                        case 3:
                            self.Num.first.string = self.poker3.getComponent("PokerControl").getNumber();
                            total += self.poker3.getComponent("PokerControl").getNumber();
                            break;
                        case 4:
                            self.Num.first.string = self.poker4.getComponent("PokerControl").getNumber();
                            total += self.poker4.getComponent("PokerControl").getNumber();
                            break;
                        case 5:
                            self.Num.first.string = self.poker5.getComponent("PokerControl").getNumber();
                            total += self.poker5.getComponent("PokerControl").getNumber();
                            break;
                    }
                    cc.log("first selected card");
                    break;
                case 1:
                    switch(self.selectedCard[i]){
                        case 1:
                            self.Num.second.string = self.poker1.getComponent("PokerControl").getNumber();
                            total += self.poker1.getComponent("PokerControl").getNumber();
                            break;
                        case 2:
                            self.Num.second.string = self.poker2.getComponent("PokerControl").getNumber();
                            total += self.poker2.getComponent("PokerControl").getNumber();
                            break;
                        case 3:
                            self.Num.second.string = self.poker3.getComponent("PokerControl").getNumber();
                            total += self.poker3.getComponent("PokerControl").getNumber();
                            break;
                        case 4:
                            self.Num.second.string = self.poker4.getComponent("PokerControl").getNumber();
                            total += self.poker4.getComponent("PokerControl").getNumber();
                            break;
                        case 5:
                            self.Num.second.string = self.poker5.getComponent("PokerControl").getNumber();
                            total += self.poker5.getComponent("PokerControl").getNumber();
                            break;
                    }
                    cc.log("second selected card");
                    break;
                case 2:
                    switch(self.selectedCard[i]){
                        case 1:
                            self.Num.third.string = self.poker1.getComponent("PokerControl").getNumber();
                            total += self.poker1.getComponent("PokerControl").getNumber();
                            break;
                        case 2:
                            self.Num.third.string = self.poker2.getComponent("PokerControl").getNumber();
                            total += self.poker2.getComponent("PokerControl").getNumber();
                            break;
                        case 3:
                            self.Num.third.string = self.poker3.getComponent("PokerControl").getNumber();
                            total += self.poker3.getComponent("PokerControl").getNumber();
                            break;
                        case 4:
                            self.Num.third.string = self.poker4.getComponent("PokerControl").getNumber();
                            total += self.poker4.getComponent("PokerControl").getNumber();
                            break;
                        case 5:
                            self.Num.third.string = self.poker5.getComponent("PokerControl").getNumber();
                            total += self.poker5.getComponent("PokerControl").getNumber();
                            break;
                    }
                    cc.log("third selected card");
                    break;
            }

        }

        if(total !== 0){
            self.Num.total.string = total;
        }
        self.totalNumber = total;

        //if(self.Num.first.string != 0 && self.Num.second.string != 0 &&self.Num.third.string != 0) self.cardError.active = false;
        //else self.cardError.active = true;
    },

    clear(){
        var self = this;
        self.Num.first.string = '';
        self.Num.second.string = '';
        self.Num.third.string = '';
        self.Num.total.string = '';
        cc.log("clear all box to none");
    },

    isDoubleOfTen(){
        var self = this;
        return ( (self.totalNumber%10)===0 );
    },

    isThreeSelected(){
        return (this.selectedCardPtr == 3);

    }




});
