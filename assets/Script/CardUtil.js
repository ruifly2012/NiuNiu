// 這裡主要是將卡片按照大小順序排列
var CardUtil = {};
CardUtil.Card = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
//CardUtil.GradetoCard = ['0', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
CardUtil.cardGrade = {
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
    J: 11,
    Q: 12,
    K: 13
};
CardUtil.GradetoCard = {
    1: 'A',
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 'J',
    12: 'Q',
    13: 'K'
};
CardUtil.typeGrade = {
    spade: 4,//黑桃
    hearts: 3,//红心
    blackberry: 2,//梅花
    redslice: 1,//红方塊

};
CardUtil.typeDown = function (card1, card2) { // 花色比較，card2花色大小-card1花色大小，card1小為正，card1大為負
    return CardUtil.typeGrade[card2.showType] - CardUtil.typeGrade[card1.showType]
};
//降序排列，考慮花色&數字
CardUtil.gradeDown = function (card1, card2) {
    var Numcmp = CardUtil.cardGrade[card2.showTxt] - CardUtil.cardGrade[card1.showTxt]; // 比數字
    var Typecmp = CardUtil.typeGrade[card2.showType] - CardUtil.typeGrade[card1.showType]; // 比花色
    if (Numcmp > 0)  // 數字card2大於card1
        return 1;
    else if (Numcmp === 0 && Typecmp > 0) // 數字同，但花色card2大於card1
        return 1;
    else if (Numcmp === 0 && Typecmp < 0) // 數字同，但花色card2小於於card1
        return -1;

    return CardUtil.cardGrade[card2.showTxt] - CardUtil.cardGrade[card1.showTxt] // 數字card2小於於card1
};

//升序排列
CardUtil.gradeUp = function (card1, card2) {

    var Numcmp = CardUtil.cardGrade[card1.showTxt] - CardUtil.cardGrade[card2.showTxt]
    var Typecmp = CardUtil.typeGrade[card1.showType] - CardUtil.typeGrade[card2.showType]
    if (Numcmp > 0)
        return 1;
    else if (Numcmp === 0 && Typecmp > 0)
        return 1;
    else if (Numcmp === 0 && Typecmp < 0)
        return -1;

    return CardUtil.cardGrade[card1.showTxt] - CardUtil.cardGrade[card2.showTxt]

};
/*CardUtil.Laizi = function (card1, card2) {
    var Numcmp = CardUtil.cardGrade[card2.showTxt] - CardUtil.cardGrade[card1.showTxt]
    var Typecmp = CardUtil.typeGrade[card2.showType] - CardUtil.typeGrade[card1.showType]
    if (card2.showType == "laizi" && card1.showType != "laizi")
        return 1;
    if (card2.showType != "laizi" && card1.showType == "laizi")
        return -1;
    if (Numcmp > 0)
        return 1;
    else if (Numcmp == 0 && Typecmp > 0)
        return 1;
    else if (Numcmp == 0 && Typecmp < 0)
        return -1;

    return CardUtil.cardGrade[card2.showTxt] - CardUtil.cardGrade[card1.showTxt]
};*/



module.exports = CardUtil;