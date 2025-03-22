import { useState, useEffect } from "react";
import { IoMenu } from "react-icons/io5";
import SidebarComponent from "../../Components/SidebarComponent";
import ProfileComponent from "../../Components/ProfileComponent";
import { Link } from "react-router-dom";

const ExamPreparation = () => {
    // State untuk menyimpan divisi yang dipilih
    const [selectedDivision, setSelectedDivision] = useState(null);
    // State untuk sidebar mobile
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // State untuk deteksi mobile view
    const [isMobile, setIsMobile] = useState(false);

    // Function untuk memilih divisi
    const handleSelect = (division) => {
        setSelectedDivision(division);
    };

    // Toggle sidebar for mobile
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
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

    return (
        <div className="flex flex-col md:flex-row min-h-screen h-full">
            {/* Mobile Header with Burger Menu */}
            <div className="md:hidden bg-[#2d2460] p-4 flex justify-between items-center sticky top-0 z-50">
                <button onClick={toggleSidebar} className="text-white text-3xl">
                    <IoMenu />
                </button>
                <img src="/assets/sidebar/or14white.svg" alt="Logo" className="h-8" />
                <div className="w-8"></div> {/* Empty div for balanced spacing */}
            </div>

            {/* Sidebar - different display for mobile vs desktop */}
            {isMobile ? (
                <div className={`fixed inset-0 z-40 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="relative h-full">
                        <SidebarComponent closeSidebar={() => setSidebarOpen(false)} />
                        {/* Semi-transparent overlay */}
                        <div
                            className={`fixed inset-0 bg-black bg-opacity-50 z-30 ${sidebarOpen ? 'block' : 'hidden'}`}
                            onClick={() => setSidebarOpen(false)}
                        ></div>
                    </div>
                </div>
            ) : (
                <div className="md:block sticky top-0 h-screen overflow-y-auto">
                    <SidebarComponent />
                </div>
            )}

            {/* Main Content */}
            <section className="flex-1 p-4 p-4 px-6 md:p-8 md:px-16 flex flex-col gap-4 md:gap-6 overflow-y-auto">
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
                                ? 'border-4 border-[#1E0771] bg-[#EBF2FF]'
                                : 'border-secondary'} rounded-lg py-4 md:py-6 px-4 flex flex-col justify-center items-center w-full h-44 md:h-56 gap-3 md:gap-4 hover:bg-secondary hover:text-white transition-colors cursor-pointer`}
                        >
                            <img src="/assets/programming.svg" className="w-20 h-20 md:w-28 md:h-28 object-contain" alt="Programming" />
                            <h3 className="text-lg md:text-xl font-medium text-center">Divisi Programming</h3>
                        </div>
                        <button
                            onClick={() => handleSelect('programming')}
                            className={`border-2 border-secondary rounded-xl py-2 md:py-3 mx-2 md:mx-4 mt-4 md:mt-6 ${selectedDivision === 'programming'
                                ? 'bg-white text-[#1E0771] border-[#1E0771] font-bold'
                                : 'bg-[#1E0771] text-white'
                                } font-semibold text-base hover:cursor-pointer hover:bg-white hover:text-[#1E0771]`}>
                            {selectedDivision === 'programming' ? 'Dipilih' : 'Pilih'}
                        </button>
                    </div>

                    {/* Divisi Multimedia dan Design */}
                    <div className="flex flex-col justify-center">
                        <div
                            onClick={() => handleSelect('multimedia')}
                            className={`border-2 ${selectedDivision === 'multimedia'
                                ? 'border-4 border-[#1E0771] bg-[#EBF2FF]'
                                : 'border-secondary'} rounded-lg py-4 md:py-6 px-4 flex flex-col justify-center items-center w-full h-44 md:h-56 gap-3 md:gap-4 hover:bg-secondary hover:text-white transition-colors cursor-pointer`}
                        >
                            <img src="/assets/mmd.svg" className="w-20 h-20 md:w-28 md:h-28 object-contain rotate-20" alt="Multimedia" />
                            <h3 className="text-lg md:text-xl font-medium text-center">Divisi Multimedia dan Design</h3>
                        </div>
                        <button
                            onClick={() => handleSelect('multimedia')}
                            className={`border-2 border-secondary rounded-xl py-2 md:py-3 mx-2 md:mx-4 mt-4 md:mt-6 ${selectedDivision === 'multimedia'
                                ? 'bg-white text-[#1E0771] border-[#1E0771] font-bold'
                                : 'bg-[#1E0771] text-white'
                                } font-semibold text-base hover:cursor-pointer hover:bg-white hover:text-[#1E0771]`}>
                            {selectedDivision === 'multimedia' ? 'Dipilih' : 'Pilih'}
                        </button>
                    </div>

                    {/* Divisi Sistem Komputer dan Jaringan */}
                    <div className="flex flex-col justify-center">
                        <div
                            onClick={() => handleSelect('skj')}
                            className={`border-2 ${selectedDivision === 'skj'
                                ? 'border-4 border-[#1E0771] bg-[#EBF2FF]'
                                : 'border-secondary'} rounded-lg py-4 md:py-6 px-4 flex flex-col justify-center items-center w-full h-44 md:h-56 gap-3 md:gap-4 hover:bg-secondary hover:text-white transition-colors cursor-pointer`}
                        >
                            <img src="/assets/skj.svg" className="w-20 h-20 md:w-28 md:h-28 object-contain" alt="Sistem Komputer" />
                            <h3 className="text-lg md:text-xl font-medium text-center">Divisi Sistem Komputer dan Jaringan</h3>
                        </div>
                        <button
                            onClick={() => handleSelect('skj')}
                            className={`border-2 border-secondary rounded-xl py-2 md:py-3 mx-2 md:mx-4 mt-4 md:mt-6 ${selectedDivision === 'skj'
                                ? 'bg-white text-[#1E0771] border-[#1E0771] font-bold'
                                : 'bg-[#1E0771] text-white'
                                } font-semibold text-base hover:cursor-pointer hover:bg-white hover:text-[#1E0771]`}>
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
                <Link to="/exam">
                    <div className="flex justify-center md:justify-start mt-6 md:mt-10">
                        <button
                            className={`border-2 border-[#1E0771] ${selectedDivision ? 'bg-[#1E0771] text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                } py-3 text-base md:text-lg font-semibold rounded-xl ${selectedDivision ? 'hover:bg-white hover:text-[#1E0771] hover:cursor-pointer' : ''
                                } w-full md:w-2/3 lg:w-1/3`}
                            disabled={!selectedDivision}
                        >
                            Mulai Ujian
                        </button>
                    </div>
                </Link>
            </section>
        </div>
    );
};

export default ExamPreparation;