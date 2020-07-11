const CryptoJS = require('crypto-js')
const dotenv = require('dotenv')
dotenv.config()

const SECTRET_KEY = "AQAAAACL+7ayDZkgsj/sRy7XSAx8kqVesVF/FQ9Co0RbujGfYg=="

const generateSignatureKeywordstool = (stamp) => {
    // CryptoJS를 이용하여 시그니처 생성
    const hash = CryptoJS.HmacSHA256(
        stamp + ".GET." + "/keywordstool",
        SECTRET_KEY
    )
    const signature = hash.toString(CryptoJS.enc.Base64)
    return signature
}

const generateSignatureManagedKeyword = (stamp) => {
    // CryptoJS를 이용하여 시그니처 생성
    const hash = CryptoJS.HmacSHA256(
        stamp + ".GET." + "/ncc/managedKeyword",
        SECTRET_KEY
    )
    const signature = hash.toString(CryptoJS.enc.Base64)
    return signature
}

module.exports = { generateSignatureKeywordstool, generateSignatureManagedKeyword }