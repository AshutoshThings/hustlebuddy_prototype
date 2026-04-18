import express, { Request, Response, Router } from 'express';
import { scrapeInternshala } from '../utils/scraperService'; 

const router: Router = express.Router();

router.get('/scrape/internshala', async (req: Request, res: Response) => {
  try {
    const searchQuery = (req.query.search as string) || 'software-development';
    console.log(`API hit: Starting scrape for '${searchQuery}'...`);
    
    // Call the puppeteer function
    const jobs = await scrapeInternshala(searchQuery);
    
    res.json({ 
      success: true, 
      count: jobs.length,
      data: jobs 
    });

  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;