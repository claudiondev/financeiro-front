import axios from 'axios';

const api = axios.create({
    // Ele tenta ler a variável do arquivo .env, se não achar, usa o localhost como reserva
    baseURL: process.env.REACT_APP_API_URL || 'https://financeiro-production-e0e0.up.railway.app', 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;