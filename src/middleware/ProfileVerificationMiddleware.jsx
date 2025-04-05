// src/middleware/ProfileVerificationMiddleware.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import { toast } from "react-toastify";

// Middleware to check if profile is complete
export const ProfileCompletedRoute = () => {
    const { isProfileComplete, loading } = useProfile();
    const location = useLocation();

    // If still loading, show loading indicator
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E0771]"></div>
            </div>
        );
    }

    // Redirect to profile page if profile is not complete
    if (!isProfileComplete) {
        toast.error("Harap lengkapi profil Anda terlebih dahulu");
        return <Navigate to="/profile" state={{ from: location }} />;
    }

    // If profile is complete, render the nested routes
    return <Outlet />;
};

// Middleware to check if verification is approved
export const VerificationApprovedRoute = () => {
    const { isProfileComplete, verificationStatus, loading } = useProfile();
    const location = useLocation();

    // If still loading, show loading indicator
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E0771]"></div>
            </div>
        );
    }

    // Check if profile is not complete
    if (!isProfileComplete) {
        toast.error("Harap lengkapi profil Anda terlebih dahulu");
        return <Navigate to="/profile" state={{ from: location }} />;
    }

    // Periksa jika status verifikasi bukan 'disetujui'
    if (verificationStatus !== 'disetujui') {
        toast.error("Anda harus menyelesaikan verifikasi terlebih dahulu");

        if (!verificationStatus || verificationStatus === 'ditolak') {
            return <Navigate to="/verification" state={{ from: location }} />;
        }

        return <Navigate to="/dashboard" state={{ from: location }} />;
    }

    return <Outlet />;
};