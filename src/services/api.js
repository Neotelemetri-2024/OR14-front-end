import axios from 'axios';

// Buat instance axios dengan baseURL
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Authentication service functions
export const authService = {
    // Register new user
    register: async (userData) => {
        try {
            const response = await api.post('/register', userData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Terjadi kesalahan saat registrasi'
            };
        }
    },

    // Login user
    login: async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            // Simpan token di localStorage
            if (response.data.data.token) {
                localStorage.setItem('token', response.data.data.token);
            }
            return { success: true, data: response.data.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login gagal. Periksa kredensial Anda.'
            };
        }
    },

    // Logout user
    logout: async () => {
        try {
            await api.get('/logout');
            localStorage.removeItem('token');
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Terjadi kesalahan saat logout'
            };
        }
    },

    // Get current user profile
    getCurrentUser: async () => {
        try {
            const response = await api.get('/user');
            return { success: true, data: response.data.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal mendapatkan data profil'
            };
        }
    },

    // Verify email with token
    verifyEmail: async (token) => {
        try {
            const response = await api.get(`/verify-email?token=${token}`);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Verifikasi email gagal'
            };
        }
    },

    // Request password reset
    forgotPassword: async (email) => {
        try {
            const response = await api.post('/forgot-password', { email });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal mengirim tautan reset password'
            };
        }
    },

    // Reset password with token
    resetPassword: async (data) => {
        try {
            const response = await api.post('/reset-password', data);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Reset password gagal'
            };
        }
    }
};

export default api;