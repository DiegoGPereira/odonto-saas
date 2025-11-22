import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const appointmentController = new AppointmentController();

router.use(authMiddleware);

router.post('/', appointmentController.create);
router.get('/', appointmentController.findAll);
router.patch('/:id/status', appointmentController.updateStatus);

export { router as appointmentRoutes };
