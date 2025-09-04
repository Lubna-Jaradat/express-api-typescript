import { Course } from '../shared/interfaces/course.interface';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { courseRepository } from './course.repository';
import { CustomError } from '../shared/utils/custom-error';
import { randomUUID } from 'crypto';

export class CourseService {
  createCourse(data: CreateCourseDto, creatorId: string): Course {
    const newCourse: Course = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      ...(data.image !== undefined && { image: data.image }), // include only if defined
      createdBy: creatorId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return courseRepository.create(newCourse);
  }

  getAllCourses(): Course[] {
    return courseRepository.findAll();
  }

  getCourseById(courseId: string): Course {
    const course = courseRepository.findById(courseId);
    if (!course) {
      throw new CustomError('Course not found', 404);
    }
    return course;
  }

  updateCourse(courseId: string, data: UpdateCourseDto, userId: string, userRole: string): Course {
    const course = courseRepository.findById(courseId);
    if (!course) {
      throw new CustomError('Course not found', 404);
    }

    // Check permissions
    if (userRole !== 'ADMIN' && course.createdBy !== userId) {
      throw new CustomError('You can only update your own courses', 403);
    }

    // Build updates object safely
    const updates: Partial<Course> = { updatedAt: new Date() };
    if (data.title !== undefined) updates.title = data.title;
    if (data.description !== undefined) updates.description = data.description;
    if (data.image !== undefined) updates.image = data.image;

    const updatedCourse = courseRepository.update(courseId, updates);
    if (!updatedCourse) {
      throw new CustomError('Failed to update course', 500);
    }

    return updatedCourse;
  }

  deleteCourse(courseId: string, userId: string, userRole: string): void {
    const course = courseRepository.findById(courseId);
    if (!course) {
      throw new CustomError('Course not found', 404);
    }

    // Check permissions
    if (userRole !== 'ADMIN' && course.createdBy !== userId) {
      throw new CustomError('You can only delete your own courses', 403);
    }

    const deleted = courseRepository.delete(courseId);
    if (!deleted) {
      throw new CustomError('Failed to delete course', 500);
    }
  }
}

export const courseService = new CourseService();
