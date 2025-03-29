import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Komponen untuk mengarahkan pengguna ke halaman yang sesuai berdasarkan role
 */
const RoleBasedRedirect = () => {
    const { user, authenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Fungsi untuk mengarahkan pengguna
        const redirectUser = () => {
            if (!loading) {
                if (!authenticated) {
                    console.log("User not authenticated, redirecting to login");
                    navigate("/auth", { replace: true });
                } else if (user && user.role === 'admin') {
                    console.log("User is admin, redirecting to admin dashboard");
                    navigate("/admin/dashboard", { replace: true });
                } else {
                    console.log("User is regular user, redirecting to dashboard");
                    navigate("/dashboard", { replace: true });
                }
            }
        };

        redirectUser();
    }, [loading, authenticated, user, navigate]);

    // Tampilkan indikator loading selama proses pengecekan
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-600">Memeriksa status login...</p>
            </div>
        );
    }

    // Jika tidak dalam loading state, tampilkan fallback
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Mengarahkan ke halaman yang sesuai...</p>
        </div>
    );
};

export default RoleBasedRedirect;