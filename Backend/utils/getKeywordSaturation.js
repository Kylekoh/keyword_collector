const getKeywordSaturation = (n) => {
    let saturationState = ''
    if (n < 5) {
        saturationState = '매우 낮음'
    } else if (n >= 5 && n < 10) {
        saturationState = '낮음'
    } else if (n >= 10 && n < 30) {
        saturationState = '보통'
    } else if (n >= 30 && n < 50) {
        saturationState = '높음'
    } else if (n >= 50) {
        saturationState = '매우 높음'
    }
    // console.log(saturationState)
    return saturationState
}

module.exports = { getKeywordSaturation }