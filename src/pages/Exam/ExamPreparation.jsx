import { useState, useEffect } from "react";
import { IoMenu } from "react-icons/io5";
import SidebarComponent from "../../components/SidebarComponent";
import ProfileComponent from "../../components/ProfileComponent";
import { useNavigate } from "react-router-dom";
import examService from "../../services/ExamService";
// Import toast for notifications - you may need to install react-toastify or a similar library
import { toast } from "react-toastify";


const ExamPreparation = () => {
    // State for storing divisions from API
    const [divisions, setDivisions] = useState([]);
    // State for loading state
    const [loading, setLoading] = useState(false);
    // State untuk menyimpan divisi yang dipilih
    const [selectedDivision, setSelectedDivision] = useState(null);
    // State untuk sidebar mobile
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // State untuk deteksi mobile view
    const [isMobile, setIsMobile] = useState(false);
    // State untuk popup konfirmasi
    const [showConfirmation, setShowConfirmation] = useState(false);

    const navigate = useNavigate();

    // Fetch divisions on component mount
    useEffect(() => {
        const fetchDivisions = async () => {
            setLoading(true);
            const response = await examService.getDivisions();
            if (response.success) {
                setDivisions(response.data.data || []);
            } else {
                toast.error(response.message);
            }
            setLoading(false);
        };

        fetchDivisions();
    }, []);

    // Function untuk memilih divisi
    const handleSelect = (divisionId) => {
        setSelectedDivision(divisionId);
    };

    // Toggle sidebar for mobile
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Show confirmation popup
    const handleStartExamClick = (e) => {
        e.preventDefault();
        if (!selectedDivision) return;
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

    // Check if screen is mobile on initial load and when window is resized
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

    return (
        <div className={`flex flex-col md:flex-row min-h-screen h-full ${showConfirmation ? 'relative' : ''}`}>
            {/* Mobile Header with Burger Menu */}
            <div className="md:hidden bg-[#2d2460] p-4 flex justify-between items-center sticky top-0 z-40">
                <button onClick={toggleSidebar} className="text-white text-3xl">
                    <IoMenu />
                </button>
                <div className="w-8"></div> {/* Empty div for balanced spacing */}
            </div>

            {/* Mobile Sidebar with Blur Effect */}
            {isMobile && (
                <>
                    {/* Mobile Sidebar */}
                    <div className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <SidebarComponent closeSidebar={() => setSidebarOpen(false)} />
                    </div>

                    {/* Invisible overlay to close sidebar when clicked */}
                    <div
                        className={`fixed inset-0 z-40 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                </>
            )}

            {/* Desktop Sidebar (Original Implementation) */}
            <div className="hidden md:block sticky top-0 h-screen overflow-y-auto">
                <SidebarComponent />
            </div>

            {/* Main Content - Apply blur only on mobile sidebar open or when confirmation popup is shown */}
            <div className={`flex-1 transition-all duration-300 ${(isMobile && sidebarOpen) || showConfirmation ? 'blur-sm' : ''}`}
                style={{ pointerEvents: (isMobile && sidebarOpen) || showConfirmation ? 'none' : 'auto' }}>
                <section className="flex-1 p-4 px-6 md:p-8 md:px-16 flex flex-col gap-4 md:gap-6 overflow-y-auto">
                    {/* User Profile Button */}
                    <div className="self-end">
                        <ProfileComponent />
                    </div>

                    <div>
                        <h2 className="text-secondary text-xl md:text-2xl font-bold">Ujian Online OR Neo Telemetri 14</h2>
                    </div>

                    <div>
                        <p className="text-base md:text-lg">
                            Silahkan pilih sesuai divisimu!
                        </p>
                    </div>

                    {/* Divisions Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4 md:gap-6 py-4 px-2 md:px-8">
                        {loading ? (
                            <div className="col-span-full flex justify-center items-center h-48">
                                <p>Loading...</p>
                            </div>
                        ) : divisions.length > 0 ? (
                            divisions.map((division) => (
                                <div key={division.id} className="flex flex-col justify-center">
                                    <div
                                        onClick={() => handleSelect(division.id)}
                                        className={`border-2 ${selectedDivision === division.id
                                            ? 'border-4 border-[#2E1461] bg-[#EBF2FF]'
                                            : 'border-secondary'} rounded-lg py-4 md:py-6 px-4 flex flex-col justify-center items-center w-full h-44 md:h-56 gap-3 md:gap-4 hover:bg-secondary hover:text-white transition-colors cursor-pointer`}
                                    >
                                        <img
                                            src={`/assets/${division.code}.svg`}
                                            className="w-20 h-20 md:w-28 md:h-28 object-contain"
                                            alt={division.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/assets/default-division.svg";
                                            }}
                                        />
                                        <h3 className="text-lg md:text-xl font-medium text-center">Divisi {division.name}</h3>
                                    </div>
                                    <button
                                        onClick={() => handleSelect(division.id)}
                                        className={`border-2 border-secondary rounded-xl py-2 md:py-3 mx-2 md:mx-4 mt-4 md:mt-6 ${selectedDivision === division.id
                                            ? 'bg-white text-[#2E1461] border-[#2E1461] font-bold'
                                            : 'bg-[#2E1461] text-white'
                                            } font-semibold text-base hover:cursor-pointer hover:bg-white hover:text-[#2E1461]`}>
                                        {selectedDivision === division.id ? 'Dipilih' : 'Pilih'}
                                    </button>
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
                            <li>Ujian ini terdiri dari beberapa soal pilihan ganda</li>
                            <li>Setiap soal memiliki satu jawaban yang benar</li>
                            <li>Jawaban yang telah dipilih dapat diubah selama ujian belum selesai</li>
                            <li>Waktu ujian berjalan sejak ujian dimulai dan tidak dapat dihentikan</li>
                            <li>Pastikan koneksi internet stabil selama mengerjakan ujian</li>
                        </ol>
                    </div>

                    {/* Start Exam Button */}
                    <div className="flex justify-center md:justify-start mt-6 md:mt-10">
                        <button
                            onClick={handleStartExamClick}
                            className={`border-2 border-[#2E1461] ${selectedDivision ? 'bg-[#2E1461] text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                } py-3 text-base md:text-lg font-semibold rounded-xl ${selectedDivision ? 'hover:bg-white hover:text-[#2E1461] hover:cursor-pointer' : ''
                                } w-full md:w-2/3 lg:w-1/3`}
                            disabled={!selectedDivision || loading}
                        >
                            {loading ? 'Loading...' : 'Mulai Ujian'}
                        </button>
                    </div>
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
                            Apakah kamu yakin ingin memulai ujian untuk Divisi <span className="font-semibold">{getDivisionName()}</span>?
                        </p>
                        <p className="text-sm md:text-base text-gray-600 mb-6">
                            Setelah memulai, ujian tidak dapat dibatalkan dan kamu akan memiliki waktu terbatas untuk menyelesaikannya.
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