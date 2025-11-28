import { Router } from 'express';
import transactionController from '../controllers/TransactionController';
import { authMiddleware } from '../middlewares/auth';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/transactions', requireRole('ADMIN', 'SECRETARY', 'DENTIST'), transactionController.getAllTransactions);
router.get('/transactions/summary', requireRole('ADMIN', 'SECRETARY', 'DENTIST'), transactionController.getFinancialSummary);
router.get('/transactions/:id', requireRole('ADMIN', 'SECRETARY', 'DENTIST'), transactionController.getTransactionById);
router.post('/transactions', requireRole('ADMIN', 'SECRETARY', 'DENTIST'), transactionController.createTransaction);
router.put('/transactions/:id', requireRole('ADMIN', 'SECRETARY', 'DENTIST'), transactionController.updateTransaction);
router.delete('/transactions/:id', requireRole('ADMIN', 'SECRETARY', 'DENTIST'), transactionController.deleteTransaction);

export default router;
