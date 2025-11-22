import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

const userService = new UserService();

export class UserController {
    async findAll(req: Request, res: Response) {
        try {
            const users = await userService.findAll();
            return res.json(users);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await userService.findById(id);
            return res.json(user);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const user = await userService.create(req.body);
            return res.status(201).json(user);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await userService.update(id, req.body);
            return res.json(user);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await userService.delete(id);
            return res.json(result);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
