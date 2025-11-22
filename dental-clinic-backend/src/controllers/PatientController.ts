import { Request, Response } from 'express';
import { PatientService } from '../services/PatientService';

const patientService = new PatientService();

export class PatientController {
    async create(req: Request, res: Response) {
        try {
            const patient = await patientService.create(req.body);
            return res.status(201).json(patient);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        const patients = await patientService.findAll();
        return res.json(patients);
    }

    async findById(req: Request, res: Response) {
        try {
            const patient = await patientService.findById(req.params.id);
            return res.json(patient);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const patient = await patientService.update(req.params.id, req.body);
            return res.json(patient);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
