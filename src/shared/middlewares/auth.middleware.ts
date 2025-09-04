import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { CustomError } from '../utils/custom-error';
import { inMemoryStore } from '../data/in-memory-store';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new CustomError('Token not found', 401);
    }

    const decoded = verifyToken(token);
    
    const user = inMemoryStore.users.find(u => u.id === decoded.userId);
    if (!user) {
      throw new CustomError('User not found', 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError('Invalid token', 401));
    }
  }
};
