import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

const AdminRoute = () => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        console.log("Checking admin role for user:", user);

        // Hanya cek admin setelah autentikasi selesai
        if (!isLoading) {
            setIsAdmin(user && user.role === 'admin');
            setIsCheckingAdmin(false);
            console.log("User is admin:", user && user.role === 'admin');
        }
    }, [user, isLoading]);

    // Tampilkan loading jika sedang cek autentikasi atau admin role
    if (isLoading || isCheckingAdmin) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-2">Memeriksa akses admin...</span>
            </div>
        );
    }

    // Jika sudah selesai cek dan user bukan admin, redirect ke dashboard
    if (!isAdmin) {
        console.log("User is not admin, redirecting to dashboard");
        return <Navigate to="/dashboard" replace />;
    }

    // Jika user adalah admin, tampilkan konten admin
    console.log("User is admin, rendering admin content");
    return <Outlet />;
};

export default AdminRoute;