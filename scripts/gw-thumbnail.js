const puppeteer = require("puppeteer");

const waitFor = (time) => new Promise((resolve) => setTimeout(resolve, time));

/**
 * Generates thumbnails of the URLS
 * @param {string} url
 * @param {string} title
 */
async function GWThumbnails(url, title) {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1600,
      height: 1000,
    },
    args: ["--no-sandbox"],
    headless: true,
  });

  const page = await browser.newPage();

  console.log("Navigating to page");

  await page.setUserAgent(
    "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
  );

  await page.emulateMediaType("screen");

  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 120000
  });

  // console.log('Started waiting')
  // await page.waitFor(3000);
  console.log("Starting taking photo");

  await page.screenshot({
    path: `../static/work-thumbnails/${title}.jpg`,
    // type: "jpeg",
  });

  console.log("screenshotted!");

  await browser.close();
}

GWThumbnails("https://puruvj.dev", "Hello");

module.export = {};
