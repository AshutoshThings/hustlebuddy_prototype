import { Request, Response } from 'express';
import pool from '../utils/db';

export const saveApplication = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, jobTitle, companyName, proposalText } = req.body;

    if (!userId || !jobTitle || !companyName || !proposalText) {
      return res.status(400).json({ 
        error: 'Missing required fields. Need userId, jobTitle, companyName, and proposalText.' 
      });
    }
    const insertQuery = `
      INSERT INTO applications (user_id, job_title, company_name, proposal_text) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *;
    `;
    
    const newApplication = await pool.query(insertQuery, [
      userId, 
      jobTitle, 
      companyName, 
      proposalText
    ]);

    res.status(201).json({ 
      success: true, 
      message: 'Application saved successfully',
      application: newApplication.rows[0] 
    });

  } catch (error) {
    console.error('Error saving application:', error);
    res.status(500).json({ error: 'Failed to save application to the database.' });
  }
};