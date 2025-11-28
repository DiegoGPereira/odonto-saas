import prisma from '../utils/prisma';

interface CreateTransactionDTO {
    type: string;
    category: string;
    amount: number;
    description: string;
    date?: Date;
    status: string;
    patientId?: string;
    appointmentId?: string;
    createdById: string;
}

interface UpdateTransactionDTO {
    type?: string;
    category?: string;
    amount?: number;
    description?: string;
    date?: Date;
    status?: string;
    patientId?: string;
    appointmentId?: string;
}

interface TransactionFilters {
    type?: string;
    category?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    patientId?: string;
}

class TransactionService {
    async getAllTransactions(filters?: TransactionFilters, userId?: string, userRole?: string) {
        const where: any = {};

        if (filters?.type) where.type = filters.type;
        if (filters?.category) where.category = filters.category;
        if (filters?.status) where.status = filters.status;
        if (filters?.patientId) where.patientId = filters.patientId;

        // If user is a dentist, they can only see their own transactions
        if (userRole === 'DENTIST' && userId) {
            where.createdById = userId;
        }

        if (filters?.startDate || filters?.endDate) {
            where.date = {};
            if (filters.startDate) where.date.gte = filters.startDate;
            if (filters.endDate) where.date.lte = filters.endDate;
        }

        return prisma.transaction.findMany({
            where,
            include: {
                patient: {
                    select: { id: true, name: true }
                },
                appointment: {
                    select: { id: true, date: true }
                },
                createdBy: {
                    select: { id: true, name: true }
                }
            },
            orderBy: { date: 'desc' }
        });
    }

    async getTransactionById(id: string) {
        return prisma.transaction.findUnique({
            where: { id },
            include: {
                patient: true,
                appointment: true,
                createdBy: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
    }

    async createTransaction(data: CreateTransactionDTO) {
        return prisma.transaction.create({
            data: {
                type: data.type,
                category: data.category,
                amount: data.amount,
                description: data.description,
                date: data.date || new Date(),
                status: data.status,
                patientId: data.patientId,
                appointmentId: data.appointmentId,
                createdById: data.createdById
            },
            include: {
                patient: {
                    select: { id: true, name: true }
                },
                createdBy: {
                    select: { id: true, name: true }
                }
            }
        });
    }

    async updateTransaction(id: string, data: UpdateTransactionDTO, userId?: string, userRole?: string) {
        // If user is a dentist, check if they own the transaction
        if (userRole === 'DENTIST' && userId) {
            const transaction = await prisma.transaction.findUnique({
                where: { id },
                select: { createdById: true }
            });

            if (!transaction) {
                throw new Error('Transação não encontrada');
            }

            if (transaction.createdById !== userId) {
                throw new Error('Você não tem permissão para editar esta transação');
            }
        }

        return prisma.transaction.update({
            where: { id },
            data,
            include: {
                patient: {
                    select: { id: true, name: true }
                },
                createdBy: {
                    select: { id: true, name: true }
                }
            }
        });
    }

    async deleteTransaction(id: string, userId?: string, userRole?: string) {
        // If user is a dentist, check if they own the transaction
        if (userRole === 'DENTIST' && userId) {
            const transaction = await prisma.transaction.findUnique({
                where: { id },
                select: { createdById: true }
            });

            if (!transaction) {
                throw new Error('Transação não encontrada');
            }

            if (transaction.createdById !== userId) {
                throw new Error('Você não tem permissão para excluir esta transação');
            }
        }

        return prisma.transaction.delete({
            where: { id }
        });
    }

    async getFinancialSummary(startDate?: Date, endDate?: Date, userId?: string, userRole?: string) {
        const where: any = {};

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = startDate;
            if (endDate) where.date.lte = endDate;
        }

        // If user is a dentist, filter by their ID
        if (userRole === 'DENTIST' && userId) {
            where.createdById = userId;
        }

        const transactions = await prisma.transaction.findMany({
            where: {
                ...where,
                status: 'PAID'
            }
        });

        const income = transactions
            .filter((t: any) => t.type === 'INCOME')
            .reduce((sum: number, t: any) => sum + t.amount, 0);

        const expenses = transactions
            .filter((t: any) => t.type === 'EXPENSE')
            .reduce((sum: number, t: any) => sum + t.amount, 0);

        const balance = income - expenses;

        const pending = await prisma.transaction.findMany({
            where: {
                ...where,
                status: 'PENDING'
            }
        });

        const pendingIncome = pending
            .filter((t: any) => t.type === 'INCOME')
            .reduce((sum: number, t: any) => sum + t.amount, 0);

        return {
            income,
            expenses,
            balance,
            pendingIncome,
            totalTransactions: transactions.length
        };
    }
}

export default new TransactionService();
