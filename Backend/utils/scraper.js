// import npm modules
const axios = require('axios');
const request = require('request');
const cheerio = require('cheerio');
const dotenv = require('dotenv')
dotenv.config()

// import utils
const { generateSignatureKeywordstool } = require('./generateSignature')
const { getRelKeyword } = require('./getRelKeyword')
const { getAddSeperator, getRemoveSeperator } = require('./helpNumber')
const { getKeywordSaturation } = require('./getKeywordSaturation')

// 월간 검색량(pc, 모바일)(공개 API 사용), 연관키워드
// process.env 이슈 발생 >> dotenv 삭제후 재설치로 해결
async function getKeywordMonthlyCnt(keyword) {
    const encodeKeyword = encodeURIComponent(keyword)
    // 타임스태프 생성
    const stamp = (new Date()).valueOf().toString()
    const url = 'https://api.naver.com/keywordstool'
    
    try {
        const { data: html } = await axios.get(url, {
            headers: {
                'X-Timestamp': stamp,
                'X-API-KEY': process.env.ACCESS_LICENSE,
                'X-Customer': process.env.CUSTOMER_ID,
                'X-Signature': generateSignatureKeywordstool(stamp),
                'Content-Type': 'application/json'
            },
            params: {
                "includeHintKeywords": 0,
                "showDetail": 1,
                "hintKeywords": keyword
            }
        })
        const keywordObjectArray = html.keywordList
        // 연관 키워드 얻기
        const relKeyword = getRelKeyword(keywordObjectArray)

        // 검색 키워드 pc, 모바일 검색량 얻기
        const searchedKeyword = keywordObjectArray[0]
        const pcMonthlyCount = getAddSeperator(searchedKeyword.monthlyPcQcCnt) 
        const mobileMonthlyCount = getAddSeperator(searchedKeyword.monthlyMobileQcCnt)
        
        // console.log(`${keyword} PC 검색량: ${pcMonthlyCount} , 모바일 검색량: ${mobileMonthlyCount}, 연관 검색어: ${relKeyword}`)  
        return { pcMonthlyCount, mobileMonthlyCount, relKeyword }
    } catch (error) {
        console.log(error)
    }
}

// 키워드 상세 정보


