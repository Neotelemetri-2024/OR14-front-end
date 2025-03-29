import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { MdMenu } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const [showSidebar, setShowSidebar] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Validasi lagi jika user bukan admin, redirect ke dashboard
    useEffect(() => {
        if (user && user.role !== 'admin') {
            console.log("User is not admin, redirecting from AdminDashboard to dashboard");
            navigate('/dashboard');
        }
    }, [user, navigate]);

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
                        <div className="text-sm font-medium">Admin User</div>
                        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                    </div>
                </header>

                {/* Dashboard content */}
                <main className="flex-1 overflow-y-auto p-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-2xl font-semibold mb-6">Dashboard Admin</h1>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-lg font-medium mb-4">Selamat Datang di Panel Admin</h2>
                            <p className="text-gray-600">
                                Ini adalah halaman dashboard admin. Anda dapat mengelola pengguna, ujian, dan pengaturan sistem dari panel ini.
                            </p>
                        </div>

                        {/* Di sini bisa ditambahkan konten dashboard seperti statistik, grafik, dll */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="font-medium text-gray-500">Total Pengguna</h3>
                                <p className="text-3xl font-bold mt-2">0</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="font-medium text-gray-500">Ujian Aktif</h3>
                                <p className="text-3xl font-bold mt-2">0</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="font-medium text-gray-500">Menunggu Verifikasi</h3>
                                <p className="text-3xl font-bold mt-2">0</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="font-medium text-gray-500">Ujian Selesai</h3>
                                <p className="text-3xl font-bold mt-2">0</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;