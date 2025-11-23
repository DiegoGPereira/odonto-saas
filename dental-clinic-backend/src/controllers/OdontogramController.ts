import { Request, Response } from 'express';
import { OdontogramService } from '../services/OdontogramService';

const odontogramService = new OdontogramService();

export class OdontogramController {
    async getPatientOdontogram(req: Request, res: Response) {
        try {
            const { patientId } = req.params;
            const odontogram = await odontogramService.getPatientOdontogram(patientId);
            return res.json(odontogram);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async updateTooth(req: Request, res: Response) {
        try {
            const { patientId } = req.params;
            const { number, status, notes } = req.body;

            const tooth = await odontogramService.updateTooth({
                patientId,
                number,
                status,
                notes
            });

            return res.json(tooth);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
