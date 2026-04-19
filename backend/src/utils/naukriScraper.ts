import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export const scrapeNaukri = async (category: string) => {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1366, height: 768 });

  try {
    const formattedQuery = category.toLowerCase().replace(/\s+/g, '-');
    const url = `https://www.naukri.com/${formattedQuery}-jobs`;
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.evaluate(() => window.scrollBy(0, 800));
    await new Promise(r => setTimeout(r, 2000));

    await page.waitForSelector('.srp-jobtuple-wrapper, .jobTuple', { timeout: 15000 });

    const listings = await page.evaluate(() => {
      const items = document.querySelectorAll('.srp-jobtuple-wrapper, .jobTuple');
      const data: any[] = [];

      items.forEach(item => {
        const titleEl = item.querySelector('a.title');
        const title = titleEl ? (titleEl as HTMLElement).innerText.trim() : null;

        const compEl = item.querySelector('a.comp-name');
        const company = compEl ? (compEl as HTMLElement).innerText.trim() : 'Unknown';

        const locEl = item.querySelector('.locWdth');
        const location = locEl ? (locEl as HTMLElement).innerText.trim() : 'India';

        const stipEl = item.querySelector('.sal');
        const stipend = stipEl ? (stipEl as HTMLElement).innerText.trim() : 'Not Disclosed';
        
        const link = item.querySelector('a.title')?.getAttribute('href');

        // --- EMAIL HUNTING LOGIC ---
        // We look at the "Job Description" snippet to see if an email is mentioned
        const descriptionText = item.querySelector('.job-description, .ni-job-tuple-description')?.textContent || "";
        const emailMatch = descriptionText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        const email = emailMatch ? emailMatch[0] : null;

        if (title) {
          data.push({
            title,
            company,
            location,
            stipend,
            link: link || 'https://www.naukri.com',
            email: email, // <--- Now included in the data!
            source: 'Naukri',
            scrapedAt: new Date().toISOString()
          });
        }
      });
      return data;
    });

    await browser.close();

    // Deduplicate
    const uniqueListings = Array.from(
      new Map(listings.map(job => [job.link, job])).values()
    );

    return uniqueListings;
  } catch (error) {
    console.error("[Naukri] Error:", error);
    await browser.close();
    return [];
  }
};