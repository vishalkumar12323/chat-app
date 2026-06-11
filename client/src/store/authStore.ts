import { create } from 'zustand';
import api from '../services/api';
import type { AuthState } from '../types';
import type { AxiosError } from 'axios';

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: sessionStorage.getItem('token'),
    isAuthenticated: !!sessionStorage.getItem('token'),
    isLoading: false,
    error: null,

    login: async (email: string, password: string): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            sessionStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            set({ error: axiosError.response?.data?.message || 'Login failed', isLoading: false });
            throw error;
        }
    },

    register: async (username: string, email: string, password: string): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/register', { username, email, password });
            const { token, user } = response.data;
            sessionStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            set({ error: axiosError.response?.data?.message || 'Registration failed', isLoading: false });
            throw error;
        }
    },

    logout: (): void => {
        sessionStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    checkAuth: async (): Promise<void> => {
        const token = sessionStorage.getItem('token');
        if (!token) return;
        try {
            const response = await api.get('/auth/me');
            set({ user: response.data, isAuthenticated: true });
        } catch {
            sessionStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
        }
    },
}));

export default useAuthStore;
