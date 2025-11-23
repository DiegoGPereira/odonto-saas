import { Request, Response } from 'express';
import publicAppointmentService from '../services/PublicAppointmentService';

class PublicAppointmentController {
    // Public endpoint - no auth required
    async createRequest(req: Request, res: Response) {
        try {
            const { name, phone, email, preferredDate, reason } = req.body;

            if (!name || !phone || !preferredDate) {
                return res.status(400).json({
                    error: 'Nome, telefone e data preferida são obrigatórios'
                });
            }

            const request = await publicAppointmentService.createRequest({
                name,
                phone,
                email,
                preferredDate: new Date(preferredDate),
                reason
            });

            return res.status(201).json(request);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Admin only - requires auth
    async getAllRequests(req: Request, res: Response) {
        try {
            const requests = await publicAppointmentService.getAllRequests();
            return res.json(requests);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async updateRequestStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
                return res.status(400).json({
                    error: 'Status inválido'
                });
            }

            const request = await publicAppointmentService.updateRequestStatus(id, status);
            return res.json(request);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async deleteRequest(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await publicAppointmentService.deleteRequest(id);
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export default new PublicAppointmentController();
