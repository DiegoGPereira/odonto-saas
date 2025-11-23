import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedLayout } from '../components/ProtectedLayout';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Patients } from '../pages/Patients';
import { Appointments } from '../pages/Appointments';
import { MedicalRecords } from '../pages/MedicalRecords';
import { Admin } from '../pages/Admin';
import { Financial } from '../pages/Financial';
import { PublicBooking } from '../pages/PublicBooking';
import { AppointmentRequests } from '../pages/AppointmentRequests';

export const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes - no authentication required */}
                <Route path="/agendar" element={<PublicBooking />} />

                {/* Routes with AuthProvider */}
                <Route path="/*" element={
                    <AuthProvider>
                        <Routes>
                            <Route path="/login" element={<Login />} />

                            <Route path="/" element={<ProtectedLayout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="patients" element={<Patients />} />
                                <Route path="appointments" element={<Appointments />} />
                                <Route path="medical-records" element={<MedicalRecords />} />
                                <Route path="admin" element={<Admin />} />
                                <Route path="financial" element={<Financial />} />
                                <Route path="appointment-requests" element={<AppointmentRequests />} />
                            </Route>

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </AuthProvider>
                } />
            </Routes>
        </BrowserRouter>
    );
};
