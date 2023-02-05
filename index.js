const app = require('express')();
let chrome = {};
let puppeteer;

app.get('/api', async (req, res) => {
    chrome = require('chrome-aws-lambda');
    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        // running on the Vercel platform.        
        puppeteer = require('puppeteer-core');
    } else {
        // running locally.        
        puppeteer = require('puppeteer');
    }

    try {
        let browser = await puppeteer.launch({            
            args: chrome.arg,
            defaultViewport: chrome.defaultViewport,
            executablePath: await chrome.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        });
        const page = await browser.newPage()
        await page.goto('https://api.investing.com/api/financialdata/101599/historical/chart/?period=P5Y&interval=P1W&pointscount=120')        
        console.log(page)
        await page.waitForSelector('pre')
        let pre = await page.$('pre')
        let content = await page.evaluate(el => el.textContent, pre)
        res.send(content)
        console.log(content)
        await browser.close()
    } catch (err) {
        console.error(err);
        return null;
    }
})
app.listen(process.env.PORT || 3000, () => {
    console.log('started')
})




