import { Request, Response } from 'express';
import { AppointmentService } from '../services/AppointmentService';

const appointmentService = new AppointmentService();

export class AppointmentController {
    async create(req: Request, res: Response) {
        try {
            const appointment = await appointmentService.create(req.body);
            return res.status(201).json(appointment);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        const appointments = await appointmentService.findAll();
        return res.json(appointments);
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const { status } = req.body;
            const appointment = await appointmentService.updateStatus(req.params.id, status);
            return res.json(appointment);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