// 월간 컨텐츠 발행량(블로그, 카페, 웹사이트)
// 최근 1달간 블로그 발행량
async function getBlogSearchMonthly (keyword) {
    //Make current date to quert format 
    const todayDate = new Date().toLocaleDateString().replace(/-/g, "")
    const queryKeyword = encodeURIComponent(keyword)
    const blogUrl = `https://search.naver.com/search.naver?where=post&query=${queryKeyword}&st=sim&sm=tab_opt&date_from=20030520&date_to=${todayDate}&date_option=4&srchby=all&dup_remove=1&post_blogurl=&post_blogurl_without=&nso=so%3Ar%2Ca%3Aall%2Cp%3A1m`
    try {
        const { data: html } = await axios.get(blogUrl)
        const $ = cheerio.load(html)
        const dataInString = $('#main_pack .title_num').html()
        const blogMonthSearchNum = dataInString.match(/1-10 \/ (.*)&#xAC74/)[1]
        // console.log(`블로그 컨텐츠 발행량 : ${blogMonthSearchNum}`)
        return blogMonthSearchNum
    } catch (error) {
        console.log(error)
    }
}

// 최근 1달간 카페 발행량
async function getCafeSearchMonthly (keyword) {
    //Make current date to quert format 
    const todayDate = new Date().toLocaleDateString().replace(/-/g, "")
    const queryKeyword = encodeURIComponent(keyword)
    const cafeUrl = `https://search.naver.com/search.naver?where=article&query=${queryKeyword}&ie=utf8&st=rel&date_option=3&board=&srchby=text&dup_remove=1&cafe_url=&without_cafe_url=&sm=tab_opt&nso=so%3Ar%2Cp%3A1m%2Ca%3Aall&t=0&mson=0&prdtype=0`

    try {
        const { data: html } = await axios.get(cafeUrl)
        const $ = cheerio.load(html)
        const dataInString = $('#_cafe_section .title_num').html()
        const cafeMonthSearchNum = dataInString.match(/1-10 \/ (.*)&#xAC74/)[1]
        // console.log(`카페 컨텐츠 발행량 : ${cafeMonthSearchNum}`)
        return cafeMonthSearchNum
    } catch (error) {
        console.log(error)
    }
}

// 최근 1달간 웹사이트 발행량
async function getWebSearchMonthly (keyword) {
    const queryKeyword = encodeURIComponent(keyword)
    const webUrl = `https://search.naver.com/search.naver?where=webkr&sm=tab_opt&query=${queryKeyword}&filetype=0&fd=2&f=&research_url=&sbni_rootid=&nso=so%3Ar%2Ca%3Aall%2Cp%3A1m&ie=utf8`

    try {
        const { data: html } = await axios.get(webUrl)
        const $ = cheerio.load(html)
        const dataInString = $('.title_num').html()
        const webMonthSearchNum = dataInString.match(/1-10 \/ (.*)&#xAC74/)[1]
        // console.log(`웹사이트 컨텐츠 발행량 : ${webMonthSearchNum}`)
        return webMonthSearchNum
    } catch (error) {
        console.log(error)
    }
}

// 키워드 포화지수(월간컨텐츠발행량/월간검색량)
async function getKeywordSaturationRatio (keyword) {
    // 키워드별 검색량, 발행량 변수 정의
    const keywordSearchMonthly = await getKeywordMonthlyCnt(keyword)
    const getBlogSearchMonthlyNum = await getBlogSearchMonthly(keyword)
    const getCafeSearchMonthlyNum = await getCafeSearchMonthly(keyword)
    const getWebSearchMonthlyNum = await getWebSearchMonthly(keyword)
    // 키워드 별 검색량 합계(PC + 모바일)
    const keywordSearchMonthlySum = getRemoveSeperator(keywordSearchMonthly.pcMonthlyCount) + getRemoveSeperator(keywordSearchMonthly.mobileMonthlyCount)
    // string 형태의 데이터를 number형태로 바꾸고 '포화지수'계산한다
    const blogSaturationRate = getKeywordSaturation((getRemoveSeperator(getBlogSearchMonthlyNum)/keywordSearchMonthlySum)*100)
    const cafeSaturationRate = getKeywordSaturation((getRemoveSeperator(getCafeSearchMonthlyNum)/keywordSearchMonthlySum)*100)
    const webSaturationRate = getKeywordSaturation((getRemoveSeperator(getWebSearchMonthlyNum)/keywordSearchMonthlySum)*100)
    // console.log(blogSaturationRate, cafeSaturationRate, webSaturationRate)
    return {blogSaturationRate, cafeSaturationRate, webSaturationRate}
}


// 네이버 섹션 배치 순서(PC 검색버전)
// 로직엔 안맞는 section : 지식백과,
async function getSectionOrderPc (keyword) {
    const queryKeyword = encodeURIComponent(keyword)
    const sectionUrl = `https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=${queryKeyword}&oquery=${queryKeyword}`

    try {
        const sectionOrder = []
        const orders = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh']
        const result = {}

        const { data: html } = await axios.get(sectionUrl)
        const $ = cheerio.load(html)
        const dataInString = $('.section .section_head h2' || '.sp_kindic .sc_head h2')
        dataInString.each(function(i, elm) {
            sectionOrder.push($(this)[0].children[0].data)
        })

        orders.forEach((order, i) => result[order] = sectionOrder[i])

        return result

    } catch(error) {
        console.log(error)
    }
}

// 네이버 섹션 배치 순서(모바일 검색버전)
async function getSectionOrderMobile (keyword) {
    const queryKeyword = encodeURIComponent(keyword)
    const sectionUrl = `https://m.search.naver.com/search.naver?sm=mtp_hty.top&where=m&query=${queryKeyword}`

    try {
        const sectionOrder = []
        const orders = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh']
        const result = {}

        const { data: html } = await axios.get(sectionUrl)
        const $ = cheerio.load(html)
        const dataInString = $('.sc .api_title_area h2' || '.sc .api_title i')
        
        dataInString.each(function(i, elm) {
            if(!$(this)[0].children[0].data) {
                sectionOrder.push($(this)[0].children[0].next.data)
            } else {
                sectionOrder.push($(this)[0].children[0].data)
            }
        })
        
        orders.forEach((order, i) => result[order] = sectionOrder[i])
        return result

    } catch(error) {
        console.log(error)
    }
}

// getKeywordMonthlyCnt('스티브잡스')
// getBlogSearchMonthly('맥북프로')
// getCafeSearchMonthly('맥북프로')
// getWebSearchMonthly('맥북프로')
// getSectionOrder('맥북프로')
// getKeywordSaturationRatio('맥북프로')
// getSectionOrderMobile('맥북프로')
// getSectionOrderPc('맥북프로')

module.exports = {
    getKeywordMonthlyCnt,
    getBlogSearchMonthly,
    getCafeSearchMonthly,
    getWebSearchMonthly,
    getKeywordSaturationRatio,
    getSectionOrderPc,
    getSectionOrderMobile
}