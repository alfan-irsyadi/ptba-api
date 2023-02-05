// const chromium = require('chrome-aws-lambda');
// const puppeteer = require('puppeteer-core');
let chrome = {};
let puppeteer;

exports.handler = async function (event, context) {
    let content = ""
    chrome = require('chrome-aws-lambda');
    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        // running on the Vercel platform.
        puppeteer = require('puppeteer-core');
    } else {
        // running locally.        
        const puppeteer = require('puppeteer')
    }

    try {
        let browser = await puppeteer.launch({                                    
            executablePath: process.env.CHROME || await chrome.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        });
        const page = await browser.newPage()
        await page.goto('https://api.investing.com/api/financialdata/101599/historical/chart/?period=P5Y&interval=P1W&pointscount=120')        
        await page.waitForSelector('pre')
        let pre = await page.$('pre')
        content = await page.evaluate(el => el.textContent, pre)

        await browser.close()
    } catch (err) {
        console.error(err);        
        content =err
    }
    return {
        statusCode: 200,
        body: content
    };
}