import React, { useEffect, useState } from 'react';
import { Calendar, Phone, Mail, User, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

interface AppointmentRequest {
    id: string;
    name: string;
    phone: string;
    email?: string;
    preferredDate: string;
    reason?: string;
    status: string;
    createdAt: string;
}

const STATUSES = [
    { value: 'PENDING', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'APPROVED', label: 'Aprovado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'REJECTED', label: 'Rejeitado', color: 'bg-red-100 text-red-800', icon: XCircle }
];

export const AppointmentRequests: React.FC = () => {
    const [requests, setRequests] = useState<AppointmentRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const { data } = await api.get('/public/appointment-requests');
            setRequests(data);
        } catch (err) {
            console.error('Error loading requests:', err);
            toast.error('Erro ao carregar solicitações');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await api.put(`/public/appointment-requests/${id}/status`, { status });
            toast.success(`Solicitação ${status === 'APPROVED' ? 'aprovada' : 'rejeitada'} com sucesso`);
            loadRequests();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Erro ao atualizar status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar esta solicitação?')) return;

        try {
            await api.delete(`/public/appointment-requests/${id}`);
            toast.success('Solicitação deletada com sucesso');
            loadRequests();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Erro ao deletar solicitação');
        }
    };

    const getStatusInfo = (status: string) => {
        return STATUSES.find(s => s.value === status) || STATUSES[0];
    };

    const formatDateTime = (date: string) => {
        return new Date(date).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPhone = (phone: string) => {
        const numbers = phone.replace(/\D/g, '');
        if (numbers.length === 11) {
            return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-500">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Solicitações de Agendamento</h1>
                <p className="text-slate-500">Gerencie as solicitações recebidas via página pública</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <div className="flex items-center gap-3">
                        <Clock size={24} className="text-yellow-600" />
                        <div>
                            <p className="text-sm text-yellow-700">Pendentes</p>
                            <h3 className="text-2xl font-bold text-yellow-800">
                                {requests.filter(r => r.status === 'PENDING').length}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                        <CheckCircle size={24} className="text-green-600" />
                        <div>
                            <p className="text-sm text-green-700">Aprovadas</p>
                            <h3 className="text-2xl font-bold text-green-800">
                                {requests.filter(r => r.status === 'APPROVED').length}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                    <div className="flex items-center gap-3">
                        <XCircle size={24} className="text-red-600" />
                        <div>
                            <p className="text-sm text-red-700">Rejeitadas</p>
                            <h3 className="text-2xl font-bold text-red-800">
                                {requests.filter(r => r.status === 'REJECTED').length}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {requests.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        Nenhuma solicitação encontrada.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {requests.map((request) => {
                            const statusInfo = getStatusInfo(request.status);
                            const StatusIcon = statusInfo.icon;

                            return (
                                <div key={request.id} className="p-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                                                    <User size={20} className="text-teal-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800">{request.name}</h3>
                                                    <p className="text-sm text-slate-500">
                                                        Solicitado em {formatDateTime(request.createdAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-13">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Phone size={16} className="text-slate-400" />
                                                    <span>{formatPhone(request.phone)}</span>
                                                </div>

                                                {request.email && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Mail size={16} className="text-slate-400" />
                                                        <span>{request.email}</span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Calendar size={16} className="text-slate-400" />
                                                    <span>Preferência: {formatDateTime(request.preferredDate)}</span>
                                                </div>
                                            </div>

                                            {request.reason && (
                                                <div className="ml-13 p-3 bg-slate-50 rounded-lg">
                                                    <p className="text-sm text-slate-700">
                                                        <strong>Motivo:</strong> {request.reason}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-end gap-3">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${statusInfo.color}`}>
                                                <StatusIcon size={14} />
                                                {statusInfo.label}
                                            </span>

                                            {request.status === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(request.id, 'APPROVED')}
                                                        className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                    >
                                                        Aprovar
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(request.id, 'REJECTED')}
                                                        className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        Rejeitar
                                                    </button>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => handleDelete(request.id)}
                                                className="text-xs text-red-600 hover:text-red-800"
                                            >
                                                Deletar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
