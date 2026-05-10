import { Request, Response } from 'express';
import { SarvamAIClient } from 'sarvamai';
import dotenv from 'dotenv';
import pdfParse from 'pdf-parse-new';
import pool from '../utils/db';

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

export const autofillForm = async (req: Request, res: Response): Promise<any> => {
  try {
    const { formFields, userId } = req.body;

    if (!formFields || !userId) {
      return res.status(400).json({ error: 'Missing form fields or user ID.' });
    }

    const userQuery = await pool.query('SELECT * FROM hustle_profiles WHERE user_id = $1', [userId]);
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ error: 'User profile not found in Vault.' });
    }
    const profile = userQuery.rows[0];

    // 2. Format the profile into a clean string so the AI understands it easily
    const applicantContext = `
      Name: ${profile.name}
      Target Role: ${profile.target_role}
      Summary: ${profile.summary}
      Core Skills: ${profile.core_skills}
      Additional Skills: ${profile.additional_skills}
      Personal Vibe: ${profile.vibe}
    `;

    // 3. The prompt to map the data to the HTML fields
    const systemPrompt = `You are an elite autonomous job application agent. 
I will give you an applicant's profile and a list of HTML form fields extracted from a job board (like Workday or Greenhouse).
Your task is to map the applicant's data to the correct form fields.

### CRITICAL RULES:
1. Output ONLY a valid JSON object. No explanations, no markdown (no \`\`\`json).
2. The JSON keys MUST be the exact "id" or "name" from the form field data.
3. The JSON values MUST be the text you want typed into that box.
4. If a field asks for a URL (LinkedIn, GitHub), infer standard URLs if not explicitly in the profile (e.g., https://linkedin.com/in/ashutosh).
5. If a field asks a complex custom question (e.g., "Why do you want to work here?"), write a highly professional, custom 1-2 sentence answer utilizing the applicant's "Summary" and "Core Skills".
6. If you cannot confidently answer a field, omit it from the JSON.

Example Output format:
{
  "first-name-input": "Ashutosh",
  "linkedin_url_field": "https://linkedin.com/in/ashutosh",
  "custom_question_123": "With my robust background in the MERN stack, I am eager to apply my full-stack skills to..."
}`;

    const userPrompt = `APPLICANT PROFILE:\n${applicantContext}\n\nFORM FIELDS EXTRACTED:\n${JSON.stringify(formFields, null, 2)}\n\nGenerate JSON mapping.`;

    // 4. Ask Sarvam AI to do the mapping
    const response = await aiClient.chat.completions({
      model: "sarvam-105b", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2, 
      max_tokens: 4096,
    });

    const aiMessage = response.choices[0]?.message;
    let rawOutput = aiMessage?.content || (aiMessage as any)?.reasoning_content || "{}";
    

    rawOutput = rawOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const fieldMapping = JSON.parse(rawOutput);

    res.json({ success: true, mapping: fieldMapping });

  } catch (error) {
    console.error('Agent Autofill Error:', error);
    res.status(500).json({ error: 'Agent failed to map fields.' });
  }
};