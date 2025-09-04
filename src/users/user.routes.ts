import { Router } from 'express';
import { userController } from './user.controller';
import { authenticate } from '../shared/middlewares/auth.middleware';
import { authorize } from '../shared/middlewares/role.middleware';

const router = Router();

router.get('/me', authenticate, userController.getProfile);
router.put('/me', authenticate, userController.updateProfile);
router.post('/coach', authenticate, authorize('ADMIN'), userController.createCoach);

export { router as userRoutes };