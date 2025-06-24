import { UserPayload } from '../../types';

declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      role?: string;
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}