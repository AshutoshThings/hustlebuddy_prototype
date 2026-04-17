import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const registerUser = async (req: Request, res: Response): Promise<any> => {
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

    const token = jwt.sign({ userId: newUser.rows[0].id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'User registered', token, user: newUser.rows[0] });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userQuery.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userQuery.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

