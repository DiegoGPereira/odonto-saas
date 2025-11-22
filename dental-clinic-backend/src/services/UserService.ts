import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const createUserSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    role: z.enum(['ADMIN', 'DENTIST', 'SECRETARY']),
});

const updateUserSchema = z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(['ADMIN', 'DENTIST', 'SECRETARY']).optional(),
});

export class UserService {
    async findAll() {
        return prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { name: 'asc' },
        });
    }

    async findById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        return user;
    }

    async create(data: z.infer<typeof createUserSchema>) {
        const validated = createUserSchema.parse(data);

        const existingUser = await prisma.user.findUnique({
            where: { email: validated.email },
        });

        if (existingUser) {
            throw new Error('Email já está em uso');
        }

        const passwordHash = await bcrypt.hash(validated.password, 10);

        const user = await prisma.user.create({
            data: {
                name: validated.name,
                email: validated.email,
                passwordHash,
                role: validated.role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user;
    }

    async update(id: string, data: z.infer<typeof updateUserSchema>) {
        const validated = updateUserSchema.parse(data);

        // Check if user exists
        await this.findById(id);

        // Check if email is being changed and if it's already in use
        if (validated.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: validated.email },
            });

            if (existingUser && existingUser.id !== id) {
                throw new Error('Email já está em uso');
            }
        }

        const updateData: any = {
            name: validated.name,
            email: validated.email,
            role: validated.role,
        };

        // Hash password if provided
        if (validated.password) {
            updateData.passwordHash = await bcrypt.hash(validated.password, 10);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user;
    }

    async delete(id: string) {
        // Check if user exists
        await this.findById(id);

        // Check if user has appointments or medical records
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                appointments: true,
                medicalRecords: true,
            },
        });

        if (user && (user.appointments.length > 0 || user.medicalRecords.length > 0)) {
            throw new Error('Não é possível deletar usuário com agendamentos ou prontuários associados');
        }

        await prisma.user.delete({
            where: { id },
        });

        return { message: 'Usuário deletado com sucesso' };
    }
}
