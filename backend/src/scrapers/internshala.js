const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function scrapeInternshala(searchQuery) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set a realistic user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');

  try {
    // Navigate to the search results
    await page.goto(`https://internshala.com/internships/keywords-${searchQuery}`, { waitUntil: 'networkidle2' });

    // Extracting data
    const listings = await page.evaluate(() => {
      const results = [];
      const cards = document.querySelectorAll('.individual_internship'); // You'll need to verify this selector as it changes

      cards.forEach(card => {
        results.push({
          title: card.querySelector('.job-title-container')?.innerText.trim(),
          company: card.querySelector('.company-name')?.innerText.trim(),
          location: card.querySelector('.location_link')?.innerText.trim(),
          stipend: card.querySelector('.stipend')?.innerText.trim(),
          link: "https://internshala.com" + card.getAttribute('data-href'),
          source: 'Internshala'
        });
      });
      return results;
    });

    await browser.close();
    return listings;
  } catch (err) {
    console.error("Scraping failed:", err);
    await browser.close();
    return [];
  }
}

module.exports = scrapeInternshala;