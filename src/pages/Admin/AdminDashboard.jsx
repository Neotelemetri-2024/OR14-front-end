import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { MdMenu } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/api"; // Import the adminService

const AdminDashboard = () => {
    const [showSidebar, setShowSidebar] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [dashboardStats, setDashboardStats] = useState({
        totalUsers: 0,
        verifiedUsers: 0,
        unverifiedUsers: 0,
        completedExams: 0,
        totalSKJ: 0,
        totalProgramming: 0,
        totalMMD: 0,
        isLoading: true
    });

    // Validasi lagi jika user bukan admin, redirect ke dashboard
    useEffect(() => {
        if (user && user.role !== 'admin') {
            console.log("User is not admin, redirecting from AdminDashboard to dashboard");
            navigate('/dashboard');
        } else {
            // Fetch dashboard statistics
            fetchDashboardStats();
        }
    }, [user, navigate]);

    // Fetch dashboard statistics
    const fetchDashboardStats = async () => {
        try {
            // Fetch user data
            const usersResponse = await adminService.getUsers(1, { per_page: 1000 });

            if (usersResponse.success) {
                const users = usersResponse.data.data.data || [];

                // Calculate stats
                const totalUsers = users.length;
                const verifiedUsers = users.filter(user =>
                    user.verification && user.verification.verification_status.toLowerCase() === 'disetujui'
                ).length;
                const unverifiedUsers = totalUsers - verifiedUsers;

                // Count completed exams
                const completedExams = users.reduce((count, user) => {
                    return count + (user.exams ? user.exams.filter(exam => exam.status === 'completed').length : 0);
                }, 0);

                // Count divisions based on user profile divisi field
                const divisions = {
                    skj: 0,
                    programming: 0,
                    mmd: 0
                };

                users.forEach(user => {
                    if (user.profile && user.profile.divisi) {
                        const divisiLower = user.profile.divisi.toLowerCase();

                        if (divisiLower.includes('skj') || divisiLower.includes('sistem') || divisiLower.includes('komputer') || divisiLower.includes('jaringan')) {
                            divisions.skj++;
                        } else if (divisiLower.includes('program') || divisiLower.includes('coding') || divisiLower.includes('developer')) {
                            divisions.programming++;
                        } else if (divisiLower.includes('mmd') || divisiLower.includes('multimedia') || divisiLower.includes('media')) {
                            divisions.mmd++;
                        }
                    }
                });

                setDashboardStats({
                    totalUsers,
                    verifiedUsers,
                    unverifiedUsers,
                    completedExams,
                    totalSKJ: divisions.skj,
                    totalProgramming: divisions.programming,
                    totalMMD: divisions.mmd,
                    isLoading: false
                });
            }
        } catch (error) {
            console.error("Error fetching dashboard statistics:", error);
            setDashboardStats(prev => ({ ...prev, isLoading: false }));
        }
    };

    // Cek ukuran layar untuk menentukan apakah mobile atau tidak
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setShowSidebar(false);
            } else {
                setShowSidebar(true);
            }
        };

        // Cek awal
        checkIfMobile();

        // Tambahkan event listener
        window.addEventListener('resize', checkIfMobile);

        // Cleanup
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const closeSidebar = () => {
        if (isMobile) {
            setShowSidebar(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - hidden di mobile kecuali saat ditampilkan */}
            <div className={`${showSidebar ? 'block' : 'hidden'} ${isMobile ? 'fixed inset-0 z-50' : 'relative'}`}>
                {/* Overlay gelap di belakang sidebar saat mobile */}
                {isMobile && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-10"
                        onClick={closeSidebar}
                    ></div>
                )}
                {/* Sidebar component */}
                <div className={`${isMobile ? 'fixed left-0 top-0 h-full z-20' : 'relative h-full'}`}>
                    <AdminSidebar closeSidebar={closeSidebar} />
                </div>
            </div>

            {/* Main content */}
            <div className={`flex-1 flex flex-col overflow-hidden ${isMobile ? 'w-full' : ''}`}>
                {/* Top navbar */}
                <header className="bg-white shadow-sm flex items-center justify-between p-4">
                    {/* Tombol toggle sidebar */}
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none"
                    >
                        <MdMenu className="text-xl" />
                    </button>

                    <div className="text-lg font-semibold">Admin Dashboard</div>

                    <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium">{user?.name || 'Admin User'}</div>
                        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                    </div>
                </header>

                {/* Dashboard content */}
                <main className="flex-1 overflow-y-auto p-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-2xl font-semibold mb-6">Dashboard Admin</h1>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {/* Total Pendaftar */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="font-medium text-gray-500">Total Pendaftar</h3>
                                <p className="text-3xl font-bold mt-2">
                                    {dashboardStats.isLoading ? "..." : dashboardStats.totalUsers}
                                </p>
                            </div>

                            {/* Pendaftar Terverifikasi */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="font-medium text-gray-500">Terverifikasi</h3>
                                <p className="text-3xl font-bold mt-2">
                                    {dashboardStats.isLoading ? "..." : dashboardStats.verifiedUsers}
                                </p>
                            </div>

                            {/* Pendaftar Belum Terverifikasi */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="font-medium text-gray-500">Belum Terverifikasi</h3>
                                <p className="text-3xl font-bold mt-2">
                                    {dashboardStats.isLoading ? "..." : dashboardStats.unverifiedUsers}
                                </p>
                            </div>

                            {/* Ujian Selesai */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="font-medium text-gray-500">Ujian Selesai</h3>
                                <p className="text-3xl font-bold mt-2">
                                    {dashboardStats.isLoading ? "..." : dashboardStats.completedExams}
                                </p>
                            </div>
                        </div>

                        {/* Division Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Total SKJ */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="font-medium text-gray-500">Total SKJ</h3>
                                <p className="text-3xl font-bold mt-2">
                                    {dashboardStats.isLoading ? "..." : dashboardStats.totalSKJ}
                                </p>
                            </div>

                            {/* Total Programming */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="font-medium text-gray-500">Total Programming</h3>
                                <p className="text-3xl font-bold mt-2">
                                    {dashboardStats.isLoading ? "..." : dashboardStats.totalProgramming}
                                </p>
                            </div>

                            {/* Total MMD */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="font-medium text-gray-500">Total MMD</h3>
                                <p className="text-3xl font-bold mt-2">
                                    {dashboardStats.isLoading ? "..." : dashboardStats.totalMMD}
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;