import { MdPeople, MdTimeline, MdArrowCircleLeft, MdClose, MdMenu } from "react-icons/md";
import { useLocation, Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AdminSidebarComponent = ({ closeSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
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

                // Redirect to login page after a short delay
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

            // Even if server logout fails, still clear local session and redirect
            setTimeout(() => {
                navigate("/auth");
            }, 1000);
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Add window resize event listener to check if mobile
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsCollapsed(false); // Always expanded on mobile
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
            {/* Toggle collapse button - only visible on desktop */}
            {!isMobile && (
                <button
                    onClick={toggleCollapse}
                    className={`text-white text-xl hover:bg-white/20 p-1 rounded-full z-10 ${isCollapsed ? 'absolute left-1/2 top-4 transform -translate-x-1/2' : 'absolute top-4 right-4'
                        }`}
                >
                    {isCollapsed ? <MdMenu /> : <MdClose />}
                </button>
            )}

            {/* Logo container - only visible when not collapsed */}
            {(!isCollapsed || isMobile) && (
                <div className="flex flex-col justify-center items-center py-6 px-6">
                    <img src="/assets/sidebar/or14white.svg" alt="Logo" />
                    <span className="text-white text-lg mt-2 font-semibold">Admin Panel</span>
                </div>
            )}

            {/* Add spacing when collapsed to maintain layout */}
            {isCollapsed && !isMobile && <div className="py-6"></div>}

            {/* Admin info */}
            {(!isCollapsed || isMobile) && (
                <div className="flex items-center px-6 pb-4 border-b border-white/20">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="ml-3">
                        <p className="text-white font-medium truncate">{user?.name || 'Admin'}</p>
                        <p className="text-white/70 text-xs">{user?.email || 'admin@example.com'}</p>
                    </div>
                </div>
            )}

            <div className="w-full flex flex-col gap-2 mt-6">
                <Link
                    to="/admin/peserta"
                    onClick={handleLinkClick}
                    className={`${baseButtonClass} ${isActive('/admin/peserta') ? activeClass : inactiveClass}`}
                >
                    <div className={`flex justify-center ${isCollapsed && !isMobile ? 'w-full' : 'w-8 ml-6 md:ml-10'}`}>
                        <MdPeople className="text-xl md:text-2xl" />
                    </div>
                    {(!isCollapsed || isMobile) && <h2 className="ml-2">Data Peserta</h2>}
                </Link>
                <Link
                    to="/admin/timeline"
                    onClick={handleLinkClick}
                    className={`${baseButtonClass} ${isActive('/admin/timeline') ? activeClass : inactiveClass}`}
                >
                    <div className={`flex justify-center ${isCollapsed && !isMobile ? 'w-full' : 'w-8 ml-6 md:ml-10'}`}>
                        <MdTimeline className="text-xl md:text-2xl" />
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

AdminSidebarComponent.propTypes = {
    closeSidebar: PropTypes.func
};

export default AdminSidebarComponent;