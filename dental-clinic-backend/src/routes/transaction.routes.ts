import { Router } from 'express';
import transactionController from '../controllers/TransactionController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/transactions', transactionController.getAllTransactions);
router.get('/transactions/summary', transactionController.getFinancialSummary);
router.get('/transactions/:id', transactionController.getTransactionById);
router.post('/transactions', transactionController.createTransaction);
router.put('/transactions/:id', transactionController.updateTransaction);
router.delete('/transactions/:id', transactionController.deleteTransaction);

export default router;
