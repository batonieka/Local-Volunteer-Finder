// Local-Volunteer-Finder/backend/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { reportErrorToExternalService } from '../utils/errorReporter';

// Optional: Define error types for better categorization
interface CustomError extends Error {
  status?: number;
  isOperational?: boolean;
}

// Enhanced centralized error handler
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Log the error details
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    status: statusCode,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
    timestamp: new Date().toISOString()
  });

  // Report to external monitoring service (stubbed)
  reportErrorToExternalService({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  // Response payload
  const responsePayload: Record<string, any> = {
    error: 'Internal server error'
  };

  if (isDevelopment) {
    responsePayload.message = err.message;
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};
