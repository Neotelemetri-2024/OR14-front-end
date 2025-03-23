import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute - Middleware untuk rute yang memerlukan autentikasi
 * Redirect ke halaman login jika pengguna belum login
 */
export const ProtectedRoute = () => {
    const { authenticated, loading } = useAuth();
    const location = useLocation();

    // Tampilkan loading spinner selama proses pengecekan autentikasi
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Jika tidak terautentikasi, alihkan ke login
    if (!authenticated) {
        console.log("User not authenticated, redirecting to login");
        return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
    }

    console.log("User authenticated, rendering protected content");
    return <Outlet />;
};

/**
 * GuestRoute - Middleware untuk rute yang hanya bisa diakses oleh tamu (belum login)
 * Redirect ke dashboard jika pengguna sudah login
 */
export const GuestRoute = () => {
    const { authenticated, loading } = useAuth();
    const location = useLocation();

    const from = location.state?.from || "/dashboard";

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (authenticated) {
        console.log("User already authenticated, redirecting to:", from);
        return <Navigate to={from} replace />;
    }

    console.log("User is guest, rendering guest content");
    return <Outlet />;
};