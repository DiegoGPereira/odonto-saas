import { Router } from 'express';
import { ProcedureController } from '../controllers/ProcedureController';
import { authMiddleware } from '../middlewares/auth';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();
const procedureController = new ProcedureController();

router.use(authMiddleware);

// Public read access for authenticated users (needed for financial)
router.get('/', procedureController.findAll);
router.get('/:id', procedureController.findById);

// Admin only write access
router.post('/', requireRole('ADMIN'), procedureController.create);
router.put('/:id', requireRole('ADMIN'), procedureController.update);
router.delete('/:id', requireRole('ADMIN'), procedureController.delete);

export { router as procedureRoutes };
