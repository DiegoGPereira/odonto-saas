import prisma from '../utils/prisma';

interface CreatePublicAppointmentRequestDTO {
    name: string;
    phone: string;
    email?: string;
    preferredDate: Date;
    reason?: string;
}

class PublicAppointmentService {
    async createRequest(data: CreatePublicAppointmentRequestDTO) {
        return prisma.publicAppointmentRequest.create({
            data: {
                name: data.name,
                phone: data.phone,
                email: data.email,
                preferredDate: data.preferredDate,
                reason: data.reason,
                status: 'PENDING'
            }
        });
    }

    async getAllRequests() {
        return prisma.publicAppointmentRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async getRequestById(id: string) {
        return prisma.publicAppointmentRequest.findUnique({
            where: { id }
        });
    }

    async updateRequestStatus(id: string, status: string) {
        return prisma.publicAppointmentRequest.update({
            where: { id },
            data: { status }
        });
    }

    async deleteRequest(id: string) {
        return prisma.publicAppointmentRequest.delete({
            where: { id }
        });
    }
}

export default new PublicAppointmentService();
