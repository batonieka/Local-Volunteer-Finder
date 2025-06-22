// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

// Limit for GET requests (e.g., 100 per hour)
export const getLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: 'Too many GET requests from this IP, please try again in an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Limit for POST, PUT, DELETE requests (e.g., 20 per hour)
export const writeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'Too many write requests (POST/PUT/DELETE), please try again in an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});
