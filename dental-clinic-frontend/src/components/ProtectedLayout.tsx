import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Calendar, LogOut, Shield, DollarSign, ClipboardList } from 'lucide-react';

export const ProtectedLayout: React.FC = () => {
    const { user, token, loading, signOut } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[var(--color-background)]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!user || !token) {
        return <Navigate to="/login" replace />;
    }

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const getLinkClasses = (path: string) => {
        return `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(path)
            ? 'bg-white/10 text-white shadow-lg border border-white/5'
            : 'text-teal-100 hover:bg-white/5 hover:text-white'
            }`;
    };

    return (
        <div className="flex h-screen bg-[var(--color-background)]">
            {/* Sidebar */}
            <aside className="w-64 bg-primary text-white flex flex-col shadow-xl z-10">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-xl font-bold tracking-tight">Clínica Odontológica</h1>
                    <p className="text-xs text-teal-200 mt-1">Premium Care</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/" className={getLinkClasses('/')}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/patients" className={getLinkClasses('/patients')}>
                        <Users size={20} />
                        <span>Pacientes</span>
                    </Link>
                    <Link to="/appointments" className={getLinkClasses('/appointments')}>
                        <Calendar size={20} />
                        <span>Agendamentos</span>
                    </Link>
                    <Link to="/financial" className={getLinkClasses('/financial')}>
                        <DollarSign size={20} />
                        <span>Financeiro</span>
                    </Link>
                    <Link to="/appointment-requests" className={getLinkClasses('/appointment-requests')}>
                        <ClipboardList size={20} />
                        <span>Solicitações</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                        <Link to="/admin" className={getLinkClasses('/admin')}>
                            <Shield size={20} />
                            <span>Administração</span>
                        </Link>
                    )}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-teal-800/50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-bold text-teal-900">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate text-white">{user.name}</p>
                            <p className="text-xs text-teal-200 truncate">{user.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={signOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-lg transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
