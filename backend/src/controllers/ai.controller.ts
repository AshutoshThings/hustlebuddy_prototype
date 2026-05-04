import { Request, Response } from 'express';
import { SarvamAIClient } from 'sarvamai';
import dotenv from 'dotenv';
import pdfParse from 'pdf-parse-new';

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
      max_tokens: 4096,
    });

    console.log("RAW SARVAM RESPONSE:", JSON.stringify(response, null, 2));

    const generatedProposal = response.choices[0]?.message?.content || 'Failed to generate proposal.';

    res.json({ success: true, proposal: generatedProposal });

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate proposal via AI' });
  }
};

export const parseResume = async (req : Request, res : Response) : Promise<any> =>{
  try{
    if(!req.file){
      return res.status(400).json({ success : false, message : "No resume uploaded" });
    }
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if(!resumeText || resumeText.trim() === ""){
      return res.status(400).json({ success : false, message : "could not read text"});
    }
    const systemPrompt = `You are an elite technical recruiter and AI career coach with 15+ years of experience hiring for fast-growing startups and top tech companies.

Your task is to analyze the applicant's resume text and extract key information into a strict JSON format.

### STRICT RULES:
- No hallucinations: Only extract information explicitly mentioned in the resume. 
- Name fallback: If the full name cannot be clearly identified, use "Candidate".
- Core Skills: Extract 6-8 Hard/Technical skills (programming languages, major frameworks, core technical stacks).
- Additional Skills: Extract 4-6 Secondary skills (tools, platforms, methodologies like Agile, spoken languages, or highly relevant soft skills like Leadership).
- Summary: Write a punchy, confident 2-sentence professional summary (max 70 words) highlighting their strongest experiences and key achievements.
- Vibe: Choose exactly ONE: 'Startup Hustler', 'Corporate Guy', 'Academic / Researcher', or 'Creative Guy'.
- Improvements: Generate 2 to 5 highly specific, actionable tips based ONLY on real flaws or gaps in this resume. 
- Target Role Awareness: Infer or extract the most suitable target role based on the experience.

### CRITICAL OUTPUT INSTRUCTION:
Respond with valid JSON only. Do not include any explanations, reasoning, or markdown (no \`\`\`json). 

### Required JSON Structure:
{
  "profile": {
    "name": "Candidate's Full Name",
    "target_role": "Inferred target role",
    "core_skills": ["React", "Node.js", "TypeScript"],
    "additional_skills": ["Git", "Agile", "Team Leadership", "AWS"],
    "summary": "Punchy two-sentence professional summary here.",
    "vibe": "Startup Hustle"
  },
  "improvements": [
    "Specific actionable tip..."
  ]
}`;
    
    const response = await fetch(`${process.env.SARVAM_BASE_URL || "https://api.sarvamai.com"}/chat/completions`, {
      method : 'POST',
      headers :{
        'Content-Type' : 'application/json',
        'api-subscription-key' : process.env.SARVAM_API_KEY as string
      },
      body: JSON.stringify({
        model : "sarvam-105b",
        messages : [
          { role : "system", content : systemPrompt },
          { role : "user", content : `RESUME TEXT:\n${resumeText}` }
        ],
        temperature : 0.1,
        max_tokens : 4096})
    });

    const data = await response.json();
    if (!response.ok || !data.choices) {
      console.error("--- SARVAM API REJECTED THE REQUEST ---");
      console.error(JSON.stringify(data, null, 2));
      console.error("---------------------------------------");
      return res.status(500).json({ 
        success: false, 
        message: "Sarvam AI API Error. Check backend terminal for details." 
      });
    }

    let rawSarvamResponse = data.choices[0]?.message?.content;

    rawSarvamResponse = rawSarvamResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(rawSarvamResponse);

    res.json({success : true, data : parsedData});
  }
  catch(error){
    console.error('Resume Parsing Error:', error);
    res.status(500).json({ success : false, message : 'Failed to parse resume' });
  }
}