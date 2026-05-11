import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
    baseURL: API_URL
});

// Add interceptor for tokens if you have them
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('ems_user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default api;
