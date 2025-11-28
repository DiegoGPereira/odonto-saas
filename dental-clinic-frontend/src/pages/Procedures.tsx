import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

interface Procedure {
    id: string;
    category: string;
    name: string;
    price: number;
}

interface ProcedureFormData {
    category: string;
    name: string;
    price: string;
}

const SUGGESTED_CATEGORIES = [
    'Limpeza',
    'Ortodontia',
    'Clareamento',
    'Restauração',
    'Extração',
    'Implante',
    'Canal',
    'Prótese',
    'Consulta'
];

export const Procedures: React.FC = () => {
    const [procedures, setProcedures] = useState<Procedure[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);
    const [formData, setFormData] = useState<ProcedureFormData>({
        category: 'PROCEDURE',
        name: '',
        price: '',
    });

    useEffect(() => {
        loadProcedures();
    }, []);

    const loadProcedures = async () => {
        try {
            const { data } = await api.get('/procedures');
            setProcedures(data);
        } catch (err) {
            console.error('Error loading procedures:', err);
            toast.error('Erro ao carregar procedimentos');
        }
    };

    const handleOpenModal = (procedure?: Procedure) => {
        if (procedure) {
            setEditingProcedure(procedure);
            setFormData({
                category: procedure.category,
                name: procedure.name,
                price: procedure.price.toString(),
            });
        } else {
            setEditingProcedure(null);
            setFormData({
                category: '',
                name: '',
                price: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProcedure(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
            };

            if (editingProcedure) {
                await api.put(`/procedures/${editingProcedure.id}`, payload);
                toast.success('Procedimento atualizado com sucesso');
            } else {
                await api.post('/procedures', payload);
                toast.success('Procedimento criado com sucesso');
            }

            loadProcedures();
            handleCloseModal();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Erro ao salvar procedimento');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar este procedimento?')) return;

        try {
            await api.delete(`/procedures/${id}`);
            toast.success('Procedimento deletado com sucesso');
            loadProcedures();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Erro ao deletar procedimento');
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const filteredProcedures = procedures.filter(proc =>
        proc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proc.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Tabela de Preços</h1>
                    <p className="text-slate-500">Gerencie os valores dos procedimentos</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors shadow-md"
                >
                    <Plus size={20} />
                    <span>Novo Procedimento</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar procedimento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4 font-medium">Nome</th>
                            <th className="px-6 py-4 font-medium">Categoria</th>
                            <th className="px-6 py-4 font-medium">Valor</th>
                            <th className="px-6 py-4 font-medium text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredProcedures.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                    Nenhum procedimento encontrado.
                                </td>
                            </tr>
                        ) : (
                            filteredProcedures.map((procedure) => (
                                <tr key={procedure.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-slate-800 font-medium">{procedure.name}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                                            {procedure.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-800 font-semibold">
                                        {formatCurrency(procedure.price)}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(procedure)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(procedure.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>
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
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingProcedure ? 'Editar Procedimento' : 'Novo Procedimento'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    placeholder="Ex: Limpeza Completa"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Categoria *</label>
                                <input
                                    type="text"
                                    required
                                    list="category-suggestions"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    placeholder="Selecione ou digite uma categoria"
                                />
                                <datalist id="category-suggestions">
                                    {SUGGESTED_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat} />
                                    ))}
                                </datalist>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    placeholder="0.00"
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
                                    {editingProcedure ? 'Salvar' : 'Criar'}
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
