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
  deleteOpportunity,
  getOpportunityCategories
} from './controllers/opportunityController';
import { errorHandler } from './middleware/errorHandler';
import { getLimiter, writeLimiter } from './middleware/rateLimiter';
import { toggleFavoriteOpportunity, getFavoritesByUser } from './controllers/favoriteController';
import { auditLogger } from './middleware/auditLogger';
import applicationRoutes from './routes/applicationRoutes';
import authRoutes from './routes/authRoutes';
import { getTopViewedOpportunities } from './controllers/opportunityController';



const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(auditLogger);

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
app.get('/opportunities/categories', getLimiter, getOpportunityCategories);
app.get('/opportunities/:id', getLimiter, getOpportunityById);

// Routes with WRITE rate limit
app.post('/opportunities', writeLimiter, createOpportunity);
app.put('/opportunities/:id', writeLimiter, updateOpportunity);
app.delete('/opportunities/:id', writeLimiter, deleteOpportunity);

// Favorites routes
app.get('/favorites/:userId', getFavoritesByUser);
app.post('/opportunities/:id/favorite/:userId', toggleFavoriteOpportunity);

// Application routes
app.use('/applications', applicationRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.use('/auth', authRoutes);

app.get('/opportunities/top-viewed', getTopViewedOpportunities);
