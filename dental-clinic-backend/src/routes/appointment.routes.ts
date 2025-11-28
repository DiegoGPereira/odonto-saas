import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';
import { authMiddleware } from '../middlewares/auth';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();
const appointmentController = new AppointmentController();

router.use(authMiddleware);

router.post('/', requireRole('ADMIN', 'SECRETARY'), appointmentController.create);
router.get('/', appointmentController.findAll);
router.patch('/:id/status', requireRole('ADMIN', 'SECRETARY', 'DENTIST'), appointmentController.updateStatus);

export { router as appointmentRoutes };
