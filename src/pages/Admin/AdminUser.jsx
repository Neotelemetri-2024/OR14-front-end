import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/api";
import AdminSidebar from "./AdminSidebar";
import { toast } from "react-toastify";
import {
    MdVerifiedUser,
    MdInfoOutline,
    MdClose,
    MdSearch,
    MdRefresh,
    MdMenu
} from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

const AdminUser = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState("approved");
    const [rejectionReason, setRejectionReason] = useState("");
    const [processingVerification, setProcessingVerification] = useState(false);
    const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");

    // Mobile responsiveness
    const [showSidebar, setShowSidebar] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Validasi lagi jika user bukan admin, redirect ke dashboard
    useEffect(() => {
        if (user && user.role !== 'admin') {
            console.log("User is not admin, redirecting to dashboard");
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

    // Fetch users
    const fetchUsers = async (page = 1, query = searchQuery, status = filterStatus) => {
        setLoading(true);
        try {
            const filters = {};
            if (query) filters.search = query;
            if (status !== "all") filters.status = status;

            console.log("Fetching users with params:", { page, filters });
            const response = await adminService.getUsers(page, filters);
            console.log("AdminUser received response:", response);

            if (response.success) {
                // Check different possible data structures
                let userData = [];
                let pagination = { current_page: 1, last_page: 1 };

                if (response.data.data?.data) {
                    // Handle nested data.data.data structure
                    userData = response.data.data.data;
                    pagination = {
                        current_page: response.data.data.current_page || 1,
                        last_page: response.data.data.last_page || 1
                    };
                } else if (Array.isArray(response.data.data)) {
                    // Handle flat data.data structure
                    userData = response.data.data;
                } else if (Array.isArray(response.data)) {
                    // Handle direct data array
                    userData = response.data;
                }

                // Normalize verification status values for consistency
                userData = userData.map(user => {
                    if (user.verification) {
                        const status = (user.verification.verification_status || '').toLowerCase().trim();

                        // Map Indonesian status to English if needed
                        if (status === 'diproses') {
                            user.verification.verification_status = 'pending';
                        } else if (status === 'disetujui') {
                            user.verification.verification_status = 'approved';
                        } else if (status === 'ditolak') {
                            user.verification.verification_status = 'rejected';
                        }
                    }
                    return user;
                });

                setUsers(userData);
                setCurrentPage(pagination.current_page);
                setTotalPages(pagination.last_page);
            } else {
                toast.error("Gagal memuat data pengguna: " + (response.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error in fetchUsers:", error);
            toast.error("Terjadi kesalahan saat memuat data");
        } finally {
            setLoading(false);
        }
    };

    // Load users on initial render
    useEffect(() => {
        fetchUsers(1);
    }, []);

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(1, searchQuery, filterStatus);
    };

    // Handle status filter change
    const handleStatusFilterChange = (e) => {
        const status = e.target.value;
        setFilterStatus(status);
        fetchUsers(1, searchQuery, status);
    };

    // Handle verification modal open
    const openVerificationModal = (user) => {
        setSelectedUser(user);
        setShowVerificationModal(true);
        setVerificationStatus("approved");
        setRejectionReason("");
    };

    // Handle user details modal open
    const openUserDetailsModal = (user) => {
        setSelectedUser(user);
        setShowUserDetailsModal(true);
    };

    // Process verification
    const processVerification = async () => {
        if (!selectedUser || !selectedUser.verification?.id) {
            toast.error("Data verifikasi tidak ditemukan");
            return;
        }

        setProcessingVerification(true);
        try {
            const verificationId = selectedUser.verification.id;
            const notes = verificationStatus === "rejected" ? rejectionReason : "";

            console.log("Processing verification:", {
                verificationId,
                status: verificationStatus,
                notes
            });

            const response = await adminService.processVerification(
                verificationId,
                verificationStatus,
                notes
            );

            console.log("Verification process response:", response);

            if (response.success) {
                toast.success(
                    `Verifikasi ${verificationStatus === "approved" ? "diterima" : "ditolak"}`
                );
                setShowVerificationModal(false);
                // Refresh user list
                fetchUsers(currentPage, searchQuery, filterStatus);
            } else {
                toast.error(`Gagal memproses verifikasi: ${response.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error processing verification:", error);
            toast.error("Terjadi kesalahan saat memproses verifikasi");
        } finally {
            setProcessingVerification(false);
        }
    };

    const getFileUrl = (path) => {
        if (!path) return null;

        // Jika path sudah berupa URL lengkap, kembalikan apa adanya
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }

        const baseUrl = 'http://localhost:8000';
        return `${baseUrl}/storage/${path.replace('public/', '')}`;
    };

    // Get status badge color
    const getStatusBadgeClass = (status) => {
        // First normalize the status value to handle case inconsistencies
        const normalizedStatus = (status || '').toLowerCase().trim();

        switch (normalizedStatus) {
            case "pending":
            case "diproses":
                return "bg-yellow-100 text-yellow-800";
            case "approved":
            case "disetujui":
                return "bg-green-100 text-green-800";
            case "rejected":
            case "ditolak":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Get profile completion status
    const getProfileCompletion = (user) => {
        if (!user.profile) return 0;

        const requiredFields = [
            'nama_lengkap',
            'panggilan',
            'nim',
            'whatsapp',
            'program_studi',
            'divisi',
            'sub_divisi'
        ];

        const filledFields = requiredFields.filter(field =>
            user.profile[field] && user.profile[field].trim() !== ''
        ).length;

        return Math.round((filledFields / requiredFields.length) * 100);
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
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top navbar */}
                <header className="bg-white shadow-sm flex items-center justify-between p-4">
                    {/* Tombol toggle sidebar */}
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none"
                    >
                        <MdMenu className="text-xl" />
                    </button>

                    <div className="text-lg font-semibold">Manajemen Pengguna</div>

                    <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium">{user?.name || 'Admin'}</div>
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                    </div>
                </header>

                {/* Main content with scrollable area */}
                <main className="flex-1 overflow-y-auto p-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h1 className="text-2xl font-bold mb-6">Data Pengguna</h1>

                            {/* Search and filters */}
                            <div className="flex flex-col md:flex-row md:justify-between mb-6 gap-4">
                                <form onSubmit={handleSearch} className="flex gap-2">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Cari pengguna..."
                                            className="border rounded-lg px-4 py-2 pl-10 w-full md:w-64"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <MdSearch className="absolute left-3 top-2.5 text-gray-400 text-xl" />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                                    >
                                        <MdSearch className="mr-1" /> Cari
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setFilterStatus("all");
                                            fetchUsers(1, "", "all");
                                        }}
                                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center"
                                    >
                                        <MdRefresh className="mr-1" /> Reset
                                    </button>
                                </form>

                                <div className="flex items-center">
                                    <label htmlFor="statusFilter" className="mr-2 whitespace-nowrap">
                                        Status Verifikasi:
                                    </label>
                                    <select
                                        id="statusFilter"
                                        className="border rounded-lg px-4 py-2"
                                        value={filterStatus}
                                        onChange={handleStatusFilterChange}
                                    >
                                        <option value="all">Semua</option>
                                        <option value="pending">Menunggu Verifikasi</option>
                                        <option value="approved">Terverifikasi</option>
                                        <option value="rejected">Ditolak</option>
                                        <option value="not_submitted">Belum Mengajukan</option>
                                    </select>
                                </div>
                            </div>

                            {/* Users table */}
                            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nama
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status Verifikasi
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kelengkapan Profil
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nilai Exam
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-10 text-center">
                                                    <div className="flex justify-center">
                                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                                    </div>
                                                    <p className="mt-2 text-gray-500">Memuat data...</p>
                                                </td>
                                            </tr>
                                        ) : users.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                                    Tidak ada data pengguna
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">
                                                            {user.profile?.nama_lengkap || user.name}
                                                        </div>
                                                        {user.profile?.nim && (
                                                            <div className="text-sm text-gray-500">{user.profile.nim}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{user.email}</div>
                                                        {user.profile?.whatsapp && (
                                                            <div className="text-sm text-gray-500">
                                                                WA: {user.profile.whatsapp}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {user.verification ? (
                                                            <span
                                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                                                                    user.verification.verification_status
                                                                )}`}
                                                            >
                                                                {user.verification.verification_status === "pending" ||
                                                                    user.verification.verification_status === "diproses"
                                                                    ? "Menunggu Verifikasi"
                                                                    : user.verification.verification_status === "approved" ||
                                                                        user.verification.verification_status === "disetujui"
                                                                        ? "Terverifikasi"
                                                                        : "Ditolak"}
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                                Belum Mengajukan
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                                <div
                                                                    className="bg-blue-600 h-2.5 rounded-full"
                                                                    style={{ width: `${getProfileCompletion(user)}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="ml-2 text-sm text-gray-500">
                                                                {getProfileCompletion(user)}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {user.exams && user.exams.length > 0 ? (
                                                            <div>
                                                                <span className="font-medium">
                                                                    {user.exams[0].score || 0}/100
                                                                </span>
                                                                <span className="text-xs text-gray-500 block">
                                                                    Divisi: {user.exams[0].division?.name || "N/A"}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500">Belum mengikuti</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => openUserDetailsModal(user)}
                                                                className="text-blue-600 hover:text-blue-900 flex items-center p-1 rounded-full hover:bg-blue-50"
                                                                title="Lihat Detail"
                                                            >
                                                                <MdInfoOutline className="text-xl" />
                                                            </button>
                                                            {user.verification &&
                                                                user.verification.verification_status === "pending" && (
                                                                    <button
                                                                        onClick={() => openVerificationModal(user)}
                                                                        className="text-indigo-600 hover:text-indigo-900 flex items-center p-1 rounded-full hover:bg-indigo-50"
                                                                        title="Verifikasi"
                                                                    >
                                                                        <MdVerifiedUser className="text-xl" />
                                                                    </button>
                                                                )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-6">
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button
                                            onClick={() => fetchUsers(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-3 py-2 rounded-l-md border ${currentPage === 1
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-white text-gray-500 hover:bg-gray-50"
                                                } text-sm font-medium`}
                                        >
                                            &laquo; Prev
                                        </button>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => fetchUsers(i + 1)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1
                                                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => fetchUsers(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`relative inline-flex items-center px-3 py-2 rounded-r-md border ${currentPage === totalPages
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-white text-gray-500 hover:bg-gray-50"
                                                } text-sm font-medium`}
                                        >
                                            Next &raquo;
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Verification Modal */}
            {showVerificationModal && selectedUser && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <MdVerifiedUser className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                            Verifikasi Dokumen User
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 mb-4">
                                                {selectedUser.profile?.nama_lengkap || selectedUser.name} (
                                                {selectedUser.email})
                                            </p>

                                            {/* Document links */}
                                            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {selectedUser.verification?.krs_path && (
                                                    <a
                                                        href={getFileUrl(selectedUser.verification.krs_path)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:bg-blue-50 p-2 rounded flex items-center"
                                                    >
                                                        <span className="mr-1">📄</span> Lihat KRS
                                                    </a>
                                                )}
                                                {selectedUser.verification?.payment_proof_path && (
                                                    <a
                                                        href={getFileUrl(selectedUser.verification.payment_proof_path)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:bg-blue-50 p-2 rounded flex items-center"
                                                    >
                                                        <span className="mr-1">💰</span> Lihat Bukti Pembayaran
                                                    </a>
                                                )}
                                                {selectedUser.verification?.neo_path && (
                                                    <a
                                                        href={getFileUrl(selectedUser.verification.neo_path)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:bg-blue-50 p-2 rounded flex items-center"
                                                    >
                                                        <span className="mr-1">📄</span> Dokumen NEO
                                                    </a>
                                                )}
                                                {selectedUser.verification?.marketing_path && (
                                                    <a
                                                        href={getFileUrl(selectedUser.verification.marketing_path)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:bg-blue-50 p-2 rounded flex items-center"
                                                    >
                                                        <span className="mr-1">📊</span> Dokumen Marketing
                                                    </a>
                                                )}
                                            </div>

                                            {/* Verification decision */}
                                            <div className="mb-4">
                                                <p className="text-sm font-medium text-gray-700 mb-2">
                                                    Status Verifikasi:
                                                </p>
                                                <div className="flex gap-4">
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="verification_status"
                                                            className="form-radio h-5 w-5 text-blue-600"
                                                            checked={verificationStatus === "approved"}
                                                            onChange={() => setVerificationStatus("approved")}
                                                        />
                                                        <span className="ml-2 text-gray-700">Terima</span>
                                                    </label>
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="verification_status"
                                                            className="form-radio h-5 w-5 text-red-600"
                                                            checked={verificationStatus === "rejected"}
                                                            onChange={() => setVerificationStatus("rejected")}
                                                        />
                                                        <span className="ml-2 text-gray-700">Tolak</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Rejection reason (only if rejected) */}
                                            {verificationStatus === "rejected" && (
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="rejection_reason"
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        Alasan Penolakan:
                                                    </label>
                                                    <textarea
                                                        id="rejection_reason"
                                                        rows="3"
                                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        placeholder="Tuliskan alasan penolakan di sini..."
                                                        value={rejectionReason}
                                                        onChange={(e) => setRejectionReason(e.target.value)}
                                                        required={verificationStatus === "rejected"}
                                                    ></textarea>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={processVerification}
                                    disabled={
                                        processingVerification ||
                                        (verificationStatus === "rejected" && !rejectionReason.trim())
                                    }
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${verificationStatus === "approved"
                                        ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                                        : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                        } ${processingVerification ||
                                            (verificationStatus === "rejected" && !rejectionReason.trim())
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                        }`}
                                >
                                    {processingVerification ? (
                                        <>
                                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                                            Memproses...
                                        </>
                                    ) : verificationStatus === "approved" ? (
                                        "Terima"
                                    ) : (
                                        "Tolak"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowVerificationModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* User Details Modal */}
            {showUserDetailsModal && selectedUser && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Detail Pengguna
                                    </h3>
                                    <button
                                        onClick={() => setShowUserDetailsModal(false)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <MdClose className="text-xl" />
                                    </button>
                                </div>

                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Basic Information */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-700 mb-2">
                                            Informasi Dasar
                                        </h4>
                                        <div className="space-y-2">
                                            <p>
                                                <span className="text-gray-500">Nama:</span>{" "}
                                                {selectedUser.profile?.nama_lengkap || selectedUser.name}
                                            </p>
                                            <p>
                                                <span className="text-gray-500">Email:</span>{" "}
                                                {selectedUser.email}
                                            </p>
                                            <p>
                                                <span className="text-gray-500">Dibuat pada:</span>{" "}
                                                {new Date(selectedUser.created_at).toLocaleDateString("id-ID")}
                                            </p>
                                            <p>
                                                <span className="text-gray-500">Email terverifikasi:</span>{" "}
                                                {selectedUser.email_verified_at ? (
                                                    <span className="text-green-600">Ya</span>
                                                ) : (
                                                    <span className="text-red-600">Tidak</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Profile Information */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-700 mb-2">
                                            Informasi Profil
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedUser.profile ? (
                                                <>
                                                    <p>
                                                        <span className="text-gray-500">NIM:</span>{" "}
                                                        {selectedUser.profile.nim || "Belum diisi"}
                                                    </p>
                                                    <p>
                                                        <span className="text-gray-500">Nama Panggilan:</span>{" "}
                                                        {selectedUser.profile.panggilan || "Belum diisi"}
                                                    </p>
                                                    <p>
                                                        <span className="text-gray-500">WhatsApp:</span>{" "}
                                                        {selectedUser.profile.whatsapp || "Belum diisi"}
                                                    </p>
                                                    <p>
                                                        <span className="text-gray-500">Program Studi:</span>{" "}
                                                        {selectedUser.profile.program_studi || "Belum diisi"}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-gray-500">Profil belum dilengkapi</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Divisi Information */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-700 mb-2">
                                            Informasi Divisi
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedUser.profile ? (
                                                <>
                                                    <p>
                                                        <span className="text-gray-500">Divisi:</span>{" "}
                                                        {selectedUser.profile.divisi || "Belum diisi"}
                                                    </p>
                                                    <p>
                                                        <span className="text-gray-500">Sub Divisi:</span>{" "}
                                                        {selectedUser.profile.sub_divisi || "Belum diisi"}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-gray-500">Divisi belum dipilih</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Verification Information */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-700 mb-2">
                                            Status Verifikasi
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedUser.verification ? (
                                                <>
                                                    <p>
                                                        <span className="text-gray-500">Status:</span>{" "}
                                                        <span
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                                                                selectedUser.verification.verification_status
                                                            )}`}
                                                        >
                                                            {selectedUser.verification.verification_status === "pending"
                                                                ? "Menunggu Verifikasi"
                                                                : selectedUser.verification.verification_status === "approved"
                                                                    ? "Terverifikasi"
                                                                    : "Ditolak"}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <span className="text-gray-500">Tanggal Pengajuan:</span>{" "}
                                                        {new Date(selectedUser.verification.created_at).toLocaleDateString("id-ID")}
                                                    </p>
                                                    {selectedUser.verification.verification_status === "rejected" && (
                                                        <p>
                                                            <span className="text-gray-500">Alasan Penolakan:</span>{" "}
                                                            {selectedUser.verification.notes || "Tidak ada catatan"}
                                                        </p>
                                                    )}
                                                    {selectedUser.verification.verification_status === "approved" && (
                                                        <p>
                                                            <span className="text-gray-500">Diverifikasi pada:</span>{" "}
                                                            {new Date(selectedUser.verification.updated_at).toLocaleDateString("id-ID")}
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-gray-500">Belum mengajukan verifikasi</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Exam Information */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-700 mb-2">
                                            Informasi Ujian
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedUser.exams && selectedUser.exams.length > 0 ? (
                                                <>
                                                    <p>
                                                        <span className="text-gray-500">Nilai:</span>{" "}
                                                        <span className="font-semibold">{selectedUser.exams[0].score || 0}/100</span>
                                                    </p>
                                                    <p>
                                                        <span className="text-gray-500">Divisi Ujian:</span>{" "}
                                                        {selectedUser.exams[0].division?.name || "N/A"}
                                                    </p>
                                                    <p>
                                                        <span className="text-gray-500">Tanggal Ujian:</span>{" "}
                                                        {new Date(selectedUser.exams[0].created_at).toLocaleDateString("id-ID")}
                                                    </p>
                                                    <p>
                                                        <span className="text-gray-500">Status:</span>{" "}
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedUser.exams[0].score >= 70
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                            }`}>
                                                            {selectedUser.exams[0].score >= 70 ? "Lulus" : "Tidak Lulus"}
                                                        </span>
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-gray-500">Belum mengikuti ujian</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Document links (if available) */}
                                    {selectedUser.verification && (
                                        <div className="bg-gray-50 p-4 rounded-lg col-span-1 md:col-span-2">
                                            <h4 className="font-medium text-gray-700 mb-2">
                                                Dokumen Verifikasi
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedUser.verification.krs_path && (
                                                    <a
                                                        href={getFileUrl(selectedUser.verification.krs_path)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:bg-blue-50 p-2 rounded flex items-center"
                                                    >
                                                        <span className="mr-2">📄</span> Lihat KRS
                                                    </a>
                                                )}
                                                {selectedUser.verification.payment_proof_path && (
                                                    <a
                                                        href={getFileUrl(selectedUser.verification.payment_proof_path)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:bg-blue-50 p-2 rounded flex items-center"
                                                    >
                                                        <span className="mr-2">💰</span> Lihat Bukti Pembayaran
                                                    </a>
                                                )}
                                                {selectedUser.verification.neo_path && (
                                                    <a
                                                        href={getFileUrl(selectedUser.verification.neo_path)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:bg-blue-50 p-2 rounded flex items-center"
                                                    >
                                                        <span className="mr-2">📄</span> Dokumen NEO
                                                    </a>
                                                )}
                                                {selectedUser.verification.marketing_path && (
                                                    <a
                                                        href={getFileUrl(selectedUser.verification.marketing_path)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:bg-blue-50 p-2 rounded flex items-center"
                                                    >
                                                        <span className="mr-2">📊</span> Dokumen Marketing
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions (if applicable) */}
                                    {selectedUser.verification && selectedUser.verification.verification_status === "pending" && (
                                        <div className="col-span-1 md:col-span-2 mt-4">
                                            <button
                                                onClick={() => {
                                                    setShowUserDetailsModal(false);
                                                    openVerificationModal(selectedUser);
                                                }}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <MdVerifiedUser className="mr-2" /> Proses Verifikasi
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={() => setShowUserDetailsModal(false)}
                                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUser;