import { Request, Response } from 'express';
import { MedicalRecordService } from '../services/MedicalRecordService';

const medicalRecordService = new MedicalRecordService();

export class MedicalRecordController {
    async create(req: Request, res: Response) {
        try {
            const record = await medicalRecordService.create(req.body);
            return res.status(201).json(record);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findByPatient(req: Request, res: Response) {
        try {
            const { patientId } = req.params;
            const records = await medicalRecordService.findByPatient(patientId);
            return res.json(records);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const records = await medicalRecordService.findAll();
            return res.json(records);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
