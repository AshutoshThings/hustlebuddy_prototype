import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

//Routes
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import aiRoutes from './routes/ai.routes';
import applicationRoutes from './routes/application.routes';
//import jobs from './routes/jobs.routes';
import profileRoutes from './routes/profile.routes';
dotenv.config();
console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 30));
const app = express();
const port = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use(cors());

//Mount Routes
app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/ai', aiRoutes); 
app.use('/applications', applicationRoutes);
//app.use('/jobs', jobs);
app.use('/profile', profileRoutes);

// Server Start 
app.listen(port, () => {
  console.log(`HustleBuddy Backend running on http://localhost:${port}`);
  console.log(`Connected to Supabase`);
});
