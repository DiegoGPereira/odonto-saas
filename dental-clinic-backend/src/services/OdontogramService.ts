import prisma from '../utils/prisma';

interface UpdateToothDTO {
    patientId: string;
    number: number;
    status: string;
    notes?: string;
    procedureId?: string;
    amount?: number;
    dentistId: string;
}

export class OdontogramService {
    async getPatientOdontogram(patientId: string) {
        return prisma.tooth.findMany({
            where: { patientId },
            include: {
                lastProcedure: true
            },
            orderBy: { number: 'asc' },
        });
    }

    async updateTooth({ patientId, number, status, notes, procedureId, amount, dentistId }: UpdateToothDTO) {
        // 1. Buscar estado anterior do dente
        const previousTooth = await prisma.tooth.findUnique({
            where: {
                patientId_number: {
                    patientId,
                    number,
                },
            },
        });

        // 2. Criar transação financeira se houver procedimento e valor
        let transaction = null;
        if (procedureId && amount && amount > 0) {
            const procedure = await prisma.procedure.findUnique({
                where: { id: procedureId }
            });

            transaction = await prisma.transaction.create({
                data: {
                    type: 'INCOME',
                    category: 'PROCEDURE',
                    amount,
                    description: `${procedure?.name || 'Procedimento'} - Dente ${number}`,
                    status: 'PENDING',
                    patientId,
                    createdById: dentistId,
                },
            });
        }

        // 3. Criar registro de histórico
        await prisma.toothHistory.create({
            data: {
                toothNumber: number,
                previousStatus: previousTooth?.status,
                newStatus: status,
                notes,
                procedureId,
                amount,
                patientId,
                dentistId,
                transactionId: transaction?.id,
            },
        });

        // 4. Atualizar ou criar dente
        const tooth = await prisma.tooth.upsert({
            where: {
                patientId_number: {
                    patientId,
                    number,
                },
            },
            update: {
                status,
                notes,
                lastProcedureId: procedureId,
            },
            create: {
                patientId,
                number,
                status,
                notes,
                lastProcedureId: procedureId,
            },
            include: {
                lastProcedure: true
            }
        });

        return tooth;
    }

    async getToothHistory(patientId: string, toothNumber: number) {
        return prisma.toothHistory.findMany({
            where: {
                patientId,
                toothNumber,
            },
            include: {
                procedure: true,
                dentist: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                transaction: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}
