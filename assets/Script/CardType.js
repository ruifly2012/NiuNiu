// 這裡主要是區分排型，所以直接幫他算牌型，取最大的輸出
/**
 0  "錯誤牌型",
 1  "單張", x1
 2  "對子", x2
 3  "三張牌", x3
 4  "三帶一", x4
 5  "三帶二", x4
 6  "單順子", x5up
 7  "雙順子", x6
 8  "三順子", x9
 9  "四帶二單", x6
 10"四帶一對", x6
 11"炸彈", x4
 12"火箭", x2 Gg
 13"飛機"
 14"軟炸彈"
 */
/**
 0  "錯誤牌型",
 1  "無牛", x1
 2  "有牛", x2
 3  "牛牛", x3
 4  "銀牛", x4
 5  "金牛", x4
 6  "炸彈", x5up
 7  "五小牛", x6
 */
/**
 0  "錯誤牌型",
 1  "無牛", x1 //
 2  "有牛", x2
 3  "牛牛", x3
 4  "銀牛", x4
 5  "金牛", x4
 6  "炸彈", x5up
 7  "五小牛", x6
 */
const CardUtil = require('./CardUtil');
var CardType = {

    Types: [
        "錯誤牌型",
        "無牛",
        "有牛",
        "牛牛",
        "銀牛",
        "金牛",
        "炸彈",
        "五小牛",
    ],

    judgeType(cards) {
        if (cards == "PASS")
            return 0;
        if (cards == null || cards.length == 0) {
            return 0;
        }

        var SortedCard = JSON.parse(JSON.stringify(cards));
        SortedCard.sort(CardUtil.gradeUp); // 升冪排列
        if (this.isSingle(SortedCard)) { return 1; }//單張
        if (this.isDouble(SortedCard)) { return 2; }//兩張
        if (this.isTriple(SortedCard)) { return 3 }//三張
        if (this.isThreeOne(SortedCard)) { return 4 }//三帶一
        if (this.isThreeTwo(SortedCard)) { return 5 }//三帶二
        if (this.isStraight(SortedCard)) { return 6 }//單順
        if (this.isDStraight(SortedCard)) { return 7; }//雙順
        if (this.isTStraight(SortedCard)) { return 8; }//三順
        if (this.isFourTwoDiff(SortedCard)) { return 9 }//四帶二單
        if (this.isFourTwoSame(SortedCard)) { return 10 }//四帶一對
        if (this.isBomb(SortedCard)) { return 11 }//炸彈
        if (this.isRocket(SortedCard)) { return 12 }//火箭
        if (this.isAirplane(SortedCard)) { return 13 }//飛機
        if (this.isSoftBomb(SortedCard)) { return 14 }//軟炸彈
        return 0;
    },
    classifyTypes(cards) { // 數這副cards中，每個數字有幾張
        if (!cards.length) return; // 沒卡，離開
        if (cards.length == 1) return cards[0].showTxt; //  一張卡，回傳卡的數字

        var res = {};
        for (var i = 0; i < cards.length; i++) { // 開一個字典，卡的數字對應到有幾張卡，ex : 'J' : 3
            if (!res[cards[i].showTxt]) {
                res[cards[i].showTxt] = 1
            } else {
                res[cards[i].showTxt]++
            }
        }
        return res;
    },

    isThreeTen(cards){ // 找有沒有三張10的組合，而且一個人一定有五張牌
        var res = {};
        let number = 0;
        let isThreeten = false;

        if((this.cardToGrade(cards[0].showTxt) + this.cardToGrade(cards[1].showTxt) + this.cardToGrade(cards[2].showTxt) + this.cardToGrade(cards[3].showTxt) + this.cardToGrade(cards[4].showTxt)) < 10){ // 找一找有沒有五小牛
 
        }





        for(let i = 0 ; i < 3 ; i++){ // 10種組合一個一個找，把相加是十的先抓出來，可以知道這副牌有牛沒牛
            for(let j = i+1 ; j < 3 ; j++){
                for(let k = j+1 ; k < 4 ; k++){
                    if( (this.cardToGrade(cards[i].showTxt) + this.cardToGrade(cards[j].showTxt) + this.cardToGrade(cards[k].showTxt))%10 === 0 ) {
                        res[number++] = [i, j, k];
                        isThreeten = true;
                    }
                }
            }
        }



        if(isThreeten){
            return res;
        }
        else{
            return false;
        }
    },
    isNoCow(cards){
        if(isThreeTen(cards) == false){
            return true;
        }
        else{
            return false;
        }
    },

    isSingle(cards) {
        if (cards.length != 1) { return false; }
        return true;
    },
    isDouble(cards) {
        if (cards.length != 2) { return false; }
        if (cards[0].showTxt == cards[1].showTxt) { return true }
        return false;
    },
    isTriple(cards) {
        if (cards.length != 3) { return false; }
        if (cards[0].showTxt == cards[1].showTxt && cards[0].showTxt == cards[2].showTxt) { return true }
        return false;
    },
    isThreeOne(cards) {
        if (cards.length != 4) { return false; }
        var res = this.classifyTypes(cards);
        var keys = Object.keys(res);
        if (keys.length != 2) { return false; }

        if (res[keys[0]] == 3 && res[keys[1]] == 1 || res[keys[0]] == 1 && res[keys[1]] == 3)
            return true;

        return false;
    },
    isThreeTwo(cards) {
        if (cards.length != 5) { return false; }
        var res = this.classifyTypes(cards);
        var keys = Object.keys(res);
        if (keys.length != 2) { return false; }

        if (res[keys[0]] == 3 && res[keys[1]] == 2 || res[keys[0]] == 2 && res[keys[1]] == 3)
            return true;

        return false;
    },
    isTStraight(cards) {
        if (cards.length % 3 != 0 || cards.length < 6 || this.findCard(cards, 2)) {
            return false;
        }

        if (cards.length >= 6 && cards.length % 3 == 0) {
            var res = this.classifyTypes(cards);

            var keys = Object.keys(res);
            if (keys.length < 2) { return false; }


            for (var i = 1; i < keys.length; i++) {
                if (res[keys[i]] != 3 || res[keys[i - 1]] != 3)
                    return false;
                if (Math.abs(CardUtil.cardGrade[keys[i]] - CardUtil.cardGrade[keys[i - 1]]) != 1) {
                    return false;
                }
            }
            return true;
        }
    },
    isDStraight(cards) {
        if (cards.length % 2 != 0) {
            return false
        }
        if (cards.length < 6 || this.findCard(cards, 2)) {
            return false;
        }
        if (this.findCard(cards, 2)) {
            return false;
        }
        if (cards.length >= 6 && cards.length % 2 == 0) {
            var res = this.classifyTypes(cards);
            var keys = Object.keys(res);
            if (keys.length < 3) { return false; }
            for (var i = 1; i < keys.length; i++) {
                if (res[keys[i]] != 2 || res[keys[i - 1]] != 2)
                    return false;
                if (Math.abs(CardUtil.cardGrade[keys[i]] - CardUtil.cardGrade[keys[i - 1]]) != 1) {
                    return false;
                }
            }
            return true;
        }

    },
    isStraight(cards) {
        if (cards.length < 5) {
            return false;
        }
        if (this.findCard(cards, 2)) {
            return false;
        }
        else {


            for (var i = 1; i < cards.length; i++) {
                if (Math.abs(CardUtil.cardGrade[cards[i].showTxt] - CardUtil.cardGrade[cards[i - 1].showTxt]) != 1) {
                    return false;
                }
            }
            return true;
        }
    },
    isRocket(cards) {
        if (cards.length != 2) { return false };
        if (cards[0].showTxt == "G" && cards[1].showTxt == "g" || cards[1].showTxt == "G" && cards[0].showTxt == "g")
            return true;
        return false;
    },
    isBomb(cards) {
        if (cards.length != 4) { return false; }
        for (var i = 0; i < cards.length; i++) {
            if (cards.showType == "laizi")
                return false;
        }
        for (var i = 1; i < cards.length; i++) {
            if (cards[i].showTxt != cards[i - 1].showTxt) { return false }
        }
        return true;
    },
    isSoftBomb(cards) {
        if (cards.length < 4) { return false; }

        for (var i = 1; i < cards.length; i++) {
            if (cards[i].showTxt != cards[i - 1].showTxt) { return false }
        }
        return true;
    },
    isFourTwoSame(cards) {
        if (cards.length != 6) { return false; }
        var res = this.classifyTypes(cards);
        var keys = Object.keys(res);
        if (keys.length != 2) { return false; }

        if (res[keys[0]] == 4 && res[keys[1]] == 2 || res[keys[0]] == 2 && res[keys[1]] == 4)
            return true;

        return false;
    },
    isFourTwoDiff(cards) {
        if (cards.length != 6) { return false; }
        var res = this.classifyTypes(cards);
        var keys = Object.keys(res);
        if (keys.length != 3) { return false; }

        if (res[keys[0]] == 4 && res[keys[1]] == 1 && res[keys[2]] == 1 ||
            res[keys[0]] == 1 && res[keys[1]] == 4 && res[keys[2]] == 1 ||
            res[keys[0]] == 1 && res[keys[1]] == 1 && res[keys[2]] == 4)
            return true;

        return false;
    },
    isAirplane(cards) {

        if (cards.length < 6) {
            return false;
        };
        if (cards.length % 4 != 0 && cards.length % 5 != 0)
            return false;
        var res = this.classifyTypes(cards);
        var keys = Object.keys(res);
        if (keys.length < 4) { return false; }
        console.log(res);
        var triple = [];
        var double = [];
        var single = [];
        for (var i = 0; i < keys.length; i++) {
            if (res[keys[i]] == 3)
                triple.push(keys[i]);
            if (res[keys[i]] == 2)
                double.push(keys[i]);
            if (res[keys[i]] == 1)
                single.push(keys[i]);
        }
        console.log(single);
        console.log(double);
        console.log(triple);
        if (triple.length < 2)
            return false;
        if (double.length < 2 && single.length < 2)
            return false;
        for (var i = 1; i < triple.length; i++) {
            if (Math.abs(CardUtil.cardGrade[triple[i]] - CardUtil.cardGrade[triple[i - 1]]) != 1)
                return false;
        }
        if ((triple.length == double.length && single.length == 0) || (triple.length == single.length && double.length == 0))
            return true;
        else
            return false;

    },
    findMost(arr) {
        if (!arr.length) return
        if (arr.length == 1) return arr[0].showTxt;
        var res = {}
        for (var i = 0, l = arr.length; i < l; i++) {
            if (!res[arr[i].showTxt]) {
                res[arr[i].showTxt] = 1
            } else {
                res[arr[i].showTxt]++
            }
        }

        var keys = Object.keys(res)
        var maxNum = 0, maxEle
        var k
        for (var i = 0, l = keys.length; i < l; i++) {
            if (res[keys[i]] > maxNum) {
                maxNum = res[keys[i]]
                k = i;
                maxEle = keys[i]
            }
        }

        return keys[k];
    },
    findCard(cards, text) {
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].showTxt == text)
                return 1;
        }
        return 0;
    }
};

CardType.cardToGrade = { // 看牌型時，JQK都是十，但是在CardUtil，單張卡片的大小，J11,Q12,K13
    A: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 10,
    Q: 10,
    K: 10
};

module.exports = CardType;