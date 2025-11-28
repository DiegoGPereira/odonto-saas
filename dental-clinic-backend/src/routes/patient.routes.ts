import { Router } from 'express';
import { PatientController } from '../controllers/PatientController';
import { authMiddleware } from '../middlewares/auth';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();
const patientController = new PatientController();

router.use(authMiddleware);

router.post('/', requireRole('ADMIN', 'SECRETARY'), patientController.create);
router.get('/', patientController.findAll);
router.get('/:id', patientController.findById);
router.put('/:id', requireRole('ADMIN', 'SECRETARY'), patientController.update);

export { router as patientRoutes };
