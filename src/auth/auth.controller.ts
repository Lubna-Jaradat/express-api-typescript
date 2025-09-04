import { Request, Response, NextFunction } from 'express';
import { RegisterSchema, LoginSchema } from './auth.dto';
import { authService } from './auth.service';
import { CustomError } from '../shared/utils/custom-error';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = RegisterSchema.parse(req.body);
      const result = await authService.register(validatedData);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        next(new CustomError('Validation failed', 400));
      } else {
        next(error);
      }
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = LoginSchema.parse(req.body);
      const result = await authService.login(validatedData);
      
      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        next(new CustomError('Validation failed', 400));
      } else {
        next(error);
      }
    }
  }
}

export const authController = new AuthController();