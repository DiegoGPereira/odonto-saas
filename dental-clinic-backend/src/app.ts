import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

import { authRoutes } from './routes/auth.routes';
import { patientRoutes } from './routes/patient.routes';
import { appointmentRoutes } from './routes/appointment.routes';
import { medicalRecordRoutes } from './routes/medical-record.routes';
import { userRoutes } from './routes/user.routes';
import { odontogramRoutes } from './routes/odontogram.routes';
import transactionRoutes from './routes/transaction.routes';
import publicRoutes from './routes/public.routes';

// Public routes MUST come first (before protected routes)
app.use(publicRoutes);

app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/medical-records', medicalRecordRoutes);
app.use('/users', userRoutes);
app.use('/odontogram', odontogramRoutes);
app.use(transactionRoutes);

export { app };
