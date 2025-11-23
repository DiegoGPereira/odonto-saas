import prisma from '../utils/prisma';

interface UpdateToothDTO {
    patientId: string;
    number: number;
    status: string;
    notes?: string;
}

export class OdontogramService {
    async getPatientOdontogram(patientId: string) {
        return prisma.tooth.findMany({
            where: { patientId },
            orderBy: { number: 'asc' },
        });
    }

    async updateTooth({ patientId, number, status, notes }: UpdateToothDTO) {
        return prisma.tooth.upsert({
            where: {
                patientId_number: {
                    patientId,
                    number,
                },
            },
            update: {
                status,
                notes,
            },
            create: {
                patientId,
                number,
                status,
                notes,
            },
        });
    }
}
