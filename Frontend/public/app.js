const express = require('express')
const cors = require('cors')
const puppeteer = require('puppeteer');

const { getKeywordMonthlyCnt, getBlogSearchMonthly, getCafeSearchMonthly, getWebSearchMonthly, getKeywordSaturationRatio, getSectionOrderPc, getSectionOrderMobile } = require('./utils/scraper')
const { getKeywordDetail } = require('./utils/getKeywordDetail')
const { manageKeyword } = require('./utils/manageKeyword')
const app = express()
app.use(cors())

const port = process.env.port || 5000

app.get('/', async(req, res) => {
    res.send('hello world')
})

app.get('/keywordlist', async(req, res, next) => {
    const keyword = req.query.keyword
    const access_token = req.query.access_token

    try {
        const [ KeywordCount, BlogCount, CafeCount, WebCount, SaturationRate ,SectionOrderPc, SectionOrderMobile, KeywordDetail ] = await Promise.all([
            getKeywordMonthlyCnt(keyword),
            getBlogSearchMonthly(keyword),
            getCafeSearchMonthly(keyword),
            getWebSearchMonthly(keyword),
            getKeywordSaturationRatio(keyword),
            getSectionOrderPc(keyword),
            getSectionOrderMobile(keyword),
            getKeywordDetail(keyword, access_token)
        ]);
        
        res.json([{keyword, KeywordCount, BlogCount, CafeCount, WebCount, SaturationRate, SectionOrderPc, SectionOrderMobile, KeywordDetail }])
    } catch(error) {
        console.log(error)
    }
})

app.get('/manage/keyword', async(req, res, next) => {
    const keyword= req.query.keyword
    try {
        const [ manageResult ] = await Promise.all([
            manageKeyword(keyword)
        ]);
        res.json([{manageResult}])
    } catch(error) {
        console.log(error)
    }
})

app.get('/get/access_token', async(req, res) => {
    const id = req.query.id
    const password = req.query.password
    const customerId = req.query.customerId

    const getChromiumExecPath = () => {
        return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
    }
    try {
        const browser = await puppeteer.launch({
            executablePath: getChromiumExecPath(),
            headless:false
        });
        const page = await browser.newPage();
        const naver_id = id;
        const naver_pw = password;
        await page.goto('https://searchad.naver.com/login?returnUrl=https:%2F%2Fmanage.searchad.naver.com&returnMethod=get');
        await page.type('#uid', naver_id, {delay: 100})
        await page.type('#upw', naver_pw, {delay: 100})
        await page.waitFor(1000);
        await page.click('.btn_login button');
        await page.waitForNavigation();
        
        await page.waitFor(5000);
        const cookies_got = await page.cookies()
        cookies = cookies_got
        
        const localStorageData = await page.evaluate(() => {
            let json = {};
            for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            json[key] = localStorage.getItem(key);
            }
            return json;
        });
    
        const access_token_got = JSON.parse(localStorageData.tokens)[`${customerId}`]['bearer']
        
        access_token = access_token_got
        res.json([access_token])
    } catch (error) {
        console.log(error)
    }
})

// app.get('/get/access_token', async(req, res) => {
//     const id = req.query.id
//     const password = req.query.password
//     const customerId = req.query.customerId

//     try {
//         const browser = await puppeteer.launch({
//             headless:false
//         });
//         const page = await browser.newPage();
//         const naver_id = id;
//         const naver_pw = password;
//         await page.goto('https://searchad.naver.com/login?returnUrl=https:%2F%2Fmanage.searchad.naver.com&returnMethod=get');
//         await page.type('#uid', naver_id, {delay: 100})
//         await page.type('#upw', naver_pw, {delay: 100})
//         await page.waitFor(1000);
//         await page.click('.btn_login button');
//         await page.waitForNavigation();
        
//         await page.waitFor(5000);
//         const cookies_got = await page.cookies()
//         cookies = cookies_got
        
//         const localStorageData = await page.evaluate(() => {
//             let json = {};
//             for (let i = 0; i < localStorage.length; i++) {
//             const key = localStorage.key(i);
//             json[key] = localStorage.getItem(key);
//             }
//             return json;
//         });
    
//         const access_token_got = JSON.parse(localStorageData.tokens)[`${customerId}`]['bearer']
        
//         access_token = access_token_got
//         res.json([access_token])
//     } catch (error) {
//         console.log(error)
//     }
// })

app.get('/get/close_browser', async(req, res) => {
    await browser.close();
})

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})