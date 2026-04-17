import { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const aiClient = new OpenAI({
  baseURL: process.env.SARVAM_BASE_URL,
  apiKey: process.env.SARVAM_API_KEY,
});

export const generateProposal = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userProfile, jobDescription } = req.body;

    if (!userProfile || !jobDescription) {
      return res.status(400).json({ error: 'Both userProfile and jobDescription are required.' });
    }

    const systemPrompt = `You are an expert career coach and proposal writer. Your goal is to write a highly persuasive, concise, and professional job application proposal. Match the applicant's skills directly to the job requirements. Keep it under 300 words.`;
    const userPrompt = `APPLICANT PROFILE:\n${userProfile}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nTask: Write a targeted cover letter.`;

    const completion = await aiClient.chat.completions.create({
      model: "sarvam-105b", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    console.log("RAW SARVAM RESPONSE:", JSON.stringify(completion, null, 2));
    const generatedProposal = completion.choices[0]?.message?.content || 'Failed to generate proposal.';

    res.json({ success: true, proposal: generatedProposal });
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate proposal via AI' });
  }
};