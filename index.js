let puppeteer = require('puppeteer')
let fs = require('fs').promises
const { exec } = require("child_process");
const axios = require('axios')

async function runPuppeteer() {

    try {
        console.log("working");
        let response = await axios.get('http://127.0.0.1:9222/json/version')
        console.log(response.data.webSocketDebuggerUrl)

        const wsChromeEndpointurl = response.data.webSocketDebuggerUrl;
        const browser = await puppeteer.connect({
            browserWSEndpoint: wsChromeEndpointurl,
            headless: false,
            defaultViewport: null
        });

        let resultArray = []

        let urls = ['https://discord.com/channels/428232997737594901/457671525743591425','https://discord.com/channels/428232997737594901']
        //uncomment this loop and fill urls array 
        const page = await browser.newPage();
        for (let i = 0; i < urls.length; i++) {



            await page.goto(urls[i], { waitUntil: 'networkidle2' })
            
            //if you wanted to add click actions
            //await page.waitForSelector('.DraftEditor-root > .DraftEditor-editorContainer > .notranslate > div > div')
            //await page.click('.DraftEditor-root > .DraftEditor-editorContainer > .notranslate > div > div')


            const xpath_expression = '//a/@href';
            await page.waitForXPath(xpath_expression);
            const getContent = await page.$x(xpath_expression);
            const content = await page.evaluate((...getContent) => {
                return getContent.map(e => e.textContent);
            }, ...getContent);

            resultArray.push({
                url : urls[i],
                content: content,
                xpath: xpath_expression

            })

            console.log(content);


        }

        await fs.appendFile('results.json',JSON.stringify(resultArray))

    } catch (e) {
        console.log(e)
    }

}


runPuppeteer()