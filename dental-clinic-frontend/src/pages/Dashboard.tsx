import React, { useEffect, useState } from 'react';
import { Users, Calendar, FileText, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatDateTime } from '../utils/helpers';

interface Stats {
    totalPatients: number;
    todayAppointments: number;
    totalAppointments: number;
    totalMedicalRecords: number;
}

interface RecentAppointment {
    id: string;
    date: string;
    status: string;
    patient: {
        name: string;
    };
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color} text-white`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
    </div>
);

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<Stats>({
        totalPatients: 0,
        todayAppointments: 0,
        totalAppointments: 0,
        totalMedicalRecords: 0,
    });
    const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);

    useEffect(() => {
        loadStats();
        loadRecentAppointments();
    }, []);

    const loadStats = async () => {
        try {
            const [patientsRes, appointmentsRes, medicalRecordsRes] = await Promise.all([
                api.get('/patients'),
                api.get('/appointments'),
                api.get('/medical-records'),
            ]);

            const today = new Date().toDateString();
            const todayAppts = appointmentsRes.data.filter((apt: any) =>
                new Date(apt.date).toDateString() === today
            );

            setStats({
                totalPatients: patientsRes.data.length,
                todayAppointments: todayAppts.length,
                totalAppointments: appointmentsRes.data.length,
                totalMedicalRecords: medicalRecordsRes.data.length,
            });
        } catch (err) {
            console.error('Error loading stats:', err);
        }
    };

    const loadRecentAppointments = async () => {
        try {
            const { data } = await api.get('/appointments');
            const { user } = useAuth();

            let filtered = data;

            // Filter based on user role
            if (user?.role === 'DENTIST') {
                // Dentists see only their appointments
                filtered = data.filter((apt: any) => apt.dentistId === user.id);
            } else if (user?.role === 'SECRETARY') {
                // Secretaries see AWAITING_RECEPTION, SCHEDULED, and IN_PROGRESS
                filtered = data.filter((apt: any) =>
                    apt.status === 'AWAITING_RECEPTION' ||
                    apt.status === 'SCHEDULED' ||
                    apt.status === 'IN_PROGRESS'
                );
            }
            // ADMIN sees all appointments (no filter)

            const sorted = filtered
                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5);
            setRecentAppointments(sorted);
        } catch (err) {
            console.error('Error loading recent appointments:', err);
        }
    };

    const getStatusColor = (status: string) => {
        const colors = {
            AWAITING_RECEPTION: 'bg-yellow-100 text-yellow-700',
            SCHEDULED: 'bg-blue-100 text-blue-700',
            IN_PROGRESS: 'bg-purple-100 text-purple-700',
            CONFIRMED: 'bg-green-100 text-green-700',
            COMPLETED: 'bg-gray-100 text-gray-700',
            CANCELED: 'bg-red-100 text-red-700',
            NO_SHOW: 'bg-orange-100 text-orange-700',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
    };

    const getStatusLabel = (status: string) => {
        const labels = {
            AWAITING_RECEPTION: 'Aguardando Recepção',
            SCHEDULED: 'Agendado',
            IN_PROGRESS: 'Em Atendimento',
            CONFIRMED: 'Confirmado',
            COMPLETED: 'Concluído',
            CANCELED: 'Cancelado',
            NO_SHOW: 'Faltou',
        };
        return labels[status as keyof typeof labels] || status;
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-slate-500">Visão geral da clínica</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total de Pacientes"
                    value={stats.totalPatients.toString()}
                    icon={<Users size={24} />}
                    color="bg-primary"
                />
                <StatCard
                    title="Agendamentos Hoje"
                    value={stats.todayAppointments.toString()}
                    icon={<Calendar size={24} />}
                    color="bg-accent"
                />
                <StatCard
                    title="Total Agendamentos"
                    value={stats.totalAppointments.toString()}
                    icon={<Activity size={24} />}
                    color="bg-secondary"
                />
                <StatCard
                    title="Prontuários"
                    value={stats.totalMedicalRecords.toString()}
                    icon={<FileText size={24} />}
                    color="bg-teal-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold mb-4">Agendamentos Recentes</h3>
                    <div className="space-y-4">
                        {recentAppointments.length === 0 ? (
                            <p className="text-center text-slate-500 py-4">Nenhum agendamento encontrado</p>
                        ) : (
                            recentAppointments.map((appointment) => (
                                <div key={appointment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white">
                                            {appointment.patient.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">{appointment.patient.name}</p>
                                            <p className="text-sm text-slate-500">{formatDateTime(appointment.date)}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                                        {getStatusLabel(appointment.status)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/patients')}
                            className="p-4 border border-dashed border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-all flex flex-col items-center gap-2"
                        >
                            <Users size={24} />
                            <span>Novo Paciente</span>
                        </button>
                        <button
                            onClick={() => navigate('/appointments')}
                            className="p-4 border border-dashed border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-all flex flex-col items-center gap-2"
                        >
                            <Calendar size={24} />
                            <span>Novo Agendamento</span>
                        </button>
                        <button
                            onClick={() => navigate('/medical-records')}
                            className="p-4 border border-dashed border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-all flex flex-col items-center gap-2"
                        >
                            <FileText size={24} />
                            <span>Novo Prontuário</span>
                        </button>
                        <button
                            onClick={() => navigate('/patients')}
                            className="p-4 border border-dashed border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-all flex flex-col items-center gap-2"
                        >
                            <Activity size={24} />
                            <span>Ver Pacientes</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
