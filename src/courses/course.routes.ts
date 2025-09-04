
import { Router } from 'express';
import { courseController } from './course.controller';
import { authenticate } from '../shared/middlewares/auth.middleware';
import { authorize } from '../shared/middlewares/role.middleware';

const router = Router();

router.post('/', authenticate, authorize('ADMIN', 'COACH'), courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id', authenticate, authorize('ADMIN', 'COACH'), courseController.updateCourse);
router.delete('/:id', authenticate, authorize('ADMIN', 'COACH'), courseController.deleteCourse);

export { router as courseRoutes };