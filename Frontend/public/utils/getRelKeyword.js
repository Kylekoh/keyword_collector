// 연관키워드 추출(7개)
function getRelKeyword (keywordObjectArray) {
    
    const relKeyword = [];
    if (keywordObjectArray.length <= 1) {
        relKeyword.push('일부노출 키워드')
    } else {
        for (i = 1; i < 8; i++) {
            relKeyword.push(keywordObjectArray[i].relKeyword)
        }
    }
    return relKeyword
}


module.exports = { getRelKeyword }