import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope } from 'lucide-react';
import api from '../services/api';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/login', { email, password });

            if (!data.user || !data.token) {
                throw new Error('Resposta inválida do servidor');
            }

            signIn(data.user, data.token);
            navigate('/', { replace: true });
        } catch (err: any) {
            console.error('Login error:', err);

            let errorMessage = 'Erro ao fazer login. Tente novamente.';

            if (err.response) {
                // Erro da API
                if (err.response.status === 401) {
                    errorMessage = 'Email ou senha incorretos';
                } else if (err.response.status === 500) {
                    errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
                } else {
                    errorMessage = err.response.data?.error || errorMessage;
                }
            } else if (err.request) {
                // Sem resposta do servidor
                errorMessage = 'Não foi possível conectar ao servidor';
            }

            setError(errorMessage);
            setPassword(''); // Limpa a senha em caso de erro
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]">
            <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[var(--color-accent)] rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Stethoscope size={32} color="white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Clínica Odontológica</h1>
                    <p className="text-slate-300 mt-2">Bem-vindo de volta</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all"
                            placeholder="doctor@clinic.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};
