import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Appointments } from './pages/Appointments';
import { Patients } from './pages/Patients';
import { MedicalRecords } from './pages/MedicalRecords';
import { Financial } from './pages/Financial';
import { Procedures } from './pages/Procedures';
import { Admin as Users } from './pages/Admin';
import { AdminHub } from './pages/AdminHub';
import { AppointmentRequests } from './pages/AppointmentRequests';
import { PublicBooking } from './pages/PublicBooking';
import { ProtectedLayout } from './components/ProtectedLayout';

function App() {
    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/agendar" element={<PublicBooking />} />
                <Route path="/login" element={<Login />} />

                <Route path="/" element={<ProtectedLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/patients" element={<Patients />} />
                    <Route path="/medical-records" element={<MedicalRecords />} />
                    <Route path="/financial" element={<Financial />} />
                    <Route path="/appointment-requests" element={<AppointmentRequests />} />
                    <Route path="/admin" element={<AdminHub />} />
                    <Route path="/admin/users" element={<Users />} />
                    <Route path="/admin/procedures" element={<Procedures />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;

