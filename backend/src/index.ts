import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import OpenAI from 'openai';
import pool from './db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const aiClient = new OpenAI({
  baseURL: process.env.SARVAM_BASE_URL,
  apiKey: process.env.SARVAM_API_KEY,
});

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

app.get('/health', async (req: Request, res: Response) => {
  try {
    // Test the database connection with a simple raw query
    const dbRes = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      message: 'Server is running without Prisma!', 
      dbTime: dbRes.rows[0].now 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'error', message: 'Database disconnected' });
  }
});


app.post('/auth/register', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const insertQuery = `
      INSERT INTO users (email, password, name) 
      VALUES ($1, $2, $3) 
      RETURNING id, email, name
    `;
    const newUser = await pool.query(insertQuery, [email, hashedPassword, name]);

    // Generate token
    const token = jwt.sign({ userId: newUser.rows[0].id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      message: 'User registered successfully', 
      token, 
      user: newUser.rows[0] 
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// ==========================================
// 3. AI PROPOSAL GENERATOR (SARVAM AI)
// ==========================================
app.post('/generate-proposal', async (req: Request, res: Response): Promise<any> => {
  try {
    const { userProfile, jobDescription } = req.body;

    if (!userProfile || !jobDescription) {
      return res.status(400).json({ error: 'Both userProfile and jobDescription are required.' });
    }

    // Construct the prompt for Sarvam AI
    const systemPrompt = `You are an expert career coach and proposal writer. Your goal is to write a highly persuasive, concise, and professional job application proposal. Match the applicant's skills directly to the job requirements. Keep it under 300 words.`;
    
    const userPrompt = `
      APPLICANT PROFILE:
      ${userProfile}

      JOB DESCRIPTION:
      ${jobDescription}

      Task: Write a targeted cover letter/proposal for this job using the applicant's profile.
    `;

    // Call the AI model
    const completion = await aiClient.chat.completions.create({
      model: "sarvam-105b", // Make sure this matches Sarvam's exact model ID
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const generatedProposal = completion.choices[0]?.message?.content || 'Failed to generate proposal.';

    res.json({ 
      success: true, 
      proposal: generatedProposal 
    });

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate proposal via AI' });
  }
});

app.listen(port, () => {
  console.log(`Clean HustleBuddy Backend running on http://localhost:${port}`);
  console.log(`Connected to Supabase via raw pg pool`);
});