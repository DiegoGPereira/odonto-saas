import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
    async login(req: Request, res: Response) {
        try {
            const result = await authService.login(req.body);
            return res.json(result);
        } catch (error: any) {
            return res.status(401).json({ error: error.message });
        }
    }

    async register(req: Request, res: Response) {
        try {
            const result = await authService.register(req.body);
            return res.status(201).json(result);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
