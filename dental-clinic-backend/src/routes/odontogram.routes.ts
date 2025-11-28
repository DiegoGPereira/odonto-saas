import { Router } from 'express';
import { OdontogramController } from '../controllers/OdontogramController';
import { authMiddleware } from '../middlewares/auth';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();
const odontogramController = new OdontogramController();

router.use(authMiddleware);

router.get('/:patientId', odontogramController.getPatientOdontogram);
router.get('/:patientId/tooth/:toothNumber/history', odontogramController.getToothHistory);
router.put('/:patientId/tooth', requireRole('DENTIST'), odontogramController.updateTooth);

export { router as odontogramRoutes };
