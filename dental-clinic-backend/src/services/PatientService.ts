import prisma from '../utils/prisma';
import { z } from 'zod';

const patientSchema = z.object({
    name: z.string().min(3),
    cpf: z.string().length(11),
    phone: z.string(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    birthDate: z.string().transform((str) => new Date(str)),
});

export class PatientService {
    async create(data: z.infer<typeof patientSchema>) {
        const { cpf } = data;
        const existingPatient = await prisma.patient.findUnique({ where: { cpf } });

        if (existingPatient) {
            throw new Error('Paciente já existe');
        }

        const patient = await prisma.patient.create({
            data: {
                ...data,
                birthDate: new Date(data.birthDate),
            },
        });

        return patient;
    }

    async findAll() {
        return prisma.patient.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async findById(id: string) {
        const patient = await prisma.patient.findUnique({
            where: { id },
            include: { appointments: true, medicalRecords: true },
        });

        if (!patient) {
            throw new Error('Paciente não encontrado');
        }

        return patient;
    }

    async update(id: string, data: Partial<z.infer<typeof patientSchema>>) {
        const updateData: any = { ...data };

        // Convert birthDate string to Date if present
        if (updateData.birthDate) {
            updateData.birthDate = new Date(updateData.birthDate);
        }

        const patient = await prisma.patient.update({
            where: { id },
            data: updateData,
        });
        return patient;
    }
}
