import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export const scrapeInternshala = async (category: string) => {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    const url = `https://internshala.com/internships/keywords-${category}`;
    console.log(`[Scraper] Navigating to ${url}...`);
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 1000)); 
    
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({ path: 'scraper_debug.png', fullPage: true });

    await page.waitForSelector('.individual_internship, .internship_meta, .container-fluid', { timeout: 15000 });

    const listings = await page.evaluate(() => {
      const items = document.querySelectorAll('.individual_internship, .internship_meta, .internship_list_container > div');
      const data: any[] = [];
      const seenLinks = new Set(); // We will use this to track duplicates

      items.forEach(item => {
        const titleEl = item.querySelector('.job-internship-name, .profile a, .heading_4_5 a, h3');
        const title = titleEl ? (titleEl as HTMLElement).innerText.trim() : null;

        // Clean the company name (remove "\n\nActively hiring")
        const compEl = item.querySelector('.company-name, .company_name, .company-and-help');
        let company = compEl ? (compEl as HTMLElement).innerText.trim() : 'Unknown Company';
        company = company.split('\n')[0].trim(); // Grabs only the first line!

        const locEl = item.querySelector('.location_link, #location_names, .locations span');
        const location = locEl ? (locEl as HTMLElement).innerText.trim() : 'Remote / Unspecified';

        const stipEl = item.querySelector('.stipend, .salary');
        const stipend = stipEl ? (stipEl as HTMLElement).innerText.trim() : 'Not Disclosed';
        
        let link = item.querySelector('.view_detail_button')?.getAttribute('href') 
                || item.querySelector('a.job-title-href')?.getAttribute('href')
                || titleEl?.getAttribute('href');
        
        const fullLink = link ? `https://internshala.com${link}` : 'Link missing';

        // Only add if it has a title AND we haven't seen this exact link before
        if (title && title !== "" && !seenLinks.has(fullLink)) {
          seenLinks.add(fullLink);
          
          data.push({
            title,
            company,
            location,
            stipend,
            link: fullLink,
            source: 'Internshala',
            scrapedAt: new Date().toISOString()
          });
        }
      });
      return data;
    });
    await browser.close();
    console.log(`[Scraper] Successfully found ${listings.length} jobs.`);
    return listings;
    
  } catch (error) {
    console.error("[Scraper] Error:", error);
    await browser.close();
    return [];
  }
};