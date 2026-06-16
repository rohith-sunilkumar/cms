import axios from 'axios';

const getBaseURL = () => {
    let url = import.meta.env.VITE_API_URL;
    if (url) {
        // Automatically append /api if the user omitted it
        if (!url.endsWith('/api') && !url.endsWith('/api/')) {
            url = url.endsWith('/') ? `${url}api` : `${url}/api`;
        }
        return url;
    }
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            return '/api';
        }
    }
    return 'http://localhost:5000/api';
};

export const API_URL = getBaseURL();

const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
