import React, { useState } from 'react';
import { Calendar, Phone, Mail, User, MessageSquare, CheckCircle } from 'lucide-react';
import api from '../services/api';

export const PublicBooking: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        preferredDate: '',
        reason: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/public/appointment-request', {
                ...formData,
                preferredDate: new Date(formData.preferredDate).toISOString()
            });

            setSuccess(true);
            setFormData({
                name: '',
                phone: '',
                email: '',
                preferredDate: '',
                reason: ''
            });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao enviar solicitação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const maskPhone = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 10) {
            return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        }
        return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Solicitação Enviada!</h2>
                    <p className="text-slate-600 mb-6">
                        Recebemos sua solicitação de agendamento. Nossa equipe entrará em contato em breve para confirmar sua consulta.
                    </p>
                    <button
                        onClick={() => setSuccess(false)}
                        className="w-full px-6 py-3 bg-[#2dd4bf] text-white rounded-lg hover:bg-[#14b8a6] transition-colors font-medium"
                    >
                        Fazer Nova Solicitação
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-3">
                        Agende sua Consulta
                    </h1>
                    <p className="text-lg text-slate-600">
                        Preencha o formulário abaixo e entraremos em contato para confirmar seu horário
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                <User size={18} className="text-teal-600" />
                                Nome Completo *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                placeholder="Digite seu nome completo"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                    <Phone size={18} className="text-teal-600" />
                                    Telefone *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={maskPhone(formData.phone)}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                                    maxLength={15}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                    <Mail size={18} className="text-teal-600" />
                                    Email (opcional)
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                <Calendar size={18} className="text-teal-600" />
                                Data e Hora Preferida *
                            </label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.preferredDate}
                                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                                min={new Date().toISOString().slice(0, 16)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                <MessageSquare size={18} className="text-teal-600" />
                                Motivo da Consulta (opcional)
                            </label>
                            <textarea
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                                placeholder="Descreva brevemente o motivo da sua consulta..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all font-medium text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Enviando...' : 'Solicitar Agendamento'}
                        </button>

                        <p className="text-center text-sm text-slate-500">
                            * Campos obrigatórios
                        </p>
                    </form>
                </div>

                {/* Info Footer */}
                <div className="mt-8 text-center">
                    <p className="text-slate-600">
                        Dúvidas? Entre em contato pelo telefone{' '}
                        <a href="tel:+5511999999999" className="text-teal-600 hover:text-teal-700 font-medium">
                            (11) 99999-9999
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};
