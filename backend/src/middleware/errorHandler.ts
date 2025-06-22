// Local-Volunteer-Finder/backend/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  const isDevelopment = process.env.NODE_ENV === 'development';
  res.status(500).json({
    error: 'Internal server error',
    ...(isDevelopment && {
      message: err.message,
      stack: err.stack
    })
  });
};
