cc.Class({
    extends: cc.Component,

    ctor: function () {
        this.deck = [];
    },

    properties: {

        card: {

            default: null,
            type: cc.Prefab,

        }
    },

    onLoad() {

        //產生1副副牌
        var pokerCardType = {
            spade: "spade",//黑桃
            hearts: "hearts",//红桃
            redslice: "redslice",//红方
            blackberry: "blackberry",//黑梅
        };
        var ghostCardType = {
            bigG: "bigG",//大王
            smallG: "smallG",//小王
        };
        var cardNo = [3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A", 2, "g", "G"];
        for (var k = 0; k < 1; k++) {
            var num = 0;
            for (var i = 0; i < cardNo.length; i++) {
                if (i < cardNo.length - 2) {
                    for (var key in pokerCardType) {
                        var pokerDataItem = {
                            showTxt: cardNo[i],
                            showType: pokerCardType[key],
                            NO: num++
                        }

                        var newCard = cc.instantiate(this.card);
                        newCard.getComponent("PokerControl").showPoker(pokerDataItem, false);
                        this.deck.push(newCard);
                    }
                } else {
                    if (i == 13) {
                        var pokerDataItem = {
                            showTxt: cardNo[i],
                            showType: ghostCardType.smallG,
                            NO: num++
                        }
                        var newCard = cc.instantiate(this.card);
                        newCard.getComponent("PokerControl").showPoker(pokerDataItem, false);
                        this.deck.push(newCard)

                    } else if (i == 14) {
                        var pokerDataItem = {
                            showTxt: cardNo[i],
                            showType: ghostCardType.bigG,
                            NO: num++
                        }

                        var newCard = cc.instantiate(this.card);
                        newCard.getComponent("PokerControl").showPoker(pokerDataItem, false);
                        this.deck.push(newCard)
                    }
                }
            }
        }

        //產生5張牌背
        var cardBack = 5;
        for (var i = 0; i < cardBack; i++) {
            newCard = cc.instantiate(this.card);
            newCard.getComponent("PokerControl").showPoker(null, false);
            this.deck.push(newCard);
        }

        //三份狀態牌
        var status = ["Double", "PASS", "notCall", "notDouble", "onePoint", "threePoints", "twoPoints"];

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < status.length; j++) {
                newCard = cc.instantiate(this.card);
                newCard.getComponent("PokerControl").showstatus(status[j]);
                this.deck.push(newCard);
            }
        }

        this.node.opacity = 0;
        //顯示pool中的牌
        const interval = 90;
        for (var i = 0; i < this.deck.length; i++) {
            this.node.addChild(this.deck[i], i);
            this.node.children[i].x = i % 13 * interval;
            this.node.children[i].y = i / 13 * -interval;

        }
    },

    getCardFormPool(cardInfo) {
        for (var i = 0; i < this.node.children.length; i++) {
            if (JSON.stringify(cardInfo) == JSON.stringify(this.node.children[i].getComponent("PokerControl").getValue())) {
                return (this.node.children[i]);
            }
        }

        //pool中沒有需要的牌時新增
        var newCard = cc.instantiate(this.card);
        newCard.getComponent("PokerControl").setCard(cardInfo, false);

        return newCard;
    },

    throwCardToPool(cardInstance) {
        cardInstance.parent = this.node;
    },

    ArrangeCards(newCardsInfo, whoWants, CanTouch) {

        var Interval=70;
        if (whoWants.name == "DizhuCards") {
            Interval = 200;
        }
        else if ((whoWants.name == "select2") || (whoWants.name == "select1")) {
            Interval = 200;
        }

        var initialPositionX = 0;

        if (typeof (newCardsInfo) == "string") {
            newCardsInfo = [newCardsInfo];
        }

        if (whoWants.anchorX > 0.51) {
            initialPositionX = (-newCardsInfo.length * Interval)-25;
        } else if (whoWants.anchorX < 0.49) {
            initialPositionX = 100;
        } else {
            initialPositionX = -(parseInt(newCardsInfo.length / 2)) * Interval;
        }

        whoWants.getComponent(cc.Layout).enabled = false;


        //先剔除更新後不該存在的卡牌(節點)
        var alreadyCountIndex = []; //若有重複的牌只能算1張
        for (var i = 0; i < whoWants.children.length;) {

            var exist = false;
            for (var j = 0; j < newCardsInfo.length; j++) {
                if (JSON.stringify(whoWants.children[i].getComponent("PokerControl").getValue()) == JSON.stringify(newCardsInfo[j])) {

                    if (alreadyCountIndex.indexOf(j) == -1) {
                        exist = true;
                        alreadyCountIndex.push(j);
                        break;
                    }
                }
            }

            if (!exist) {
                this.throwCardToPool(whoWants.children[i]);
            } else {
                i++
            }
        }

        //將新牌加入顯示牌組
        var newAdded=[] //若加入重複的牌分開計算
        for (var i = 0; i < newCardsInfo.length; i++) {

            var existIndex = -1;
            for (existIndex = 0; existIndex < whoWants.children.length; existIndex++) {
                if (JSON.stringify(newCardsInfo[i]) == JSON.stringify(whoWants.children[existIndex].getComponent("PokerControl").getValue())) {

                    if (newAdded.indexOf(existIndex) == -1) {

                        break;
                    }
                }
            }
            //不存在就加入新node
            if (existIndex >= whoWants.children.length) {

                var newCard = this.getCardFormPool(newCardsInfo[i]);

                newCard.getComponent("PokerControl").CardInfo.canselect= CanTouch;
                newCard.x = initialPositionX+Interval * i;
                newCard.y = 0;
                newCard.parent = whoWants;
                newCard.zIndex = i;
                newAdded.push(existIndex);
            }
            //存在舊更新位子
            else {
                whoWants.children[existIndex].x = initialPositionX + Interval * i;
                whoWants.children[existIndex].y = 0;
                whoWants.children[existIndex].zIndex = i;
                newAdded.push(existIndex);
            }
        }



    },


});
