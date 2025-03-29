import {
    MdArrowCircleLeft,
    MdHome,
    MdInsertDriveFile,
    MdPeople,
    MdSettings,
    MdClose,
    MdMenu,
    MdVerifiedUser
} from "react-icons/md";
import { useLocation, Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify"; // Atau gunakan 'sonner' jika itu yang Anda pakai

const AdminSidebar = ({ closeSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth(); // Mendapatkan fungsi logout dari context
    const currentPath = location.pathname;
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Helper function to determine if a path is active
    const isActive = (path) => {
        return currentPath.includes(path);
    };

    const baseButtonClass = "flex flex-row items-center py-3 font-bold hover:cursor-pointer transition-colors duration-200 text-lg w-full";
    const activeClass = "bg-white text-[#2d2460] font-semibold";
    const inactiveClass = "text-white hover:bg-white hover:text-[#2d2460]";

    const handleLinkClick = () => {
        if (closeSidebar) {
            closeSidebar();
        }
    };

    const toggleCollapse = () => {
        if (!isMobile) {
            setIsCollapsed(!isCollapsed);
        }
    };

    // Handle logout function
    const handleLogout = async () => {
        if (isLoggingOut) return; // Prevent multiple clicks

        setIsLoggingOut(true);
        try {
            // Call logout API
            const result = await logout();

            if (result.success) {
                toast.success("Logout berhasil!", {
                    position: "top-right",
                    autoClose: 2000,
                });

                setTimeout(() => {
                    navigate("/auth");
                }, 1000);
            } else {
                toast.error("Gagal logout. " + (result.message || "Silakan coba lagi."), {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Terjadi kesalahan saat logout", {
                position: "top-right",
                autoClose: 3000,
            });

            setTimeout(() => {
                navigate("/auth");
            }, 1000);
        } finally {
            setIsLoggingOut(false);
        }
    };

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsCollapsed(false);
            }
        };

        // Check initially
        checkIfMobile();

        // Add event listener
        window.addEventListener('resize', checkIfMobile);

        // Cleanup
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    return (
        <div className={`h-full sticky top-0 transition-all duration-300 overflow-auto bg-gradient-to-b from-[#1B054E] to-[#7449B6] flex flex-col justify-start ${isCollapsed && !isMobile ? 'w-16 md:w-20' : 'w-64 md:w-72'}`}>
            {!isMobile && (
                <button
                    onClick={toggleCollapse}
                    className={`text-white text-xl hover:bg-white/20 p-1 rounded-full z-10 ${isCollapsed ? 'absolute left-1/2 top-4 transform -translate-x-1/2' : 'absolute top-4 right-4'
                        }`}
                >
                    {isCollapsed ? <MdMenu /> : <MdClose />}
                </button>
            )}

            {(!isCollapsed || isMobile) && (
                <div className="flex justify-center items-center py-6 px-6">
                    <img src="/assets/sidebar/or14white.svg" alt="Logo" />
                </div>
            )}

            {isCollapsed && !isMobile && <div className="py-6"></div>}

            <div className="w-full flex flex-col gap-2 mt-6">
                <Link
                    to="/admin/dashboard"
                    onClick={handleLinkClick}
                    className={`${baseButtonClass} ${isActive('/admin/dashboard') ? activeClass : inactiveClass}`}
                >
                    <div className={`flex justify-center ${isCollapsed && !isMobile ? 'w-full' : 'w-8 ml-6 md:ml-10'}`}>
                        <MdHome className="text-xl md:text-2xl" />
                    </div>
                    {(!isCollapsed || isMobile) && <h2 className="ml-2">Dashboard</h2>}
                </Link>
                <Link
                    to="/admin/users"
                    onClick={handleLinkClick}
                    className={`${baseButtonClass} ${isActive('/admin/users') ? activeClass : inactiveClass}`}
                >
                    <div className={`flex justify-center ${isCollapsed && !isMobile ? 'w-full' : 'w-8 ml-6 md:ml-10'}`}>
                        <MdPeople className="text-xl md:text-2xl" />
                    </div>
                    {(!isCollapsed || isMobile) && <h2 className="ml-2">Data User</h2>}
                </Link>
                <Link
                    to="/admin/timeline"
                    onClick={handleLinkClick}
                    className={`${baseButtonClass} ${isActive('/admin/exams') ? activeClass : inactiveClass}`}
                >
                    <div className={`flex justify-center ${isCollapsed && !isMobile ? 'w-full' : 'w-8 ml-6 md:ml-10'}`}>
                        <MdInsertDriveFile className="text-xl md:text-2xl" />
                    </div>
                    {(!isCollapsed || isMobile) && <h2 className="ml-2">Timeline</h2>}
                </Link>
            </div>

            <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`${baseButtonClass} ${inactiveClass} mt-auto mb-8 ${isLoggingOut ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                <div className={`flex justify-center ${isCollapsed && !isMobile ? 'w-full' : 'w-8 ml-6 md:ml-10'}`}>
                    <MdArrowCircleLeft className={`text-xl md:text-2xl ${isLoggingOut ? 'animate-pulse' : ''}`} />
                </div>
                {(!isCollapsed || isMobile) && (
                    <h2 className="ml-2">{isLoggingOut ? "Proses Keluar..." : "Keluar"}</h2>
                )}
            </button>
        </div>
    );
};

AdminSidebar.propTypes = {
    closeSidebar: PropTypes.func
};

export default AdminSidebar;