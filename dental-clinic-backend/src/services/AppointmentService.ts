
import { z } from 'zod';
import prisma from '../utils/prisma';

const appointmentSchema = z.object({
    patientId: z.string().uuid(),
    dentistId: z.string().uuid(),
    date: z.string().transform((str) => new Date(str)),
    notes: z.string().optional(),
});

export class AppointmentService {
    async create(data: z.infer<typeof appointmentSchema>) {
        const { dentistId, date } = data;

        // Check availability (simple check: no other appointment at the exact same time for the dentist)
        // In a real app, we'd check duration, working hours, etc.
        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                dentistId,
                date: new Date(date),
                status: { not: 'CANCELED' },
            },
        });

        if (existingAppointment) {
            throw new Error('Dentista não está disponível neste horário');
        }

        const appointment = await prisma.appointment.create({
            data: {
                date: new Date(date),
                notes: data.notes,
                patient: {
                    connect: { id: data.patientId }
                },
                dentist: {
                    connect: { id: dentistId }
                },
            },
            include: {
                patient: { select: { id: true, name: true } },
                dentist: { select: { id: true, name: true } },
            },
        });

        return appointment;
    }

    async findAll(userId?: string, role?: string) {
        const where: any = {};

        if (role === 'DENTIST' && userId) {
            where.dentistId = userId;
        }

        return prisma.appointment.findMany({
            where,
            include: {
                patient: { select: { name: true } },
                dentist: { select: { name: true } },
            },
            orderBy: { date: 'asc' },
        });
    }

    async findByDentist(dentistId: string) {
        return prisma.appointment.findMany({
            where: { dentistId },
            include: { patient: { select: { name: true } } },
            orderBy: { date: 'asc' }
        });
    }

    async updateStatus(id: string, status: 'CONFIRMED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW') {
        return prisma.appointment.update({
            where: { id },
            data: { status },
        });
    }
}
