import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Calendar, FileText, LogOut, Shield } from 'lucide-react';

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
        return `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(path)
            ? 'bg-[var(--color-accent)] text-white'
            : 'text-slate-300 hover:bg-[var(--color-secondary)]'
            }`;
    };

    return (
        <div className="flex h-screen bg-[var(--color-background)]">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--color-primary)] text-white flex flex-col">
                <div className="p-6 border-b border-slate-700">
                    <h1 className="text-xl font-bold">Clínica Odontológica</h1>
                    <p className="text-xs text-slate-400">Premium Care</p>
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
                    <Link to="/medical-records" className={getLinkClasses('/medical-records')}>
                        <FileText size={20} />
                        <span>Prontuários</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                        <Link to="/admin" className={getLinkClasses('/admin')}>
                            <Shield size={20} />
                            <span>Administração</span>
                        </Link>
                    )}
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <div className="flex items-center gap-3 px-4 py-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={signOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
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
