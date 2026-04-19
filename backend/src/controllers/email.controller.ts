import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Use stealth to bypass basic bot detection during deep scans
puppeteer.use(StealthPlugin());

export const sendApplicationEmail = async (req: Request, res: Response): Promise<any> => {
  try {
    const { hrEmail, jobTitle, companyName, proposalText, jobLink } = req.body;

    // ==========================================
    // 🛑 PROTOTYPE MODE SETTINGS 🛑
    // ==========================================
    const IS_PROTOTYPE_MODE = true; 
    // All test emails will be routed here to prevent bounces/bans
    const MY_TEST_INBOX = 'ashutoshvishwakarma168@gmail.com'; 
    // ==========================================

    let targetEmail = hrEmail;

    // --- 1. THE DEEP SCANNER ---
    // If no email was found in the search results, visit the full job page
    if (!targetEmail && jobLink) {
      console.log(`[Deep Scan] No email in feed. Deep scanning page: ${companyName}...`);
      
      const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      try {
        const page = await browser.newPage();
        // Fast-load the page
        await page.goto(jobLink, { waitUntil: 'domcontentloaded', timeout: 20000 });
        
        // Extract all text and hunt for an email pattern
        const fullPageText = await page.evaluate(() => document.body.innerText);
        const emailMatch = fullPageText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        
        if (emailMatch) {
          targetEmail = emailMatch[0]; 
          console.log(`[Deep Scan] SUCCESS! Found hidden email: ${targetEmail}`);
        } else {
          console.log(`[Deep Scan] Failed. No public email found on the job page.`);
        }
      } catch (scanError) {
        console.error(`[Deep Scan] Error or Timeout during scan.`);
      } finally {
        await browser.close();
      }
    }

    // --- 2. THE GRACEFUL FALLBACK ---
    // If we still have no email, we tell the frontend to open a tab instead of throwing an error
    if (!targetEmail) {
      return res.status(200).json({ 
        success: false, 
        message: "No email publicly listed on this job post.",
        action: "fallback_to_tab" 
      });
    }

    // --- 3. DECIDE DELIVERY DESTINATION ---
    const deliveryEmail = IS_PROTOTYPE_MODE ? MY_TEST_INBOX : targetEmail;

    console.log(`[Mailroom] Preparing application for ${companyName}...`);
    if (IS_PROTOTYPE_MODE) {
      console.log(`[Prototype Mode] Rerouting ${targetEmail} -> ${deliveryEmail}`);
    }

    // --- 4. GMAIL CONFIGURATION ---
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Your 16-letter App Password from .env
      },
    });

    // --- 5. SEND THE EMAIL ---
    const mailOptions = {
      from: `"HustleBuddy AI" <${process.env.EMAIL_USER}>`,
      to: deliveryEmail,
      subject: IS_PROTOTYPE_MODE 
        ? `[TEST RUN] Application for ${jobTitle} at ${companyName}` 
        : `Application for ${jobTitle} - Ashutosh Vishwakarma`,
      text: proposalText, 
    };

    await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      message: `Email successfully sent to ${targetEmail}!` 
    });

  } catch (error) {
    console.error("[Mailroom Error]:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server encountered an error while sending email." 
    });
  }
};

