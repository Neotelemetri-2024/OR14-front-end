import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

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
                const response = await authService.getCurrentUser();
                if (response.success && response.data) {
                    console.log("Auth status: User authenticated", response.data);
                    setUser(response.data);
                    setAuthenticated(true);

                    // Log jika user adalah admin
                    if (response.data.role === 'admin') {
                        console.log("User is admin");
                    }
                } else {
                    console.log("Auth check failed: Token invalid or expired");
                    localStorage.removeItem('token');
                    setAuthenticated(false);
                    setUser(null);
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

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.login({ email, password });

            // Check if token exists in response
            if (response.success && response.data && response.data.token) {
                // Set user dan authenticated state
                setUser(response.data.user);
                setAuthenticated(true);

                console.log('Login successful, user:', response.data.user);

                // Periksa jika user memiliki role admin
                if (response.data.user && response.data.user.role === 'admin') {
                    console.log('User is admin, should redirect to admin dashboard');
                }

                return { success: true, data: response.data };
            } else {
                throw new Error('Token tidak ditemukan dalam respons');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Login gagal');
            setAuthenticated(false);
            setUser(null);
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
            const response = await authService.register(userData);
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
            await authService.logout();

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

    // Check if user is admin
    const isAdmin = () => {
        return user && user.role === 'admin';
    };

    // Force refresh user data
    const refreshUserData = async () => {
        try {
            setLoading(true);
            const response = await authService.getCurrentUser();
            if (response.success && response.data) {
                setUser(response.data);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error refreshing user data:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const redirectBasedOnRole = () => {
        // Periksa apakah sudah login dan user sudah dimuat
        if (authenticated && user) {
            // Cek apakah user adalah admin
            if (user.role === 'admin') {
                console.log("Redirecting to admin dashboard based on role");
                // Gunakan window.location untuk hard refresh
                window.location.href = '/admin/dashboard';
            } else {
                console.log("Redirecting to user dashboard based on role");
                window.location.href = '/dashboard';
            }
            return true;
        }
        return false;
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
                logout,
                isAdmin,
                refreshUserData,
                redirectBasedOnRole
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;