import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Odontogram } from '../components/Odontogram';
import toast from 'react-hot-toast';
import api from '../services/api';
import { validateCPF, maskCPF, maskPhone } from '../utils/helpers';

interface Patient {
    id: string;
    name: string;
    cpf: string;
    phone: string;
    email: string | null;
    address: string | null;
    birthDate: string;
}

interface PatientFormData {
    name: string;
    cpf: string;
    phone: string;
    email: string;
    address: string;
    birthDate: string;
}

export const Patients: React.FC = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [isOdontogramOpen, setIsOdontogramOpen] = useState(false);
    const [selectedPatientForOdontogram, setSelectedPatientForOdontogram] = useState<Patient | null>(null);
    const [formData, setFormData] = useState<PatientFormData>({
        name: '',
        cpf: '',
        phone: '',
        email: '',
        address: '',
        birthDate: '',
    });

    useEffect(() => {
        loadPatients();
    }, []);

    useEffect(() => {
        const filtered = patients.filter(patient =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.cpf.includes(searchTerm) ||
            patient.phone.includes(searchTerm)
        );
        setFilteredPatients(filtered);
        setCurrentPage(1);
    }, [searchTerm, patients]);

    const loadPatients = async () => {
        try {
            const { data } = await api.get('/patients');
            setPatients(data);
        } catch (err) {
            toast.error('Erro ao carregar pacientes');
            console.error('Error loading patients:', err);
        }
    };

    const handleOpenModal = (patient?: Patient) => {
        if (patient) {
            setEditingPatient(patient);
            setFormData({
                name: patient.name,
                cpf: patient.cpf,
                phone: patient.phone,
                email: patient.email || '',
                address: patient.address || '',
                birthDate: patient.birthDate.split('T')[0],
            });
        } else {
            setEditingPatient(null);
            setFormData({
                name: '',
                cpf: '',
                phone: '',
                email: '',
                address: '',
                birthDate: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPatient(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar CPF
        if (!validateCPF(formData.cpf)) {
            toast.error('CPF inválido');
            return;
        }

        try {
            if (editingPatient) {
                await api.put(`/patients/${editingPatient.id}`, formData);
                toast.success('Paciente atualizado com sucesso');
            } else {
                await api.post('/patients', formData);
                toast.success('Paciente adicionado com sucesso');
            }
            loadPatients();
            handleCloseModal();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Erro ao salvar paciente');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar este paciente?')) return;
        try {
            await api.delete(`/patients/${id}`);
            toast.success('Paciente deletado com sucesso');
            loadPatients();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Erro ao deletar paciente');
        }
    };

    // Paginação
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Pacientes</h1>
                    <p className="text-slate-500">Gerencie os registros de pacientes</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors shadow-md"
                >
                    <Plus size={20} />
                    <span>Adicionar Paciente</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar pacientes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4 font-medium">Nome</th>
                            <th className="px-6 py-4 font-medium">CPF</th>
                            <th className="px-6 py-4 font-medium">Contato</th>
                            <th className="px-6 py-4 font-medium text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {currentPatients.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                    Nenhum paciente encontrado.
                                </td>
                            </tr>
                        ) : (
                            currentPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800">{patient.name}</div>
                                        <div className="text-sm text-slate-400">{patient.email || 'Sem email'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{maskCPF(patient.cpf)}</td>
                                    <td className="px-6 py-4 text-slate-600">{maskPhone(patient.phone)}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => navigate(`/medical-records?patientId=${patient.id}`)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Prontuários"
                                        >
                                            <FileText size={18} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedPatientForOdontogram(patient);
                                                setIsOdontogramOpen(true);
                                            }}
                                            className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                            title="Odontograma"
                                        >
                                            <span className="text-xl">🦷</span>
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal(patient)}
                                            className="p-2 text-slate-400 hover:text-[var(--color-accent)] hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(patient.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Paginação */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                        <div className="text-sm text-slate-500">
                            Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredPatients.length)} de {filteredPatients.length} pacientes
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded-lg ${currentPage === i + 1
                                        ? 'bg-[var(--color-accent)] text-white'
                                        : 'border border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingPatient ? 'Editar Paciente' : 'Adicionar Paciente'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">CPF *</label>
                                    <input
                                        type="text"
                                        required
                                        value={maskCPF(formData.cpf)}
                                        onChange={(e) => setFormData({ ...formData, cpf: e.target.value.replace(/\D/g, '') })}
                                        maxLength={14}
                                        placeholder="000.000.000-00"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefone *</label>
                                    <input
                                        type="tel"
                                        required
                                        value={maskPhone(formData.phone)}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                                        maxLength={15}
                                        placeholder="(00) 00000-0000"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Data de Nascimento *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.birthDate}
                                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    />
                                </div>
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
                                    {editingPatient ? 'Salvar Alterações' : 'Adicionar Paciente'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Odontogram Modal */}
            {isOdontogramOpen && selectedPatientForOdontogram && createPortal(
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Odontograma</h2>
                                <p className="text-slate-500">{selectedPatientForOdontogram.name}</p>
                            </div>
                            <button
                                onClick={() => setIsOdontogramOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <Odontogram patientId={selectedPatientForOdontogram.id} />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
