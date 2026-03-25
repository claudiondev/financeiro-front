import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // O endereço do seu Spring Boot
});

// Isso envia o Token de login automaticamente se ele existir
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;