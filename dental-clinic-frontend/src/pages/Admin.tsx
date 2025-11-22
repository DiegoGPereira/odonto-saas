import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'DENTIST' | 'SECRETARY';
    createdAt: string;
    updatedAt: string;
}

interface UserFormData {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'DENTIST' | 'SECRETARY';
}

export const Admin: React.FC = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        password: '',
        role: 'DENTIST',
    });

    // Redirect if not admin
    if (user?.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        let filtered = users;

        if (roleFilter !== 'ALL') {
            filtered = filtered.filter(u => u.role === roleFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(u =>
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredUsers(filtered);
    }, [searchTerm, roleFilter, users]);

    const loadUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Erro ao carregar usuários');
        }
    };

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                password: '',
                role: user.role,
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'DENTIST',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingUser) {
                const updateData: any = {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                };

                // Only include password if it was changed
                if (formData.password) {
                    updateData.password = formData.password;
                }

                await api.put(`/users/${editingUser.id}`, updateData);
                toast.success('Usuário atualizado com sucesso');
            } else {
                await api.post('/users', formData);
                toast.success('Usuário criado com sucesso');
            }
            loadUsers();
            handleCloseModal();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Erro ao salvar usuário');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar este usuário?')) return;

        try {
            await api.delete(`/users/${id}`);
            toast.success('Usuário deletado com sucesso');
            loadUsers();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Erro ao deletar usuário');
        }
    };

    const getRoleBadgeColor = (role: string) => {
        const colors = {
            ADMIN: 'bg-purple-100 text-purple-800',
            DENTIST: 'bg-blue-100 text-blue-800',
            SECRETARY: 'bg-green-100 text-green-800',
        };
        return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getRoleLabel = (role: string) => {
        const labels = {
            ADMIN: 'Administrador',
            DENTIST: 'Dentista',
            SECRETARY: 'Secretário(a)',
        };
        return labels[role as keyof typeof labels] || role;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Shield size={28} className="text-purple-600" />
                        Administração
                    </h1>
                    <p className="text-slate-500">Gerencie usuários e permissões do sistema</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors shadow-md"
                >
                    <Plus size={20} />
                    <span>Adicionar Usuário</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar usuários..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setRoleFilter('ALL')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${roleFilter === 'ALL'
                                    ? 'bg-[var(--color-accent)] text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setRoleFilter('ADMIN')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${roleFilter === 'ADMIN'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            Administradores
                        </button>
                        <button
                            onClick={() => setRoleFilter('DENTIST')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${roleFilter === 'DENTIST'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            Dentistas
                        </button>
                        <button
                            onClick={() => setRoleFilter('SECRETARY')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${roleFilter === 'SECRETARY'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            Secretários
                        </button>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4 font-medium">Nome</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium">Função</th>
                            <th className="px-6 py-4 font-medium text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                    Nenhum usuário encontrado.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800">{u.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(u.role)}`}>
                                            {getRoleLabel(u.role)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(u)}
                                            className="p-2 text-slate-400 hover:text-[var(--color-accent)] hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            disabled={u.id === user?.id}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={u.id === user?.id ? 'Você não pode deletar sua própria conta' : ''}
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
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingUser ? 'Editar Usuário' : 'Adicionar Usuário'}
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
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Senha {editingUser ? '(deixe em branco para manter a atual)' : '*'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingUser}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    placeholder={editingUser ? 'Digite para alterar' : ''}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Função *</label>
                                <select
                                    required
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                >
                                    <option value="DENTIST">Dentista</option>
                                    <option value="ADMIN">Administrador</option>
                                    <option value="SECRETARY">Secretário(a)</option>
                                </select>
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
                                    {editingUser ? 'Salvar Alterações' : 'Adicionar Usuário'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
