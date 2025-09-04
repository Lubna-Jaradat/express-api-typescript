import { Request, Response, NextFunction } from 'express';
import { CreateCourseSchema, UpdateCourseSchema } from './course.dto';
import { courseService } from './course.service';
import { AuthRequest } from '../shared/middlewares/auth.middleware';
import { CustomError } from '../shared/utils/custom-error';

export class CourseController {
  createCourse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = CreateCourseSchema.parse(req.body);
      if (!req.user?.userId) throw new CustomError('User not authenticated', 401);

      const course = courseService.createCourse(validatedData, req.user.userId);

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: course
      });
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        next(new CustomError('Validation failed', 400));
      } else {
        next(error);
      }
    }
  }

  getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = courseService.getAllCourses();

      res.json({
        success: true,
        data: courses
      });
    } catch (error) {
      next(error);
    }
  }

  getCourseById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id) throw new CustomError('Course ID is required', 400);

      const course = courseService.getCourseById(id);

      res.json({
        success: true,
        data: course
      });
    } catch (error) {
      next(error);
    }
  }

  updateCourse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id) throw new CustomError('Course ID is required', 400);
      if (!req.user?.userId || !req.user.role) throw new CustomError('User not authenticated', 401);

      const validatedData = UpdateCourseSchema.parse(req.body);
      const course = courseService.updateCourse(id, validatedData, req.user.userId, req.user.role);

      res.json({
        success: true,
        message: 'Course updated successfully',
        data: course
      });
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        next(new CustomError('Validation failed', 400));
      } else {
        next(error);
      }
    }
  }

  deleteCourse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id) throw new CustomError('Course ID is required', 400);
      if (!req.user?.userId || !req.user.role) throw new CustomError('User not authenticated', 401);

      courseService.deleteCourse(id, req.user.userId, req.user.role);

      res.json({
        success: true,
        message: 'Course deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export const courseController = new CourseController();
