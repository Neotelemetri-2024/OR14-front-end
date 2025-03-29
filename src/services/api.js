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

        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => Promise.reject(error)
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

    async resendVerification(email) {
        try {
            const response = await fetch(`${api.defaults.baseURL}/resend-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            return {
                success: data.status === 'success',
                message: data.message,
                data: data.data || null
            };
        } catch (error) {
            console.error('Error resending verification email:', error);
            return {
                success: false,
                message: 'Terjadi kesalahan. Silakan coba lagi.',
                data: null
            };
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            console.log("Login response:", response.data);

            // Simpan token di localStorage
            if (response.data.data.token) {
                localStorage.setItem('token', response.data.data.token);
            }

            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error("Login error:", error.response || error);
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
            console.error("Logout error:", error);
            // Tetap hapus token lokal meskipun ada error
            localStorage.removeItem('token');
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
            console.log("getCurrentUser response:", response.data);

            // Jika user tidak memiliki role, cek apakah perlu ditambahkan role
            const userData = response.data.data;

            // UNCOMMENT KODE INI UNTUK TESTING ADMIN ROLE (DEVELOPMENT ONLY)
            /*
            if (userData && !userData.role) {
                // Untuk testing, tambahkan role admin ke user tertentu
                // Gunakan email spesifik atau kondisi lain untuk membatasi siapa yang mendapat role admin
                if (userData.email === 'admin@example.com') {
                    userData.role = 'admin';
                    console.log("Added admin role for testing purposes");
                }
            }
            */

            return {
                success: true,
                data: userData
            };
        } catch (error) {
            console.error("Get current user error:", error.response || error);
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
    },

    // Cek apakah user memiliki role admin
    checkIsAdmin: async () => {
        try {
            const response = await api.get('/user');
            const user = response.data.data;
            return {
                success: true,
                isAdmin: user && user.role === 'admin'
            };
        } catch (error) {
            console.error("Check admin role error:", error);
            return {
                success: false,
                isAdmin: false
            };
        }
    }
};

// Admin service functions
export const adminService = {
    // Get dashboard statistics
    getDashboardStats: async () => {
        try {
            const response = await api.get('/admin/dashboard/stats');
            return { success: true, data: response.data.data };
        } catch (error) {
            console.error("Get admin stats error:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal mendapatkan statistik dashboard'
            };
        }
    },

    // Get all users
    getUsers: async (page = 1, filters = {}) => {
        try {
            const response = await api.get('/admin/users', {
                params: { page, ...filters }
            });
            return { success: true, data: response.data.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal mendapatkan daftar pengguna'
            };
        }
    },

    // Get user detail
    getUserDetail: async (userId) => {
        try {
            const response = await api.get(`/admin/users/${userId}`);
            return { success: true, data: response.data.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal mendapatkan detail pengguna'
            };
        }
    },

    // Update user
    updateUser: async (userId, userData) => {
        try {
            const response = await api.put(`/admin/users/${userId}`, userData);
            return { success: true, data: response.data.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal memperbarui pengguna'
            };
        }
    },

    // Delete user
    deleteUser: async (userId) => {
        try {
            await api.delete(`/admin/users/${userId}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal menghapus pengguna'
            };
        }
    },

    // Get all exams
    getExams: async (page = 1, filters = {}) => {
        try {
            const response = await api.get('/admin/exams', {
                params: { page, ...filters }
            });
            return { success: true, data: response.data.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal mendapatkan daftar ujian'
            };
        }
    },

    // Get pending verifications
    getPendingVerifications: async (page = 1) => {
        try {
            const response = await api.get('/admin/verifications/pending', {
                params: { page }
            });
            return { success: true, data: response.data.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal mendapatkan daftar verifikasi tertunda'
            };
        }
    },

    // Approve or reject verification
    processVerification: async (verificationId, status, notes = '') => {
        try {
            const response = await api.post(`/admin/verifications/${verificationId}/process`, {
                status, // 'approved' or 'rejected'
                notes
            });
            return { success: true, data: response.data.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Gagal memproses verifikasi'
            };
        }
    }
};

export default api;