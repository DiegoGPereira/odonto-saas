import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
    (config) => {
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
            // Não redirecionar se for erro no próprio login
            if (error.config.url?.includes('/auth/login')) {
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
