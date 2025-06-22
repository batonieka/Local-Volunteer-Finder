// src/index.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
} from './controllers/opportunityController';
import { errorHandler } from './middleware/errorHandler';
import { getLimiter, writeLimiter } from './middleware/rateLimiter';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes with GET rate limit
app.get('/opportunities', getLimiter, getAllOpportunities);
app.get('/opportunities/:id', getLimiter, getOpportunityById);

// Routes with WRITE rate limit
app.post('/opportunities', writeLimiter, createOpportunity);
app.put('/opportunities/:id', writeLimiter, updateOpportunity);
app.delete('/opportunities/:id', writeLimiter, deleteOpportunity);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
