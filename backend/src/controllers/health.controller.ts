import { Request, Response } from 'express';
import pool from '../utils/db';

export const checkHealth = async (req: Request, res: Response) => {
  try {
    const dbRes = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      message: 'HustleBuddy Backend is live and connected to the database', 
      dbTime: dbRes.rows[0].now 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'error', message: 'Database disconnected' });
  }
};