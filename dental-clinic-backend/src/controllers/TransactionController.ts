import { Request, Response } from 'express';
import transactionService from '../services/TransactionService';

class TransactionController {
    async getAllTransactions(req: Request, res: Response) {
        try {
            const { type, category, status, startDate, endDate, patientId } = req.query;
            const userId = (req as any).user?.id;
            const userRole = (req as any).user?.role;

            const filters: any = {};
            if (type) filters.type = type as string;
            if (category) filters.category = category as string;
            if (status) filters.status = status as string;
            if (patientId) filters.patientId = patientId as string;
            if (startDate) filters.startDate = new Date(startDate as string);
            if (endDate) filters.endDate = new Date(endDate as string);

            const transactions = await transactionService.getAllTransactions(filters, userId, userRole);
            return res.json(transactions);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getTransactionById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const transaction = await transactionService.getTransactionById(id);

            if (!transaction) {
                return res.status(404).json({ error: 'Transação não encontrada' });
            }

            return res.json(transaction);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async createTransaction(req: Request, res: Response) {
        try {
            const { type, category, amount, description, date, status, patientId, appointmentId } = req.body;

            // Get userId from authenticated request
            const userId = (req as any).user?.id;

            if (!userId) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }

            const transaction = await transactionService.createTransaction({
                type,
                category,
                amount: parseFloat(amount),
                description,
                date: date ? new Date(date) : undefined,
                status,
                patientId,
                appointmentId,
                createdById: userId
            });

            return res.status(201).json(transaction);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async updateTransaction(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { type, category, amount, description, date, status, patientId, appointmentId } = req.body;
            const userId = (req as any).user?.id;
            const userRole = (req as any).user?.role;

            const updateData: any = {};
            if (type !== undefined) updateData.type = type;
            if (category !== undefined) updateData.category = category;
            if (amount !== undefined) updateData.amount = parseFloat(amount);
            if (description !== undefined) updateData.description = description;
            if (date !== undefined) updateData.date = new Date(date);
            if (status !== undefined) updateData.status = status;
            if (patientId !== undefined) updateData.patientId = patientId;
            if (appointmentId !== undefined) updateData.appointmentId = appointmentId;

            const transaction = await transactionService.updateTransaction(id, updateData, userId, userRole);
            return res.json(transaction);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async deleteTransaction(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user?.id;
            const userRole = (req as any).user?.role;

            await transactionService.deleteTransaction(id, userId, userRole);
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getFinancialSummary(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            const userId = (req as any).user?.id;
            const userRole = (req as any).user?.role;

            const summary = await transactionService.getFinancialSummary(
                startDate ? new Date(startDate as string) : undefined,
                endDate ? new Date(endDate as string) : undefined,
                userId,
                userRole
            );

            return res.json(summary);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export default new TransactionController();
