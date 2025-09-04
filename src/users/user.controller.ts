import { Response, NextFunction } from 'express';
import { UpdateProfileSchema, CreateCoachSchema } from './user.dto';
import { userService } from './user.service';
import { AuthRequest } from '../shared/middlewares/auth.middleware';
import { CustomError } from '../shared/utils/custom-error';

export class UserController {
  getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = userService.getUserProfile(req.user!.userId);
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = UpdateProfileSchema.parse(req.body);
      const updatedUser = userService.updateProfile(req.user!.userId, validatedData);
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        next(new CustomError('Validation failed', 400));
      } else {
        next(error);
      }
    }
  }

  async createCoach(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = CreateCoachSchema.parse(req.body);
      const coach = await userService.createCoach(validatedData);
      
      res.status(201).json({
        success: true,
        message: 'Coach created successfully',
        data: coach
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

export const userController = new UserController();