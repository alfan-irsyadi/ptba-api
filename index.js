const app = require('express')();
let chrome = {};
let puppeteer;
const chromium = require('chrome-aws-lambda')

app.get('/api', async (req, res) => {
    // import * as puppeteer from 'puppeteer';

    // const browser = await puppeteer.launch( { args: ['--no-sandbox'] } );

    const browser = await chromium.puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: false,
        ignoreHTTPSErrors: true,
    })
    const page = await browser.newPage()
    await page.goto('https://api.investing.com/api/financialdata/101599/historical/chart/?period=P5Y&interval=P1W&pointscount=120')
    // await page.waitForSelector('pre')
    let pre = await page.$('pre')
    let content = await page.evaluate(el => el.textContent, pre)
    console.log(content)    
    await browser.close()
    res.send(JSON.parse(content))
})
app.listen(process.env.PORT || 3000, () => {
    console.log('started')
})




