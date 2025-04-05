import { useState, useEffect } from "react";
import { IoMenu } from "react-icons/io5";
import { FaCheckCircle, FaTimesCircle, FaTrophy } from "react-icons/fa";
import SidebarComponent from "../../components/SidebarComponent";
import ProfileComponent from "../../components/ProfileComponent";
import { useNavigate, Link } from "react-router-dom";
import examService from "../../services/ExamService";
import { toast } from "react-toastify";
import { useProfile } from "../../context/ProfileContext";

const ExamPreparation = () => {
    const [divisions, setDivisions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [examStatus, setExamStatus] = useState(null);
    const [examResult, setExamResult] = useState(null);
    const [resultAnimation, setResultAnimation] = useState("initial"); // initial, congratulation, calculating, result
    const { profile } = useProfile();
    const navigate = useNavigate();

    // Animation styles for result visualization
    const animationStyles = `
        @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(1.05); }
            100% { opacity: 0.8; transform: scale(1); }
        }
        
        @keyframes float {
            0% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-10px) scale(1.02); }
            100% { transform: translateY(0) scale(1); }
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes countUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
            0% { transform: translateX(-30px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }

        .trophy-animate {
            animation: bounce 2s ease infinite, pulse 3s ease-in-out infinite alternate;
        }

        .calculating-dots:after {
            content: '...';
            animation: ellipsis 1.5s infinite;
        }

        @keyframes ellipsis {
            0% { content: '.'; }
            33% { content: '..'; }
            66% { content: '...'; }
            100% { content: '.'; }
        }

        .result-item {
            animation: slideIn 0.5s ease forwards;
            opacity: 0;
        }
        
        .result-item:nth-child(1) { animation-delay: 0.2s; }
        .result-item:nth-child(2) { animation-delay: 0.4s; }
        .result-item:nth-child(3) { animation-delay: 0.6s; }
    `;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Check exam status first
                const examStatusResponse = await examService.checkUserExamStatus();

                if (!examStatusResponse.success) {
                    toast.error("Gagal memeriksa status ujian");
                    return;
                }

                const examData = examStatusResponse.data;
                setExamStatus(examData); // Simpan status ujian di state

                // Handle ongoing exam - redirect immediately
                if (examData.exam_status === 'ongoing') {
                    navigate('/exam');
                    return;
                }

                // Handle completed exam - show results
                if (examData.exam_status === 'completed') {
                    setExamResult(examData.exam_result);
                    startResultAnimationSequence();
                    return; // Tidak perlu fetch divisions jika sudah selesai
                }

                // 2. Only fetch divisions if user hasn't taken exam
                if (!examData.has_taken_exam) {
                    const divisionsResponse = await examService.getDivisions();

                    if (!divisionsResponse.success) {
                        toast.error(divisionsResponse.message || "Gagal memuat divisi");
                        return;
                    }

                    const divisions = divisionsResponse.data.data || [];
                    setDivisions(divisions);

                    // Auto-select division from profile if available
                    if (profile?.divisi) {
                        const normalizeName = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
                        const profileDivision = normalizeName(profile.divisi);

                        const matchedDivision = divisions.find(div => {
                            const divName = normalizeName(div.name);
                            return (
                                divName === profileDivision ||
                                divName.includes(profileDivision) ||
                                profileDivision.includes(divName)
                            );
                        });

                        if (matchedDivision) {
                            setSelectedDivision(matchedDivision.id);
                        } else {
                            console.warn("Divisi profile tidak cocok:", {
                                profile: profile.divisi,
                                available: divisions.map(d => d.name)
                            });
                            toast.error("Divisi profil tidak tersedia dalam ujian");
                        }
                    } else {
                        toast.error("Silakan lengkapi divisi di profil Anda terlebih dahulu");
                    }
                }
            } catch (error) {
                console.error("Error in fetchData:", error);
                toast.error("Terjadi kesalahan saat memuat data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [profile, navigate]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex-1 flex justify-center items-center">
                    <p className="text-lg">Memuat data...</p>
                </div>
            );
        }

        if (examStatus?.exam_status === 'completed') {
            return (
                <div className="relative z-10">
                    {renderExamResultContent()}
                </div>
            );
        }

        return renderExamPreparation();
    };

    // Function to start the animation sequence for exam results
    const startResultAnimationSequence = () => {


        // First show congratulations
        setTimeout(() => {
            setResultAnimation("calculating");

            // Then show calculating animation
            setTimeout(() => {
                setResultAnimation("result");
            }, 2000); // Time for calculating animation
        }, 2000); // Time for congratulation animation
    };

    // Toggle sidebar for mobile
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Show confirmation popup
    const handleStartExamClick = (e) => {
        e.preventDefault();
        if (!selectedDivision) {
            toast.error("Anda belum memiliki divisi. Silakan lengkapi profil Anda terlebih dahulu.");
            return;
        }
        setShowConfirmation(true);
    };

    // Hide confirmation popup
    const handleCancelExam = () => {
        setShowConfirmation(false);
    };

    // Start the exam
    const handleStartExam = async () => {
        if (!selectedDivision) return;
        setLoading(true);
        const response = await examService.startExam(selectedDivision, 60);
        if (response.success) {
            toast.success("Ujian berhasil dimulai!");
            navigate('/exam');
        } else {
            toast.error(response.message);
            setShowConfirmation(false);
        }
        setLoading(false);
    };

    // Check if screen is mobile
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    // Get division name for confirmation message
    const getDivisionName = () => {
        const division = divisions.find(div => div.id === selectedDivision);
        return division ? division.name : '';
    };

    // Format date and time
    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return '-';
        const date = new Date(dateTimeStr);
        return date.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate duration between start and end time
    const calculateDuration = (startTime, endTime) => {
        if (!startTime || !endTime) return '-';
        const start = new Date(startTime);
        const end = new Date(endTime);
        const diffInMinutes = Math.floor((end - start) / (1000 * 60));
        if (diffInMinutes < 60) {
            return `${diffInMinutes} menit`;
        }
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;
        return `${hours} jam ${minutes} menit`;
    };

    // Get color based on score
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    // Render exam results animations and content
    const renderExamResultContent = () => {
        switch (resultAnimation) {

            case "calculating":
                return (
                    <div className="bg-white p-6 md:p-12 rounded-xl text-center shadow-md">
                        <div className="inline-block p-4 rounded-full bg-[#EBF2FF] mb-6">
                            <div className="w-16 h-16 border-4 border-[#1E0771] border-t-transparent rounded-full mx-auto"
                                style={{ animation: "spin 1s linear infinite" }}></div>
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-[#1E0771] mb-2">
                            <span className="calculating-dots">Menghitung hasil ujian Anda</span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-600">
                            Mohon tunggu sebentar...
                        </p>
                    </div>
                );

            case "result":
                return (
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#1E0771] mb-6">Hasil akhir ujian</h1>
                        <div className="border-2 mt-6 md:mt-8 p-4 md:p-6 rounded-xl border-secondary">
                            <h2 className="text-lg md:text-xl font-bold">
                                Ujian divisi
                            </h2>

                            {/* ExamResult */}
                            <div className="flex flex-col justify-between px-2 md:px-4 gap-6 md:gap-8 mt-6 md:mt-8">
                                {/* Benar */}
                                <div className="flex flex-row text-[#2E1461] text-xl md:text-2xl items-center justify-between result-item">
                                    <div className="flex flex-row items-center gap-3 md:gap-6">
                                        <FaCheckCircle className="text-4xl md:text-5xl text-green-600" />
                                        <h2 className="font-semibold">
                                            Benar:
                                        </h2>
                                    </div>
                                    <h2 className="text-lg md:text-xl font-bold text-[#2E1461]">
                                        {examResult?.correct_answers}
                                    </h2>
                                </div>

                                {/* Salah */}
                                <div className="flex flex-row text-[#2E1461] text-xl md:text-2xl items-center justify-between result-item">
                                    <div className="flex flex-row items-center gap-3 md:gap-6">
                                        <FaTimesCircle className="text-4xl md:text-5xl text-red-600" />
                                        <h2 className="font-semibold">
                                            Salah:
                                        </h2>
                                    </div>
                                    <h2 className="text-lg md:text-xl font-bold text-[#2E1461]">
                                        {examResult?.incorrect_answers}
                                    </h2>
                                </div>

                                {/* Nilai */}
                                <div className="flex flex-row text-[#2E1461] text-xl md:text-2xl items-center justify-between result-item">
                                    <div className="flex flex-row items-center gap-3 md:gap-6">
                                        <FaTrophy className="text-4xl md:text-5xl text-yellow-500" />
                                        <h2 className="font-semibold">
                                            Nilai:
                                        </h2>
                                    </div>
                                    <h2 className="text-lg md:text-xl font-bold text-[#2E1461]">
                                        {examResult?.score}
                                    </h2>
                                </div>
                            </div>
                        </div>


                        {/* Message based on score */}
                        <div className={`mt-6 p-4 rounded-lg ${examResult?.score >= 80 ? 'bg-green-100 text-green-800' :
                            examResult?.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                            {examResult?.score >= 80 ? (
                                <p>Selamat! Anda berhasil menyelesaikan ujian dengan nilai sangat baik.</p>
                            ) : examResult?.score >= 60 ? (
                                <p>Anda telah menyelesaikan ujian dengan nilai cukup baik.</p>
                            ) : (
                                <p>Anda telah menyelesaikan ujian. Tetap semangat dan terus belajar!</p>
                            )}
                        </div>

                        <div className="text-center text-gray-600 text-sm mt-4">
                            <p>Ujian hanya dapat dilakukan satu kali. Terima kasih telah berpartisipasi.</p>
                        </div>

                        <Link to="/dashboard">
                            <div className="w-full flex flex-col mt-8 md:mt-12">
                                <button className="border-2 w-full md:w-auto md:self-end py-3 md:py-4 px-6 rounded-lg bg-secondary text-white font-semibold hover:cursor-pointer hover:bg-white hover:text-[#2E1461] transition duration-300">
                                    Kembali ke Dashboard
                                </button>
                            </div>
                        </Link>
                    </div>
                );

            default:
                return (
                    <div className="bg-white p-6 rounded-xl shadow-md">
                    </div>
                );
        }
    };

    // Render exam preparation content
    const renderExamPreparation = () => {
        return (
            <>
                <div>
                    <h2 className="text-secondary text-xl md:text-2xl font-bold">Ujian Online OR Neo Telemetri 14</h2>
                </div>
                <div>
                    <p className="text-base md:text-lg">
                        {selectedDivision ?
                            `Anda akan mengikuti ujian untuk Divisi ${getDivisionName()}` :
                            "Memuat data divisi Anda..."}
                    </p>
                </div>
                {/* Divisions Grid - Showing only selected division and others as greyed out */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4 md:gap-6 py-4 px-2 md:px-8">
                    {loading ? (
                        <div className="col-span-full flex justify-center items-center h-48">
                            <p>Memuat divisi...</p>
                        </div>
                    ) : divisions.length > 0 ? (
                        divisions.map((division) => (
                            <div key={division.id} className="flex flex-col justify-center">
                                <div
                                    className={`border-2 ${selectedDivision === division.id
                                        ? 'border-4 border-[#2E1461] bg-[#EBF2FF]'
                                        : 'border-secondary opacity-50'} rounded-lg py-4 md:py-6 px-4 flex flex-col justify-center items-center w-full h-44 md:h-56 gap-3 md:gap-4 cursor-default`}
                                >
                                    <img
                                        src={`/assets/${division.code}.svg`}
                                        className={`w-20 h-20 md:w-28 md:h-28 object-contain ${selectedDivision !== division.id ? 'opacity-50' : ''}`}
                                        alt={division.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/assets/default-division.svg";
                                        }}
                                    />
                                    <h3 className="text-lg md:text-xl font-medium text-center">Divisi {division.name}</h3>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex justify-center py-8">
                            <p>Tidak ada divisi tersedia</p>
                        </div>
                    )}
                </div>
                {/* Peraturan Ujian */}
                <div className="mt-4">
                    <h2 className="text-xl md:text-2xl font-bold text-secondary mb-4 md:mb-6">
                        Peraturan Ujian
                    </h2>
                    <ol className="text-base md:text-lg mx-2 md:mx-4 list-decimal pl-4 space-y-1 md:space-y-2">
                        <li>Setiap peserta diberikan waktu maksimal 60 menit untuk menyelesaikan seluruh soal. Pastikan memanfaatkan waktu dengan baik.</li>
                        <li>Ujian harus dikerjakan menggunakan koneksi jaringan yang stabil untuk menghindari kendala teknis selama pengerjaan.</li>
                        <li>Peserta wajib menjawab semua soal secara jujur dan mandiri tanpa bantuan pihak lain atau sumber eksternal.</li>
                        <li>Selama ujian berlangsung, peserta tidak diperbolehkan keluar atau berpindah dari halaman ujian, kecuali jika telah selesai mengerjakan.</li>
                        <li>Setiap peserta hanya memiliki satu kali kesempatan untuk mengikuti ujian, jadi pastikan mempersiapkan diri dengan baik.</li>
                        <li>Peserta yang terbukti melakukan kecurangan, keluar dari halaman ujian tanpa alasan jelas, atau melanggar aturan akan didiskualifikasi dari proses seleksi.</li>
                        <li>Jika ada pertanyaan atau kendala, hubungi Azizah (083183879726) , Fadhilla (081363681138)</li>
                    </ol>
                </div>
                {/* Start Exam Button */}
                {selectedDivision && (
                    <div className="flex justify-center md:justify-start mt-6 md:mt-10">
                        <button
                            onClick={handleStartExamClick}
                            className="border-2 border-[#2E1461] bg-[#2E1461] text-white py-3 text-base md:text-lg font-semibold rounded-xl hover:bg-white hover:text-[#2E1461] hover:cursor-pointer w-full md:w-2/3 lg:w-1/3"
                            disabled={loading}
                        >
                            {loading ? 'Memuat...' : 'Mulai Ujian'}
                        </button>
                    </div>
                )}
                {!selectedDivision && !loading && (
                    <div className="flex justify-center mt-6 md:mt-10">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full md:w-2/3 lg:w-1/2">
                            <p className="text-center">Anda harus mempunyai divisi untuk mengikuti ujian. Silakan lengkapi profil Anda terlebih dahulu.</p>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className={`flex flex-col md:flex-row min-h-screen h-full ${showConfirmation ? 'relative' : ''}`}>
            {/* Inject animation keyframes */}
            <style>{animationStyles}</style>

            {/* Mobile Header with Burger Menu */}
            <div className="md:hidden bg-[#2d2460] p-4 flex justify-between items-center sticky top-0 z-40">
                <button onClick={toggleSidebar} className="text-white text-3xl">
                    <IoMenu />
                </button>
                <div className="w-8"></div>
            </div>

            {/* Mobile Sidebar */}
            {isMobile && (
                <>
                    <div className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <SidebarComponent closeSidebar={() => setSidebarOpen(false)} />
                    </div>
                    <div
                        className={`fixed inset-0 z-40 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                </>
            )}

            {/* Desktop Sidebar */}
            <div className="hidden md:block sticky top-0 h-screen overflow-y-auto">
                <SidebarComponent />
            </div>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${(isMobile && sidebarOpen) || showConfirmation ? 'blur-sm' : ''}`}
                style={{ pointerEvents: (isMobile && sidebarOpen) || showConfirmation ? 'none' : 'auto' }}>
                <section className="flex-1 p-4 px-6 md:p-8 md:px-16 flex flex-col gap-4 md:gap-6 overflow-y-auto">
                    <div className="self-end">
                        <ProfileComponent />
                    </div>

                    {loading ? (
                        <div className="flex-1 flex justify-center items-center">
                            <p className="text-lg">Memuat data...</p>
                        </div>
                    ) : examStatus?.has_taken_exam ? (
                        // Exam completed view with animation
                        <div className={examStatus?.exam_status === 'completed' ? 'relative' : ''}>
                            {examStatus?.exam_status === 'completed' &&
                                <div className="relative z-10">
                                    {renderExamResultContent()}
                                </div>
                            }
                        </div>
                    ) : (
                        // Exam preparation view
                        renderExamPreparation()
                    )}
                </section>
            </div>

            {/* Confirmation Popup */}
            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center z-50" onClick={handleCancelExam}>
                    <div
                        className="bg-white rounded-xl p-6 md:p-8 max-w-md w-11/12 md:w-full shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl md:text-2xl font-bold text-[#2E1461] mb-4">Konfirmasi Ujian</h3>
                        <p className="text-base md:text-lg mb-6">
                            Anda akan mengikuti ujian untuk Divisi <span className="font-semibold">{getDivisionName()}</span>
                        </p>
                        <p className="text-sm md:text-base text-gray-600 mb-6">
                            Pastikan Anda sudah siap karena ujian tidak dapat diulang.
                        </p>
                        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                            <button
                                onClick={handleCancelExam}
                                className="py-3 px-4 md:px-6 border-2 border-[#2E1461] text-[#2E1461] font-semibold rounded-lg hover:bg-gray-100 md:w-1/2 order-2 md:order-1"
                                disabled={loading}
                            >
                                Kembali
                            </button>
                            <button
                                onClick={handleStartExam}
                                className="py-3 px-4 md:px-6 bg-[#2E1461] text-white font-semibold rounded-lg hover:bg-[#2d2460] text-center md:w-1/2 order-1 md:order-2"
                                disabled={loading}
                            >
                                {loading ? 'Memulai...' : 'Mulai Sekarang'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamPreparation;