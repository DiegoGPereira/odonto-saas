import prisma from '../utils/prisma';
import { z } from 'zod';

const createProcedureSchema = z.object({
    category: z.string().min(1, 'Categoria é obrigatória'),
    name: z.string().min(1, 'Nome é obrigatório'),
    price: z.number().min(0, 'Preço deve ser maior ou igual a zero'),
});

const updateProcedureSchema = z.object({
    category: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    price: z.number().min(0).optional(),
});

export class ProcedureService {
    async findAll() {
        return prisma.procedure.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async findById(id: string) {
        const procedure = await prisma.procedure.findUnique({
            where: { id },
        });

        if (!procedure) {
            throw new Error('Procedimento não encontrado');
        }

        return procedure;
    }

    async create(data: z.infer<typeof createProcedureSchema>) {
        const validated = createProcedureSchema.parse(data);

        return prisma.procedure.create({
            data: validated,
        });
    }

    async update(id: string, data: z.infer<typeof updateProcedureSchema>) {
        const validated = updateProcedureSchema.parse(data);

        await this.findById(id);

        return prisma.procedure.update({
            where: { id },
            data: validated,
        });
    }

    async delete(id: string) {
        await this.findById(id);

        return prisma.procedure.delete({
            where: { id },
        });
    }
}
