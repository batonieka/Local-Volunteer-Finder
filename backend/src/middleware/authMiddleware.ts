import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'supersecret';
    const decoded = jwt.verify(token, secret);

    // ✅ Type check to make sure decoded is a JwtPayload
    if (typeof decoded === 'object' && 'id' in decoded && 'email' in decoded) {
      req.user = {
        id: (decoded as JwtPayload).id,
        email: (decoded as JwtPayload).email,
        role: (decoded as JwtPayload).role,
      };
      next();
    } else {
      return res.status(403).json({ error: 'Invalid token structure' });
    }
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
