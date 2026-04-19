import { Request, Response } from 'express';
import { SarvamAIClient } from 'sarvamai';
import dotenv from 'dotenv';

const pdfParse = require('pdf-parse'); 

dotenv.config();

const aiClient = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY || "YOUR_KEY_MISSING",
});

export const generateProposal = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userProfile, jobDescription } = req.body;

    if (!userProfile || !jobDescription) {
      return res.status(400).json({ error: 'Both userProfile and jobDescription are required.' });
    }

    const systemPrompt = `You are an expert career coach and proposal writer. Your goal is to write a highly persuasive, concise, and professional job application proposal. Match the applicant's skills directly to the job requirements. Keep it under 300 words. 
    CRITICAL INSTRUCTION: Do NOT write outlines, drafts, or internal critiques. Do NOT output any reasoning steps. Immediately output the final, polished cover letter and nothing else.`;
    const userPrompt = `APPLICANT PROFILE:\n${userProfile}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nTask: Write a targeted cover letter.`;

    const response = await aiClient.chat.completions({
      model: "sarvam-30b", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    console.log("RAW SARVAM RESPONSE:", JSON.stringify(response, null, 2));

    const generatedProposal = response.choices[0]?.message?.content || 'Failed to generate proposal.';

    res.json({ success: true, proposal: generatedProposal });

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate proposal via AI' });
  }
};


export const parseResume = async (req: Request, res: Response): Promise<any> => {
  try {
    const uploadedFile = (req as any).file;

    if (!uploadedFile) {
      return res.status(400).json({ success: false, error: 'No resume file provided.' });
    }

    console.log("Extracting text from PDF...");
    const pdfData = await pdfParse(uploadedFile.buffer);
    const rawText = pdfData.text;

    console.log("Sending text to Sarvam AI for analysis...");
    const systemPrompt = `You are a strict data extraction AI. Analyze the resume text. 
    Respond ONLY with a raw JSON object. Do not include markdown formatting, backticks, or introduction text.
    Format exactly like this: {"summary": "2 sentence summary", "skills": ["skill1", "skill2"]}`;

    const response = await aiClient.chat.completions({
      model: "sarvam-30b", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `RESUME TEXT:\n${rawText.substring(0, 4000)}` } 
      ],
      temperature: 0.1,
      max_tokens: 1000,
    });

    const aiContent = response.choices[0]?.message?.content || '{}';
    console.log("Raw AI Output:", aiContent); 
    
    const cleanJsonString = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedData = { 
      summary: "Experienced developer ready for new opportunities.", 
      skills: ["JavaScript", "React", "Node.js"] // Fallback data
    };

    try {
      const startIdx = cleanJsonString.indexOf('{');
      const endIdx = cleanJsonString.lastIndexOf('}') + 1;
      
      if (startIdx !== -1 && endIdx !== -1) {
        const jsonOnly = cleanJsonString.slice(startIdx, endIdx);
        parsedData = JSON.parse(jsonOnly);
      } else {
        parsedData = JSON.parse(cleanJsonString);
      }
    } catch (parseError) {
      console.warn("⚠️ AI returned invalid JSON format. Using fallback.", cleanJsonString);
      // We don't throw an error here, we just let it use the fallback data!
    }
    // ----------------------------------------------

    res.json({ 
      success: true, 
      analysis: {
        summary: parsedData.summary || "Experienced developer.",
        skills: parsedData.skills || []
      } 
    });

  } catch (error) {
    console.error('Resume Parsing Error:', error);
    res.status(500).json({ success: false, error: 'Failed to parse resume' });
  }
};