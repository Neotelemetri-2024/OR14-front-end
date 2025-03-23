import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Route yang hanya bisa diakses ketika user sudah login
export const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    // Tampilkan loading spinner atau component selama proses pengecekan
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Redirect ke login jika user belum login
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// Route yang hanya bisa diakses ketika user belum login (seperti halaman login/register)
export const GuestRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Redirect ke dashboard jika user sudah login
    return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};