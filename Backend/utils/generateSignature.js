const CryptoJS = require('crypto-js')
const dotenv = require('dotenv')
dotenv.config()

const generateSignatureKeywordstool = (stamp) => {
    // CryptoJS를 이용하여 시그니처 생성
    const hash = CryptoJS.HmacSHA256(
        stamp + ".GET." + "/keywordstool",
        process.env.SECTRET_KEY
    )
    const signature = hash.toString(CryptoJS.enc.Base64)
    return signature
}

const generateSignatureManagedKeyword = (stamp) => {
    // CryptoJS를 이용하여 시그니처 생성
    const hash = CryptoJS.HmacSHA256(
        stamp + ".GET." + "/ncc/managedKeyword",
        process.env.SECTRET_KEY
    )
    const signature = hash.toString(CryptoJS.enc.Base64)
    return signature
}

module.exports = { generateSignatureKeywordstool, generateSignatureManagedKeyword }