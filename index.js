const chromium = require('chrome-aws-lambda')
const {addExtra} = require('puppeteer-extra')
const puppeteerExtra = addExtra(chromium.puppeteer)
const app = require('express')();

app.get('/api', async (req, res) => {
    let browser = await puppeteerExtra
        .launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: false,
            ignoreHTTPSErrors: true
        })
    const page = await browser.newPage()
    await page.goto('https://api.investing.com/api/financialdata/101599/historical/chart/?period=P5Y&interval=P1W&pointscount=120')
    let pre = await page.$('pre')
    let content = await page.evaluate(el => el.textContent, pre)
    res.send(content)
    console.log(content)
    await browser.close()


})
app.listen(3000, () => {
    console.log('started')
})