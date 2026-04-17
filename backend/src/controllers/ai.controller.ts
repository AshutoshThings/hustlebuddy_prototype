import { Request, Response } from 'express';
import { SarvamAIClient } from 'sarvamai';
import dotenv from 'dotenv';

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