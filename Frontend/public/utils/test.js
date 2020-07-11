const{ getAddSeperator }  = require('./helpNumber')

const totalArraySum = (arr) => {
    const arraySum = arr.reduce((s, e) => s + e, 0)
    return arraySum
}

const getMaleArraySum = (arr) => {
        const result = []
    for (let i = 1; i <= arr.length - 1; i += 2) {
        result.push(arr[i])
    }
    const totalSum = totalArraySum(result)
    // console.log(totalSum)
    return totalSum
}

const getFemaleArraySum = (arr) => {
    const result = []
    for (let i = 0; i <= arr.length - 1; i += 2) {
        result.push(arr[i])
    }
    const totalSum = totalArraySum(result)
    // console.log(totalSum)
    return totalSum
}

// 남, 여로 나눠져있는 raw data를 연령대로 나타나기위해 쌍으로 묶어서 합해주는 과정
const getPairsSum = (arr) => {
    const resultArray = arr.reduce((a, e, i) => (a[a.length - 1] += e, i % 2 && i !== arr.length - 1 && a.push(0), a), [0])
    // console.log(resultArray)
    return resultArray
}


// 성별에 따른 PC, 모바일 값들을 %로 표현
// PC %
const getMonthlyPcRatio = (userStat) => {
    const addMalePcSum = getMaleArraySum(userStat.monthlyPcQcCnt)
    const addFemalePcSum = getFemaleArraySum(userStat.monthlyPcQcCnt)
    const totalSumMonthlyPc = totalArraySum(userStat.monthlyPcQcCnt)
    const monthlyPcMaleRatio = (addMalePcSum/totalSumMonthlyPc * 100).toFixed(2) + '%'
    const monthlyPcFemaleRatio = (addFemalePcSum/totalSumMonthlyPc * 100).toFixed(2) + '%'
    // console.log(monthlyMaleRatio, monthlyFemaleRatio)
    return {monthlyPcMaleRatio, monthlyPcFemaleRatio}
}

// 모바일 %
const getMonthlyMobileRatio = (userStat) => {
    const addMaleMobileSum = getMaleArraySum(userStat.monthlyMobileQcCnt)
    const addFemaleMobileSum = getFemaleArraySum(userStat.monthlyMobileQcCnt)
    const totalSumMonthlyMobile = totalArraySum(userStat.monthlyMobileQcCnt)
    const monthlyMobileMaleRatio = (addMaleMobileSum/totalSumMonthlyMobile * 100).toFixed(2) + '%'
    const monthlyMobileFemaleRatio = (addFemaleMobileSum/totalSumMonthlyMobile * 100).toFixed(2) + '%'
    // console.log(monthlyMaleRatio, monthlyFemaleRatio)
    return { monthlyMobileMaleRatio, monthlyMobileFemaleRatio }
}


// 연령대별 PC, 모바일 Array를 하나로 합치고 이를 상대적 퍼센트 값으로 리턴한다
const getAgeMonthlyPercent = (userStat) => {
    const pcAgeMonthly = getPairsSum(userStat.monthlyPcQcCnt)
    const mobileAgeMonthly = getPairsSum(userStat.monthlyMobileQcCnt)
    // PC + 모바일 을 하나의 Array로
    const addAgeMonthly = pcAgeMonthly.map((a, i) => a + mobileAgeMonthly[i])
    const totalSumAgeMonthly =  totalArraySum(addAgeMonthly)
    // console.log(addAgeMonthly)
    // console.log(totalSumAgeMonthly)
    const ageMonthlyPercentRaw = addAgeMonthly.map(x => (x/totalSumAgeMonthly * 100).toFixed(1) + '%')
    const orders = ['0', '1', '2', '3', '4', '5', '6']
    const ageMonthlyPercent = {}

    orders.forEach((order, i) => ageMonthlyPercent[order] =ageMonthlyPercentRaw[i])
   
    return ageMonthlyPercent

}

// 월간 검색동향 > output
// 1년간 검색동향(지난 12개월 간의 검색어 변화추이)
const getmonthlySearchTrend = (monthlyProgressList) => {
    const monthlyProgressPcQcCnt = monthlyProgressList.monthlyProgressPcQcCnt
    const monthlyProgressMobileQcCnt = monthlyProgressList.monthlyProgressMobileQcCnt
    const monthlySearchTrendRaw = monthlyProgressPcQcCnt.map((a, i) =>  a + monthlyProgressMobileQcCnt[i])
    const monthlySearchTrendBefore = monthlySearchTrendRaw.map((a) => getAddSeperator(a))
    const orders = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    const monthlySearchTrend = {}

    orders.forEach((order, i) => monthlySearchTrend[order] =monthlySearchTrendBefore[i])

    // console.log(monthlySearchTrend)
    return monthlySearchTrend
}

module.exports = {
    getmonthlySearchTrend,
    getAgeMonthlyPercent,
    getMonthlyPcRatio,
    getMonthlyMobileRatio,
}
// getmonthlySearchTrend()
// getMonthlyPcRatio()
// getMonthlyMobileRatio()
// getAgeMonthlyPercent()