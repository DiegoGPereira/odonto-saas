import React, { useEffect, useState } from 'react';
import { Plus, FileText, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

interface MedicalRecord {
    id: string;
    description: string;
    date: string;
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

interface MedicalRecordFormData {
    patientId: string;
    dentistId: string;
    description: string;
}

export const MedicalRecords: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<MedicalRecordFormData>({
        patientId: '',
        dentistId: '',
        description: '',
    });

    useEffect(() => {
        loadPatients();
    }, []);

    // Check for patientId in URL params
    useEffect(() => {
        const patientIdFromUrl = searchParams.get('patientId');
        if (patientIdFromUrl) {
            setSelectedPatient(patientIdFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        if (selectedPatient) {
            loadMedicalRecords(selectedPatient);
        } else {
            setMedicalRecords([]);
        }
    }, [selectedPatient]);

    const loadPatients = async () => {
        try {
            const { data } = await api.get('/patients');
            setPatients(data);
        } catch (err) {
            console.error('Error loading patients:', err);
        }
    };

    const loadMedicalRecords = async (patientId: string) => {
        try {
            const { data } = await api.get(`/medical-records/patient/${patientId}`);
            setMedicalRecords(data);
        } catch (err) {
            console.error('Error loading medical records:', err);
        }
    };

    const handleOpenModal = () => {
        const currentUser = JSON.parse(localStorage.getItem('@DentalClinic:user') || '{}');
        setFormData({
            patientId: selectedPatient,
            dentistId: currentUser.id || '',
            description: '',
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/medical-records', formData);
            if (selectedPatient) {
                loadMedicalRecords(selectedPatient);
            }
            handleCloseModal();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Erro ao criar prontuário');
            console.error('Error creating medical record:', err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Prontuários Médicos</h1>
                    <p className="text-slate-500">Gerencie os prontuários dos pacientes</p>
                </div>
                {selectedPatient && (
                    <button
                        onClick={handleOpenModal}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors"
                    >
                        <Plus size={20} />
                        <span>Novo Prontuário</span>
                    </button>
                )}
            </div>

            {/* Only show patient selector if no patientId in URL */}
            {!searchParams.get('patientId') && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Selecione um Paciente</label>
                    <select
                        value={selectedPatient}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    >
                        <option value="">Selecione um paciente</option>
                        {patients.map(patient => (
                            <option key={patient.id} value={patient.id}>{patient.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {selectedPatient && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-semibold text-slate-800">Histórico de Prontuários</h3>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {medicalRecords.length === 0 ? (
                            <div className="px-6 py-8 text-center text-slate-500">
                                Nenhum prontuário encontrado para este paciente.
                            </div>
                        ) : (
                            medicalRecords.map((record) => (
                                <div key={record.id} className="p-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <FileText size={24} className="text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <p className="text-sm text-slate-500">
                                                        {new Date(record.date).toLocaleDateString('pt-BR')}
                                                    </p>
                                                    <p className="text-sm text-slate-600">
                                                        Dr(a). {record.dentist.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-slate-800 whitespace-pre-wrap">{record.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">Novo Prontuário</h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Paciente</label>
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
                                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição do Atendimento *</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={8}
                                    placeholder="Descreva o atendimento, procedimentos realizados, observações..."
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
                                    Criar Prontuário
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
