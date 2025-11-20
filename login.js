const puppeteer = require("puppeteer");

(async () => {
    const ID = process.argv[2];
    const Email = process.argv[3];
    const Key = process.argv[4];

    if (!ID || !Email || !Key) {
        console.error("Missing required parameters.");
        process.exit(1);
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"]
    });

    const page = await browser.newPage();

    // 1. Go to login page
    await page.goto("https://my.acculynx.com/signin", {
        waitUntil: "networkidle2"
    });

    // 2. Fill email
    await page.type("input#Email", Email, { delay: 30 });

    // 3. Fill password
    await page.type("input#Password", Key, { delay: 30 });

    // 4. Click login
    await page.click("button#js-sign-in-identity");

    // Wait for login redirect
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // 5. Switch company
    const switchURL = `https://my.acculynx.com/signin/SwitchCompany?CompanyID=${ID}`;
    await page.goto(switchURL, { waitUntil: "networkidle2" });

    // 6. Get cookies
    const cookies = await page.cookies();

    await browser.close();

    const cookiesJSON = JSON.stringify(cookies);

    // Print GitHub Action output
    console.log(`::set-output name=cookies::${cookiesJSON}`);
})();
