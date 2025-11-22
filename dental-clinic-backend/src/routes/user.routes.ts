import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();
const userController = new UserController();

// All routes require authentication and ADMIN role
router.use(authMiddleware);
router.use(requireRole('ADMIN'));

router.get('/', userController.findAll);
router.get('/:id', userController.findById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export { router as userRoutes };
