import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// Simple file path for audit logs
const auditFilePath = path.join(__dirname, '../../logs/audit.log');

// Log only write operations (POST, PUT, DELETE)
const trackedMethods = ['POST', 'PUT', 'DELETE'];

export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
  if (!trackedMethods.includes(req.method)) {
    return next();
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    body: req.body,
    user: req.headers['x-user-id'] || 'anonymous', // Simulate user if you don't have auth
  };

  const logLine = JSON.stringify(logEntry) + '\n';

  fs.appendFile(auditFilePath, logLine, (err) => {
    if (err) {
      console.error('Failed to write audit log:', err);
    }
  });

  next();
};
