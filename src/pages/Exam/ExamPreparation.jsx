import { useState, useEffect } from "react";
import { IoMenu } from "react-icons/io5";
import SidebarComponent from "../../components/SidebarComponent";
import ProfileComponent from "../../components/ProfileComponent";
import { Link } from "react-router-dom";

const ExamPreparation = () => {
    // State untuk menyimpan divisi yang dipilih
    const [selectedDivision, setSelectedDivision] = useState(null);
    // State untuk sidebar mobile
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // State untuk deteksi mobile view
    const [isMobile, setIsMobile] = useState(false);
    // State untuk popup konfirmasi
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Function untuk memilih divisi
    const handleSelect = (division) => {
        setSelectedDivision(division);
    };

    // Toggle sidebar for mobile
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Show confirmation popup
    const handleStartExamClick = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    // Hide confirmation popup
    const handleCancelExam = () => {
        setShowConfirmation(false);
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
        switch (selectedDivision) {
            case 'programming':
                return 'Programming';
            case 'multimedia':
                return 'Multimedia dan Design';
            case 'skj':
                return 'Sistem Komputer dan Jaringan';
            default:
                return '';
        }
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
                        {/* Divisi Programming */}
                        <div className="flex flex-col justify-center">
                            <div
                                onClick={() => handleSelect('programming')}
                                className={`border-2 ${selectedDivision === 'programming'
                                    ? 'border-4 border-[#2E1461] bg-[#EBF2FF]'
                                    : 'border-secondary'} rounded-lg py-4 md:py-6 px-4 flex flex-col justify-center items-center w-full h-44 md:h-56 gap-3 md:gap-4 hover:bg-secondary hover:text-white transition-colors cursor-pointer`}
                            >
                                <img src="/assets/programming.svg" className="w-20 h-20 md:w-28 md:h-28 object-contain" alt="Programming" />
                                <h3 className="text-lg md:text-xl font-medium text-center">Divisi Programming</h3>
                            </div>
                            <button
                                onClick={() => handleSelect('programming')}
                                className={`border-2 border-secondary rounded-xl py-2 md:py-3 mx-2 md:mx-4 mt-4 md:mt-6 ${selectedDivision === 'programming'
                                    ? 'bg-white text-[#2E1461] border-[#2E1461] font-bold'
                                    : 'bg-[#2E1461] text-white'
                                    } font-semibold text-base hover:cursor-pointer hover:bg-white hover:text-[#2E1461]`}>
                                {selectedDivision === 'programming' ? 'Dipilih' : 'Pilih'}
                            </button>
                        </div>

                        {/* Divisi Multimedia dan Design */}
                        <div className="flex flex-col justify-center">
                            <div
                                onClick={() => handleSelect('multimedia')}
                                className={`border-2 ${selectedDivision === 'multimedia'
                                    ? 'border-4 border-[#2E1461] bg-[#EBF2FF]'
                                    : 'border-secondary'} rounded-lg py-4 md:py-6 px-4 flex flex-col justify-center items-center w-full h-44 md:h-56 gap-3 md:gap-4 hover:bg-secondary hover:text-white transition-colors cursor-pointer`}
                            >
                                <img src="/assets/mmd.svg" className="w-20 h-20 md:w-28 md:h-28 object-contain rotate-20" alt="Multimedia" />
                                <h3 className="text-lg md:text-xl font-medium text-center">Divisi Multimedia & Desain</h3>
                            </div>
                            <button
                                onClick={() => handleSelect('multimedia')}
                                className={`border-2 border-secondary rounded-xl py-2 md:py-3 mx-2 md:mx-4 mt-4 md:mt-6 ${selectedDivision === 'multimedia'
                                    ? 'bg-white text-[#2E1461] border-[#2E1461] font-bold'
                                    : 'bg-[#2E1461] text-white'
                                    } font-semibold text-base hover:cursor-pointer hover:bg-white hover:text-[#2E1461]`}>
                                {selectedDivision === 'multimedia' ? 'Dipilih' : 'Pilih'}
                            </button>
                        </div>

                        {/* Divisi Sistem Komputer dan Jaringan */}
                        <div className="flex flex-col justify-center">
                            <div
                                onClick={() => handleSelect('skj')}
                                className={`border-2 ${selectedDivision === 'skj'
                                    ? 'border-4 border-[#2E1461] bg-[#EBF2FF]'
                                    : 'border-secondary'} rounded-lg py-4 md:py-6 px-4 flex flex-col justify-center items-center w-full h-44 md:h-56 gap-3 md:gap-4 hover:bg-secondary hover:text-white transition-colors cursor-pointer`}
                            >
                                <img src="/assets/skj.svg" className="w-20 h-20 md:w-28 md:h-28 object-contain" alt="Sistem Komputer & Jaringan" />
                                <h3 className="text-lg md:text-xl font-medium text-center">Divisi Sistem Komputer & Jaringan</h3>
                            </div>
                            <button
                                onClick={() => handleSelect('skj')}
                                className={`border-2 border-secondary rounded-xl py-2 md:py-3 mx-2 md:mx-4 mt-4 md:mt-6 ${selectedDivision === 'skj'
                                    ? 'bg-white text-[#2E1461] border-[#2E1461] font-bold'
                                    : 'bg-[#2E1461] text-white'
                                    } font-semibold text-base hover:cursor-pointer hover:bg-white hover:text-[#2E1461]`}>
                                {selectedDivision === 'skj' ? 'Dipilih' : 'Pilih'}
                            </button>
                        </div>
                    </div>

                    {/* Peraturan Ujian */}
                    <div className="mt-4">
                        <h2 className="text-xl md:text-2xl font-bold text-secondary mb-4 md:mb-6">
                            Peraturan Ujian
                        </h2>
                        <ol className="text-base md:text-lg mx-2 md:mx-4 list-decimal pl-4 space-y-1 md:space-y-2">
                            <li>Mengucapkan dua kalimat syahadat</li>
                            <li>Melaksanakan Sholat</li>
                            <li>Membayar Zakat</li>
                            <li>Berpuasa di Bulan Ramadhan</li>
                            <li>Melaksanakan ibadah haji bagi yang mampu</li>
                        </ol>
                    </div>

                    {/* Start Exam Button */}
                    <div className="flex justify-center md:justify-start mt-6 md:mt-10">
                        <button
                            onClick={handleStartExamClick}
                            className={`border-2 border-[#2E1461] ${selectedDivision ? 'bg-[#2E1461] text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                } py-3 text-base md:text-lg font-semibold rounded-xl ${selectedDivision ? 'hover:bg-white hover:text-[#2E1461] hover:cursor-pointer' : ''
                                } w-full md:w-2/3 lg:w-1/3`}
                            disabled={!selectedDivision}
                        >
                            Mulai Ujian
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
                            >
                                Kembali
                            </button>
                            <Link
                                to="/exam"
                                className="py-3 px-4 md:px-6 bg-[#2E1461] text-white font-semibold rounded-lg hover:bg-[#2d2460] text-center md:w-1/2 order-1 md:order-2"
                            >
                                Mulai Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamPreparation;