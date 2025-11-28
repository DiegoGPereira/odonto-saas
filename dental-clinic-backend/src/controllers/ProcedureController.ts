import { Request, Response } from 'express';
import { ProcedureService } from '../services/ProcedureService';

const procedureService = new ProcedureService();

export class ProcedureController {
    async findAll(req: Request, res: Response) {
        try {
            const procedures = await procedureService.findAll();
            return res.json(procedures);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const procedure = await procedureService.findById(id);
            return res.json(procedure);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const procedure = await procedureService.create(req.body);
            return res.status(201).json(procedure);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const procedure = await procedureService.update(id, req.body);
            return res.json(procedure);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await procedureService.delete(id);
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
