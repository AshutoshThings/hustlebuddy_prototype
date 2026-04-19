import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export const scrapeWellfound = async (category: string) => {
  // Wellfound is aggressive against bots. We need to spoof our browser footprint carefully.
  const browser = await puppeteer.launch({ 
    headless: true, // If Cloudflare blocks you, change this to false to debug
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled' // Extra stealth
    ] 
  });

  const page = await browser.newPage();
  
  // Set a realistic user agent so Cloudflare thinks you are a real Mac/Windows user
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1366, height: 768 });

  try {
    // Wellfound public directory URL structure
    const searchParam = category.toLowerCase().replace(/\s+/g, '-');
    const url = `https://wellfound.com/role/l/${searchParam}`;
    
    console.log(`[Wellfound] Sneaking into ${url}...`);
    
    // Wait until the network is quiet so React can render the page
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Scroll down to trigger lazy-loaded job cards
    await page.evaluate(() => window.scrollBy(0, 1000));
    await new Promise(r => setTimeout(r, 2000));

    // Optional: Take a screenshot to see if Cloudflare blocked us
    await page.screenshot({ path: 'wellfound_debug.png', fullPage: true });

    // Wait for the job cards to appear (Wellfound often changes these classes)
    await page.waitForSelector('.styles_component__UxgTA, .styles_jobCard__...', { timeout: 15000 }).catch(() => console.log("Timeout waiting for Wellfound cards. Check debug image for Captcha."));

    const listings = await page.evaluate(() => {
      // These are approximate selectors. You WILL need to check wellfound_debug.png and inspect the DOM!
      const items = document.querySelectorAll('div[data-test="JobCard"], .styles_component__UxgTA');
      const data: any[] = [];

      items.forEach(item => {
        const titleEl = item.querySelector('h2, .styles_title__...');
        const title = titleEl ? (titleEl as HTMLElement).innerText.trim() : null;

        const compEl = item.querySelector('h3, .styles_name__...');
        const company = compEl ? (compEl as HTMLElement).innerText.trim() : 'Startup';

        const locEl = item.querySelector('.styles_location__...');
        const location = locEl ? (locEl as HTMLElement).innerText.trim() : 'Remote / Hybrid';

        const stipEl = item.querySelector('.styles_compensation__...');
        const stipend = stipEl ? (stipEl as HTMLElement).innerText.trim() : 'Equity / Salary hidden';
        
        // Wellfound links are often relative
        let link = item.querySelector('a')?.getAttribute('href');
        const fullLink = link ? (link.startsWith('http') ? link : `https://wellfound.com${link}`) : 'https://wellfound.com';

        if (title && title !== "") {
          data.push({
            title,
            company,
            location,
            stipend,
            link: fullLink,
            source: 'Wellfound',
            scrapedAt: new Date().toISOString()
          });
        }
      });
      return data;
    });

    await browser.close();
    console.log(`[Wellfound] Successfully extracted ${listings.length} jobs.`);
    return listings;
    
  } catch (error) {
    console.error("[Wellfound Scraper] Error or blocked by Cloudflare:", error);
    await browser.close();
    return [];
  }
};