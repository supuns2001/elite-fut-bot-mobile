import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import { authRouter } from './routes/auth';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for mobile app & local web clients
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Built-in JSON body parser
app.use(express.json());

// Basic health check route
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Elite FUT Bot Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

// Authentication routes
app.use('/api/auth', authRouter);

// Connect to MongoDB
void connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Elite FUT Bot Server running on port ${PORT}`);
  console.log(`📡 Health Check URL: http://localhost:${PORT}/api/health`);
});

export default app;
