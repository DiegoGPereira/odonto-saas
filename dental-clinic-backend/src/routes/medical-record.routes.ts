import { Router } from 'express';
import { MedicalRecordController } from '../controllers/MedicalRecordController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const medicalRecordController = new MedicalRecordController();

import { requireRole } from '../middlewares/roleMiddleware';

router.use(authMiddleware);

router.post('/', requireRole('DENTIST'), medicalRecordController.create);
router.get('/', medicalRecordController.findAll);
router.get('/patient/:patientId', medicalRecordController.findByPatient);

export { router as medicalRecordRoutes };
