import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export class AuthService {
    async login(data: z.infer<typeof loginSchema>) {
        const { email, password } = loginSchema.parse(data);

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new Error('Credenciais inválidas');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new Error('Credenciais inválidas');
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
    }

    async register(data: any) {
        // Implement registration logic if needed, or keep it in UserController
        // For now, let's assume registration is done via a separate User service or seed
        // But for completeness, let's add a simple register for admin/initial setup
        const { name, email, password, role } = data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) throw new Error('Usuário já existe');

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role
            }
        });

        return user;
    }
}
