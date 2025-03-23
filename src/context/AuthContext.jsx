import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState(null);

    // Check authentication status when component mounts
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                setAuthenticated(false);
                return;
            }

            try {
                const response = await api.get('/user');
                if (response.data && response.data.data) {
                    setUser(response.data.data);
                    setAuthenticated(true);
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
                localStorage.removeItem('token');
                setAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await api.post('/login', { email, password });

            // Check if token exists in response
            if (response.data.data && response.data.data.token) {
                // Save token to localStorage
                localStorage.setItem('token', response.data.data.token);

                // Set user data and authenticated state
                setUser(response.data.data.user);
                setAuthenticated(true);

                // Log successful authentication to identify potential issues
                console.log('Login successful, authenticated:', true);

                return { success: true, data: response.data.data };
            } else {
                throw new Error('Token tidak ditemukan dalam respons');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Login gagal');
            return {
                success: false,
                message: error.response?.data?.message || 'Login gagal. Silakan periksa kredensial Anda.'
            };
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await api.post('/register', userData);
            setError(null);
            return { success: true, data: response.data };
        } catch (error) {
            setError(error.response?.data?.message || 'Registrasi gagal');
            return {
                success: false,
                message: error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.'
            };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            setLoading(true);
            await api.get('/logout');

            // Always clear local state regardless of API response
            localStorage.removeItem('token');
            setUser(null);
            setAuthenticated(false);

            console.log('Logout successful');
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);

            // Still clear token and user data on client side even if server-side logout fails
            localStorage.removeItem('token');
            setUser(null);
            setAuthenticated(false);

            return { success: false, message: 'Logout gagal di server, tetapi sesi lokal telah dihapus.' };
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                authenticated,
                error,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;