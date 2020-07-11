const puppeteer = require('puppeteer');
const axios = require('axios');

const { getmonthlySearchTrend,
    getAgeMonthlyPercent,
    getMonthlyPcRatio,
    getMonthlyMobileRatio} = require('./test')

async function getKeywordDetail(keyword, access_token) {
    const encodeKeyword = encodeURIComponent(keyword)
    const url = `https://manage.searchad.naver.com/keywordstool?format=json&hintKeywords=&includeHintKeywords=0&siteId=&biztpId=&month=&event=&showDetail=1&keyword=${encodeKeyword}`
    try {
        const { data: html } = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${access_token}`
                // Cookie: {...cookies}
           }
        })
        const keywordList = html['keywordList'][0]

        // 성별, 나이그룹대별 PC/모바일 검색량 데이터
        const userStat = html['keywordList'][0]['userStat']
        // 과거 1년간 검색량
        const monthlyProgressList = html['keywordList'][0]['monthlyProgressList']

        

        const monthlySearchTrend = getmonthlySearchTrend(monthlyProgressList)
        const ageMonthlyPercent = getAgeMonthlyPercent(userStat)
        const {monthlyMobileMaleRatio, monthlyMobileFemaleRatio} = getMonthlyMobileRatio(userStat)
        const {monthlyPcMaleRatio, monthlyPcFemaleRatio} = getMonthlyPcRatio(userStat)
        // console.log(monthlySearchTrend, ageMonthlyPercent, monthlyMobileMaleRatio, monthlyMobileFemaleRatio, monthlyPcMaleRatio, monthlyPcFemaleRatio)
        return[ monthlySearchTrend, ageMonthlyPercent, {monthlyPcMaleRatio, monthlyPcFemaleRatio}, {monthlyMobileMaleRatio, monthlyMobileFemaleRatio} ]
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getKeywordDetail
}