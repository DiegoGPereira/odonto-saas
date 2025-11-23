import React, { useEffect, useState } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown, Filter, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

interface Transaction {
    id: string;
    type: string;
    category: string;
    amount: number;
    description: string;
    date: string;
    status: string;
    patient?: { id: string; name: string };
    createdBy: { id: string; name: string };
}

interface FinancialSummary {
    income: number;
    expenses: number;
    balance: number;
    pendingIncome: number;
    totalTransactions: number;
}

interface TransactionFormData {
    type: string;
    category: string;
    amount: string;
    description: string;
    date: string;
    status: string;
    patientId: string;
}

interface Patient {
    id: string;
    name: string;
}

const TRANSACTION_TYPES = [
    { value: 'INCOME', label: 'Receita', color: 'text-green-600' },
    { value: 'EXPENSE', label: 'Despesa', color: 'text-red-600' }
];

const INCOME_CATEGORIES = [
    { value: 'CONSULTATION', label: 'Consulta' },
    { value: 'PROCEDURE', label: 'Procedimento' },
    { value: 'CLEANING', label: 'Limpeza' },
    { value: 'ORTHODONTICS', label: 'Ortodontia' },
    { value: 'OTHER', label: 'Outro' }
];

const EXPENSE_CATEGORIES = [
    { value: 'SALARY', label: 'Salário' },
    { value: 'RENT', label: 'Aluguel' },
    { value: 'SUPPLIES', label: 'Material' },
    { value: 'EQUIPMENT', label: 'Equipamento' },
    { value: 'UTILITIES', label: 'Utilidades' },
    { value: 'OTHER', label: 'Outro' }
];

const STATUSES = [
    { value: 'PENDING', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'PAID', label: 'Pago', color: 'bg-green-100 text-green-800' },
    { value: 'CANCELED', label: 'Cancelado', color: 'bg-red-100 text-red-800' }
];

export const Financial: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<FinancialSummary>({
        income: 0,
        expenses: 0,
        balance: 0,
        pendingIncome: 0,
        totalTransactions: 0
    });
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [typeFilter, setTypeFilter] = useState<string>('ALL');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [formData, setFormData] = useState<TransactionFormData>({
        type: 'INCOME',
        category: 'CONSULTATION',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        status: 'PAID',
        patientId: ''
    });

    useEffect(() => {
        loadTransactions();
        loadSummary();
        loadPatients();
    }, [typeFilter, statusFilter]);

    const loadTransactions = async () => {
        try {
            const params: any = {};
            if (typeFilter !== 'ALL') params.type = typeFilter;
            if (statusFilter !== 'ALL') params.status = statusFilter;

            const { data } = await api.get('/transactions', { params });
            setTransactions(data);
        } catch (err) {
            console.error('Error loading transactions:', err);
        }
    };

    const loadSummary = async () => {
        try {
            const { data } = await api.get('/transactions/summary');
            setSummary(data);
        } catch (err) {
            console.error('Error loading summary:', err);
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

    const handleOpenModal = (transaction?: Transaction) => {
        if (transaction) {
            setEditingTransaction(transaction);
            setFormData({
                type: transaction.type,
                category: transaction.category,
                amount: transaction.amount.toString(),
                description: transaction.description,
                date: new Date(transaction.date).toISOString().split('T')[0],
                status: transaction.status,
                patientId: transaction.patient?.id || ''
            });
        } else {
            setEditingTransaction(null);
            setFormData({
                type: 'INCOME',
                category: 'CONSULTATION',
                amount: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                status: 'PAID',
                patientId: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                amount: parseFloat(formData.amount),
                patientId: formData.patientId || undefined
            };

            if (editingTransaction) {
                await api.put(`/transactions/${editingTransaction.id}`, payload);
                toast.success('Transação atualizada com sucesso');
            } else {
                await api.post('/transactions', payload);
                toast.success('Transação criada com sucesso');
            }

            loadTransactions();
            loadSummary();
            handleCloseModal();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Erro ao salvar transação');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar esta transação?')) return;

        try {
            await api.delete(`/transactions/${id}`);
            toast.success('Transação deletada com sucesso');
            loadTransactions();
            loadSummary();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Erro ao deletar transação');
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getStatusColor = (status: string) => {
        return STATUSES.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status: string) => {
        return STATUSES.find(s => s.value === status)?.label || status;
    };

    const getCategoryLabel = (category: string, type: string) => {
        const categories = type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
        return categories.find(c => c.value === category)?.label || category;
    };

    const currentCategories = formData.type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Financeiro</h1>
                    <p className="text-slate-500">Gestão de receitas e despesas</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors shadow-md"
                >
                    <Plus size={20} />
                    <span>Nova Transação</span>
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <TrendingUp size={24} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Receitas</p>
                            <h3 className="text-xl font-bold text-green-600">{formatCurrency(summary.income)}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <TrendingDown size={24} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Despesas</p>
                            <h3 className="text-xl font-bold text-red-600">{formatCurrency(summary.expenses)}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <DollarSign size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Saldo</p>
                            <h3 className={`text-xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(summary.balance)}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <DollarSign size={24} className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">A Receber</p>
                            <h3 className="text-xl font-bold text-yellow-600">{formatCurrency(summary.pendingIncome)}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <Filter size={20} className="text-slate-400" />
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        >
                            <option value="ALL">Todos os Tipos</option>
                            <option value="INCOME">Receitas</option>
                            <option value="EXPENSE">Despesas</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        >
                            <option value="ALL">Todos os Status</option>
                            <option value="PAID">Pago</option>
                            <option value="PENDING">Pendente</option>
                            <option value="CANCELED">Cancelado</option>
                        </select>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4 font-medium">Data</th>
                            <th className="px-6 py-4 font-medium">Tipo</th>
                            <th className="px-6 py-4 font-medium">Categoria</th>
                            <th className="px-6 py-4 font-medium">Descrição</th>
                            <th className="px-6 py-4 font-medium">Paciente</th>
                            <th className="px-6 py-4 font-medium">Valor</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                                    Nenhuma transação encontrada.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-slate-800">
                                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-medium ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                            {transaction.type === 'INCOME' ? 'Receita' : 'Despesa'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {getCategoryLabel(transaction.category, transaction.type)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-800">{transaction.description}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {transaction.patient?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                            {transaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(transaction.amount)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                                            {getStatusLabel(transaction.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(transaction)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(transaction.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Deletar
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
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
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
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo *</label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            type: e.target.value,
                                            category: e.target.value === 'INCOME' ? 'CONSULTATION' : 'SALARY'
                                        })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    >
                                        {TRANSACTION_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoria *</label>
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    >
                                        {currentCategories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Valor *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Data *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                                <select
                                    required
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                >
                                    {STATUSES.map(status => (
                                        <option key={status.value} value={status.value}>{status.label}</option>
                                    ))}
                                </select>
                            </div>

                            {formData.type === 'INCOME' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Paciente (opcional)</label>
                                    <select
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
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição *</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    placeholder="Descreva a transação..."
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
                                    {editingTransaction ? 'Salvar Alterações' : 'Criar Transação'}
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
