const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250, // slow down by 250ms
    devtools: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  //page.on("console", msg => console.log("PAGE CONSOLE LOGS:", msg.text()));

  await page.setViewport({
    width: 1200,
    height: 1000
  });

  let test = await browser.userAgent();
  console.log(test);

  try {
    await page.goto(
      "https://matrix.fmlsd.mlsmatrix.com/Matrix/Public/Portal.aspx?ID=0-1118536626-10#1",
      { waitUntil: "networkidle0" }
    );

    // await page.addScriptTag({
    //   url: "https://code.jquery.com/jquery-3.2.1.min.js"
    // });
    // console.log("add script jquery newest ver complete");

    await ifElementExistsClick("#_ctl0_m_DisplayCore_dpy66", page);

    await page.waitForSelector(
      ".col-sm-12.d-fontSize--largest.d-text.d-color--brandDark"
    );
    console.log("found element in page");

    const navigation = page.waitForNavigation({
      waitUntil: "networkidle0",
      timeout: 10000
    });

    await ifElementExistsClick(
      ".col-sm-12.d-fontSize--largest.d-text.d-color--brandDark a",
      page
    );

    await navigation;
    console.log("navigation complete");

    let homeData = await getElementData(
      ".col-sm-6.d-bgcolor--systemLightest",
      page
    );
    let address = await getElementData(
      ".multiLineDisplay.ajax_display.d69m_show .d-wrapperTable .d-mega.d-fontSize--mega.d-color--brandDark.col-sm-12 span",
      page
    );
    let mlsNumber = await getElementData(
      ".d-wrapperTable .d-text.d-color--systemDark.d-fontSize--small",
      page,
      ".d-paddingRight--4"
    );
    console.log("DATA: ", homeData, address, mlsNumber);
  } catch (err) {
    console.log(err);
  }

  async function getElementData(element, page, exclude) {
    if (await elementExists(element, page)) {
      let value = await page.evaluate((element, page, exclude) => {
        try {
          console.log("***", $(element).html());
          //   if (exclude) {
          //     console.log("excludes here for element ", element);
          //     return $(element)
          //       .not(exclude)
          //       .html();
          //   } else {
          //     console.log(element);
          //     return $(element).html();
          //   }
        } catch (err) {
          console.log("error", err);
        }
      });

      //let value = await page.$eval(element, e => e.innerHTML);
      console.log("element value found", value);
      return value;
    }
  }

  async function ifElementExistsClick(element, page) {
    if ((await elementExists(element, page)) !== null) {
      await page.click(element);
      console.log("element " + element + " clicked");
    }
  }

  async function elementExists(element, page) {
    if ((await page.$(element)) !== null) {
      console.log("element found " + element);
      return true;
    } else {
      console.log("element not found " + element);
      return false;
    }
  }

  //await browser.close();
})();
