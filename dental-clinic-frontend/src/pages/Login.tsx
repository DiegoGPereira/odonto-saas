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
                if (err.response.status === 401) {
                    errorMessage = 'Email ou senha incorretos';
                } else if (err.response.status === 500) {
                    errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
                } else {
                    errorMessage = err.response.data?.error || errorMessage;
                }
            } else if (err.request) {
                errorMessage = 'Não foi possível conectar ao servidor';
            }

            setError(errorMessage);
            setPassword('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-background">
            {/* Left Side - Brand */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90"></div>

                <div className="relative z-10 text-center p-12">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-xl">
                        <Stethoscope size={48} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Odonto SaaS</h1>
                    <p className="text-teal-100 text-lg max-w-md mx-auto leading-relaxed">
                        Gestão completa e inteligente para sua clínica odontológica. Simplifique seu dia a dia.
                    </p>
                </div>

                {/* Decorative circles */}
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/40 rounded-full blur-3xl"></div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-surface">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Bem-vindo de volta</h2>
                        <p className="text-slate-500 mt-2">Por favor, insira suas credenciais para acessar.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm animate-fade-in">
                            <p className="font-medium">Erro de autenticação</p>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                placeholder="nome@clinica.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700">Senha</label>
                                <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                                    Esqueceu a senha?
                                </a>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-primary hover:bg-secondary text-white font-semibold rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'Acessar Sistema'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-slate-500 text-sm">
                            Não tem uma conta?{' '}
                            <a href="#" className="font-semibold text-primary hover:text-secondary transition-colors">
                                Entre em contato
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
