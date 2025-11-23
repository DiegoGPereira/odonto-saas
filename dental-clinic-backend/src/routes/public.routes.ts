import { Router } from 'express';
import publicAppointmentController from '../controllers/PublicAppointmentController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Public route - no authentication required
router.post('/public/appointment-request', publicAppointmentController.createRequest);

// Protected routes - require authentication
router.get('/public/appointment-requests', authMiddleware, publicAppointmentController.getAllRequests);
router.put('/public/appointment-requests/:id/status', authMiddleware, publicAppointmentController.updateRequestStatus);
router.delete('/public/appointment-requests/:id', authMiddleware, publicAppointmentController.deleteRequest);

export default router;
