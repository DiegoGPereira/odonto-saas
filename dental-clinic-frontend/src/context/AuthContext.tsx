import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'DENTIST' | 'SECRETARY';
}

interface AuthContextData {
    user: User | null;
    token: string | null;
    signIn: (user: User, token: string) => void;
    signOut: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('@DentalClinic:user');
        const storedToken = localStorage.getItem('@DentalClinic:token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            // Configurar token no axios ao carregar do localStorage
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    const signIn = (userData: User, tokenData: string) => {
        setUser(userData);
        setToken(tokenData);
        localStorage.setItem('@DentalClinic:user', JSON.stringify(userData));
        localStorage.setItem('@DentalClinic:token', tokenData);
        // Configurar token no axios
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;
    };

    const signOut = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('@DentalClinic:user');
        localStorage.removeItem('@DentalClinic:token');
        // Remover token do axios
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
