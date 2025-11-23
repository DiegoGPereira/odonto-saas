import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

// Interceptor para adicionar token em todas as requisições (exceto públicas)
api.interceptors.request.use(
    (config) => {
        // Não adicionar token em rotas públicas
        if (config.url?.includes('/public/')) {
            return config;
        }

        const token = localStorage.getItem('@DentalClinic:token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Não redirecionar se for erro no próprio login ou em rotas públicas
            if (error.config.url?.includes('/auth/login') || error.config.url?.includes('/public/')) {
                return Promise.reject(error);
            }

            // Token inválido ou expirado
            localStorage.removeItem('@DentalClinic:token');
            localStorage.removeItem('@DentalClinic:user');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
