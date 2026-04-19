import express, { Request, Response, Router } from 'express';
// 1. Make sure all THREE scrapers are imported here
import { scrapeInternshala } from '../utils/scraperService';
import { scrapeNaukri } from '../utils/naukriScraper';
import { scrapeWellfound } from '../utils/wellfoundScraper';

const router: Router = express.Router();

// 2. Changed from '/scrape/internshala' to a generic '/scrape'
router.get('/scrape', async (req: Request, res: Response): Promise<any> => {
  try {
    const searchQuery = (req.query.search as string) || 'software-development';
    
    // 3. We look for the ?source= parameter in the URL. If it's missing, default to internshala
    const source = (req.query.source as string) || 'internshala'; 
    
    console.log(`API hit: Starting scrape for '${searchQuery}' on source: '${source}'...`);

    // 4. Create an empty array to hold the jobs
    let jobs: any[] = [];

    // 5. THE SWITCH STATEMENT (The Traffic Cop)
    switch (source.toLowerCase()) {
      case 'internshala':
        jobs = await scrapeInternshala(searchQuery);
        break;
    //   case 'unstop':
    //     jobs = await scrapeUnstop(searchQuery);
    //     break;
        case 'naukri': // <--- THE NEW NAUKRI ROUTE
            jobs = await scrapeNaukri(searchQuery);
            break;
      case 'wellfound': 
        jobs = await scrapeWellfound(searchQuery);
        break;
      default:
        // If someone passes ?source=linkedin and we don't have it yet, throw an error
        return res.status(400).json({ success: false, message: "Invalid source provided." });
    }

    // 6. Return the data
    res.json({
      success: true,
      source: source, // Good practice to echo back the source
      count: jobs.length,
      data: jobs
    });

  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;