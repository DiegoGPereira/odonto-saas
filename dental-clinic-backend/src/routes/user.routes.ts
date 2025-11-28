import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authMiddleware);

// Allow listing users for all authenticated users (needed for appointment creation)
router.get('/', userController.findAll);

// Admin only routes
router.get('/:id', requireRole('ADMIN'), userController.findById);
router.post('/', requireRole('ADMIN'), userController.create);
router.put('/:id', requireRole('ADMIN'), userController.update);
router.delete('/:id', requireRole('ADMIN'), userController.delete);

export { router as userRoutes };
