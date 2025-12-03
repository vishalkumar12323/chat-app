import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    user: null,
    token: sessionStorage.getItem('token'),
    isAuthenticated: !!sessionStorage.getItem('token'),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            sessionStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
            throw error;
        }
    },

    register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/register', { username, email, password });
            const { token, user } = response.data;
            sessionStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
            throw error;
        }
    },

    logout: () => {
        sessionStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        const token = sessionStorage.getItem('token');
        if (!token) return;
        try {
            const response = await api.get('/auth/me');
            set({ user: response.data, isAuthenticated: true });
        } catch (error) {
            sessionStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
        }
    },
}));

export default useAuthStore;
