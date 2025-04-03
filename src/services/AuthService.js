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

// Interceptor untuk handling response
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle token expiration
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        return response.data.data; // Berdasarkan struktur ResponseHelper di backend
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 'Terjadi kesalahan saat login'
        );
    }
};

export const registerUser = async (name, email, password, password_confirmation) => {
    try {
        const response = await api.post('/register', {
            name,
            email,
            password,
            password_confirmation
        });
        return response.data; // Berdasarkan struktur ResponseHelper di backend
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 'Terjadi kesalahan saat registrasi'
        );
    }
};

export const getUserProfile = async () => {
    try {
        const response = await api.get('/user');
        return response.data.data; // Berdasarkan struktur ResponseHelper di backend
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 'Gagal mengambil data profil'
        );
    }
};

export const logoutUser = async () => {
    try {
        const response = await api.get('/logout');
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 'Terjadi kesalahan saat logout'
        );
    }
};



export const sendResetPasswordLink = async (email) => {
    try {
        const response = await api.post('/forgot-password', { email });
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 'Gagal mengirim link reset password'
        );
    }
};

export const resetPassword = async (email, token, password, password_confirmation) => {
    try {
        const response = await api.post('/reset-password', {
            email,
            token,
            password,
            password_confirmation
        });
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 'Gagal melakukan reset password'
        );
    }
};

export default api;