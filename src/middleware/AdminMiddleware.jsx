import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

/**
 * AdminRoute - Protected route that checks if user is logged in AND has admin role
 * If not, redirects to appropriate page
 */
const AdminRoute = () => {
    const { user, authenticated, loading } = useAuth();
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(false);
    const [checkingRole, setCheckingRole] = useState(true);

    useEffect(() => {
        const checkAdminRole = async () => {
            if (!loading && authenticated && user) {
                console.log("Checking admin role for user:", user);
                // Assuming user object has a role property
                const hasAdminRole = user.role === 'admin';
                setIsAdmin(hasAdminRole);
                console.log("User is admin:", hasAdminRole);

                // Jika ternyata bukan admin, redirect dengan hard refresh untuk menghindari masalah cache
                if (!hasAdminRole) {
                    console.log("Not admin, redirecting to regular dashboard");
                    window.location.href = "/dashboard";
                    return;
                }
            }
            setCheckingRole(false);
        };

        checkAdminRole();
    }, [loading, authenticated, user]);

    // Show loading while checking auth/role
    if (loading || checkingRole) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!authenticated) {
        console.log("User not authenticated, redirecting to login");
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // If authenticated but not admin, redirect to regular dashboard
    if (!isAdmin) {
        console.log("User is not admin, redirecting to dashboard");
        return <Navigate to="/dashboard" replace />;
    }

    console.log("User is admin, rendering admin content");
    // User is authenticated and has admin role
    return <Outlet />;
};

export default AdminRoute;