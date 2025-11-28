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
            const { number, status, notes, procedureId, amount } = req.body;
            const user = (req as any).user;

            const tooth = await odontogramService.updateTooth({
                patientId,
                number,
                status,
                notes,
                procedureId,
                amount,
                dentistId: user.id
            });

            return res.json(tooth);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getToothHistory(req: Request, res: Response) {
        try {
            const { patientId, toothNumber } = req.params;
            const history = await odontogramService.getToothHistory(patientId, parseInt(toothNumber));
            return res.json(history);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
