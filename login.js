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

    await page.goto("https://my.acculynx.com/signin", {
        waitUntil: "networkidle2"
    });

    await page.type("input#Email", Email, { delay: 30 });
    await page.type("input#Password", Key, { delay: 30 });
    await page.click("button#js-sign-in-identity");

    await page.waitForNavigation({ waitUntil: "networkidle2" });

    const switchURL = `https://my.acculynx.com/signin/SwitchCompany?CompanyID=${ID}`;
    await page.goto(switchURL, { waitUntil: "networkidle2" });

    // --- COOKIE FORMATTING ---
    const cookies = await page.cookies();
    const formatted = cookies.map(c => c.value).join("; ");

    await browser.close();

    console.log(`::set-output name=cookies::${formatted}`);
})();
