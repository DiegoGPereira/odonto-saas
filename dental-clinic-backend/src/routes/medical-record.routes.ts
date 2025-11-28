import { Router } from 'express';
import { MedicalRecordController } from '../controllers/MedicalRecordController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const medicalRecordController = new MedicalRecordController();

import { requireRole } from '../middlewares/roleMiddleware';

router.use(authMiddleware);

router.post('/', requireRole('DENTIST'), medicalRecordController.create);
router.get('/', requireRole('ADMIN', 'DENTIST'), medicalRecordController.findAll);
router.get('/patient/:patientId', requireRole('ADMIN', 'DENTIST'), medicalRecordController.findByPatient);

export { router as medicalRecordRoutes };
