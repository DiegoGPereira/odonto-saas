import React, { useEffect, useState } from 'react';
import { Plus, Calendar as CalendarIcon, X, Filter } from 'lucide-react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

interface Appointment {
    id: string;
    date: string;
    status: 'AWAITING_RECEPTION' | 'SCHEDULED' | 'IN_PROGRESS' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';
    notes: string | null;
    patient: {
        id: string;
        name: string;
    };
    dentist: {
        id: string;
        name: string;
    };
}

interface Patient {
    id: string;
    name: string;
}

interface AppointmentFormData {
    date: string;
    patientId: string;
    dentistId: string;
    notes: string;
}

export const Appointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [dentists, setDentists] = useState<Patient[]>([]); // Reusing Patient interface for dentists
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [formData, setFormData] = useState<AppointmentFormData>({
        date: '',
        patientId: '',
        dentistId: '',
        notes: '',
    });

    useEffect(() => {
        loadAppointments();
        loadPatients();
        loadDentists();
    }, []);

    const loadAppointments = async () => {
        try {
            const { data } = await api.get('/appointments');
            setAppointments(data);
        } catch (err) {
            console.error('Error loading appointments:', err);
        }
    };

    const loadPatients = async () => {
        try {
            const { data } = await api.get('/patients');
            setPatients(data);
        } catch (err) {
            console.error('Error loading patients:', err);
        }
    };

    const loadDentists = async () => {
        try {
            const { data } = await api.get('/users', {
                params: { role: 'DENTIST' }
            });
            setDentists(data);
        } catch (err) {
            console.error('Error loading dentists:', err);
            toast.error('Erro ao carregar lista de dentistas');
        }
    };

    const handleOpenModal = () => {
        const currentUser = JSON.parse(localStorage.getItem('@DentalClinic:user') || '{}');
        const isDentist = currentUser.role === 'DENTIST';

        setFormData({
            date: '',
            patientId: '',
            dentistId: isDentist ? currentUser.id : '',
            notes: '',
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/appointments', formData);
            loadAppointments();
            handleCloseModal();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Erro ao criar agendamento');
            console.error('Error creating appointment:', err);
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await api.patch(`/appointments/${id}/status`, { status });
            loadAppointments();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Erro ao atualizar status');
            console.error('Error updating status:', err);
        }
    };

    const getStatusColor = (status: string) => {
        const colors = {
            AWAITING_RECEPTION: 'bg-yellow-100 text-yellow-800',
            SCHEDULED: 'bg-blue-100 text-blue-800',
            IN_PROGRESS: 'bg-purple-100 text-purple-800',
            CONFIRMED: 'bg-green-100 text-green-800',
            COMPLETED: 'bg-gray-100 text-gray-800',
            CANCELED: 'bg-red-100 text-red-800',
            NO_SHOW: 'bg-orange-100 text-orange-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const filteredAppointments = statusFilter === 'ALL'
        ? appointments
        : appointments.filter(apt => apt.status === statusFilter);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Agendamentos</h1>
                    <p className="text-slate-500">Gerencie os agendamentos da clínica</p>
                </div>
                <button
                    onClick={handleOpenModal}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors shadow-md"
                >
                    <Plus size={20} />
                    <span>Novo Agendamento</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <Filter size={20} className="text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        >
                            <option value="ALL">Todos os Status</option>
                            <option value="SCHEDULED">Agendado</option>
                            <option value="CONFIRMED">Confirmado</option>
                            <option value="COMPLETED">Concluído</option>
                            <option value="CANCELED">Cancelado</option>
                            <option value="NO_SHOW">Faltou</option>
                        </select>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4 font-medium">Data/Hora</th>
                            <th className="px-6 py-4 font-medium">Paciente</th>
                            <th className="px-6 py-4 font-medium">Dentista</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Observações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredAppointments.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    Nenhum agendamento encontrado.
                                </td>
                            </tr>
                        ) : (
                            filteredAppointments.map((appointment) => (
                                <tr key={appointment.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon size={16} className="text-slate-400" />
                                            <span className="text-slate-800">
                                                {new Date(appointment.date).toLocaleString('pt-BR')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-800">{appointment.patient.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{appointment.dentist.name}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={appointment.status}
                                            onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                                        >
                                            <option value="AWAITING_RECEPTION">Aguardando Recepção</option>
                                            <option value="SCHEDULED">Agendado</option>
                                            <option value="IN_PROGRESS">Em Atendimento</option>
                                            <option value="CONFIRMED">Confirmado</option>
                                            <option value="COMPLETED">Concluído</option>
                                            <option value="CANCELED">Cancelado</option>
                                            <option value="NO_SHOW">Faltou</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">
                                        {appointment.notes || '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">Novo Agendamento</h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Paciente *</label>
                                <select
                                    required
                                    value={formData.patientId}
                                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                >
                                    <option value="">Selecione um paciente</option>
                                    {patients.map(patient => (
                                        <option key={patient.id} value={patient.id}>{patient.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Dentista *</label>
                                <select
                                    required
                                    value={formData.dentistId}
                                    onChange={(e) => setFormData({ ...formData, dentistId: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:bg-slate-100 disabled:text-slate-500"
                                    disabled={JSON.parse(localStorage.getItem('@DentalClinic:user') || '{}').role === 'DENTIST'}
                                >
                                    <option value="">Selecione um dentista</option>
                                    {dentists.map(dentist => (
                                        <option key={dentist.id} value={dentist.id}>{dentist.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Data e Hora *</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors"
                                >
                                    Criar Agendamento
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
