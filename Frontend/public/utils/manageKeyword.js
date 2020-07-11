// import npm modules
const axios = require('axios');
const dotenv = require('dotenv')
dotenv.config()

// import utils
const { generateSignatureManagedKeyword } = require('./generateSignature')


const ACCESS_LICENSE = "01000000008bfbb6b20d9920b23fec472ed7480c7c28a874aead18827c3130d28afdb05ec7"
const CUSTOMER_ID = "1763627"

// 월간 검색량(pc, 모바일)(공개 API 사용), 연관키워드
// process.env 이슈 발생 >> dotenv 삭제후 재설치로 해결
async function manageKeyword(keyword) {
    const encodeKeyword = encodeURIComponent(keyword)

    // 타임스태프 생성
    const stamp = (new Date()).valueOf().toString()
    const url = 'https://api.naver.com/ncc/managedKeyword'
    
    try {
        const { data: html } = await axios.get(url, {
            headers: {
                'X-Timestamp': stamp,
                'X-API-KEY': ACCESS_LICENSE,
                'X-Customer': CUSTOMER_ID,
                'X-Signature': generateSignatureManagedKeyword(stamp),
                'Content-Type': 'application/json'
            },
            params: {
                "keywords": keyword
            }
        })
        const manageResult = html[0]
        
        return manageResult
    
    } catch (error) {
        console.log(error)
    }
}

module.exports = { manageKeyword }

manageKeyword('맥북프로사랑하기')