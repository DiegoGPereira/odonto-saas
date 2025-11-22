import { Router } from 'express';
import { PatientController } from '../controllers/PatientController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const patientController = new PatientController();

router.use(authMiddleware);

router.post('/', patientController.create);
router.get('/', patientController.findAll);
router.get('/:id', patientController.findById);
router.put('/:id', patientController.update);

export { router as patientRoutes };
