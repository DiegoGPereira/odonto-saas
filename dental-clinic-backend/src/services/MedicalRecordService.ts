import prisma from '../utils/prisma';
import { z } from 'zod';

const medicalRecordSchema = z.object({
    patientId: z.string().uuid(),
    dentistId: z.string().uuid(),
    description: z.string().min(10),
});

export class MedicalRecordService {
    async create(data: z.infer<typeof medicalRecordSchema>) {
        const record = await prisma.medicalRecord.create({
            data: {
                description: data.description,
                date: new Date(),
                patient: {
                    connect: { id: data.patientId }
                },
                dentist: {
                    connect: { id: data.dentistId }
                },
            },
            include: {
                patient: { select: { id: true, name: true } },
                dentist: { select: { id: true, name: true } },
            },
        });
        return record;
    }

    async findByPatient(patientId: string) {
        return prisma.medicalRecord.findMany({
            where: { patientId },
            include: { dentist: { select: { name: true } } },
            orderBy: { date: 'desc' },
        });
    }

    async findAll() {
        return prisma.medicalRecord.findMany({
            include: {
                patient: { select: { name: true } },
                dentist: { select: { name: true } }
            },
            orderBy: { date: 'desc' },
        });
    }
}
