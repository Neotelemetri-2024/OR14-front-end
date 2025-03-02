import { FaUser } from "react-icons/fa";
import SidebarComponent from "../../Components/SidebarComponent";
import { useState } from "react";

const ExamPreparation = () => {
    // State untuk menyimpan divisi yang dipilih
    const [selectedDivision, setSelectedDivision] = useState(null);

    // Function untuk memilih divisi
    const handleSelect = (division) => {
        setSelectedDivision(division);
    };

    return (
        <div className="flex flex-row min-h-screen h-full">
            <section className="lg:flex-1 flex-2">
                <SidebarComponent />
            </section>
            <section className="lg:flex-4 flex-3 p-8 pl-20 flex flex-col">
                <button className="self-end flex flex-row gap-4 items-center">
                    <h2 className="text-[#2E1461] text-2xl font-bold">Berka Aldizar</h2>
                    <div className="border p-6 bg-[#372088]">
                        <FaUser className="text-white text-2xl" />
                    </div>
                </button>
                <div>
                    <h2 className="text-secondary text-3xl font-semibold">Ujian Online OR Neo Telemetri XIV</h2>
                </div>
                <div className="mt-16">
                    <p className="text-xl">
                        Silahkan pilih sesuai divisimu!
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 py-8 px-4 lg:px-12">
                    {/* Divisi Programming */}
                    <div className="flex flex-col justify-center">
                        <div className={`border-2 ${selectedDivision === 'programming'
                            ? 'border-4 border-[#1E0771] bg-[#EBF2FF]'
                            : 'border-secondary'} rounded-lg py-8 px-6 flex flex-col justify-center items-center w-full h-64 gap-4 hover:bg-secondary hover:text-white transition-colors cursor-pointer`}>
                            <img src="/assets/programming.svg" className="w-36 h-36 object-contain" alt="Programming" />
                            <h3 className="text-xl font-medium text-center">Divisi Programming</h3>
                        </div>
                        <button
                            onClick={() => handleSelect('programming')}
                            className={`border-2 border-secondary rounded-xl py-4 mx-4 mt-16 ${selectedDivision === 'programming'
                                ? 'bg-white text-[#1E0771] border-[#1E0771] font-bold'
                                : 'bg-[#1E0771] text-white'
                                } font-semibold text-xl hover:cursor-pointer hover:bg-white hover:text-[#1E0771]`}>
                            {selectedDivision === 'programming' ? 'Dipilih' : 'Pilih'}
                        </button>
                    </div>

                    {/* Divisi Multimedia dan Design */}
                    <div className="flex flex-col justify-center">
                        <div className={`border-2 ${selectedDivision === 'multimedia'
                            ? 'border-4 border-[#1E0771] bg-[#EBF2FF]'
                            : 'border-secondary'} rounded-lg py-8 px-6 flex flex-col justify-center items-center w-full h-64 gap-4 hover:bg-secondary hover:text-white transition-colors cursor-pointer`}>
                            <img src="/assets/mmd.svg" className="w-36 h-36 object-contain rotate-20" alt="Multimedia" />
                            <h3 className="text-xl font-medium text-center">Divisi Multimedia dan Design</h3>
                        </div>
                        <button
                            onClick={() => handleSelect('multimedia')}
                            className={`border-2 border-secondary rounded-xl py-4 mx-4 mt-16 ${selectedDivision === 'multimedia'
                                ? 'bg-white text-[#1E0771] border-[#1E0771] font-bold'
                                : 'bg-[#1E0771] text-white'
                                } font-semibold text-xl hover:cursor-pointer hover:bg-white hover:text-[#1E0771]`}>
                            {selectedDivision === 'multimedia' ? 'Dipilih' : 'Pilih'}
                        </button>
                    </div>

                    {/* Divisi Sistem Komputer dan Jaringan */}
                    <div className="flex flex-col justify-center">
                        <div className={`border-2 ${selectedDivision === 'skj'
                            ? 'border-4 border-[#1E0771] bg-[#EBF2FF]'
                            : 'border-secondary'} rounded-lg py-8 px-6 flex flex-col justify-center items-center w-full h-64 gap-4 hover:bg-secondary hover:text-white transition-colors cursor-pointer`}>
                            <img src="/assets/skj.svg" className="w-36 h-36 object-contain" alt="Sistem Komputer" />
                            <h3 className="text-xl font-medium text-center">Divisi Sistem Komputer dan Jaringan</h3>
                        </div>
                        <button
                            onClick={() => handleSelect('skj')}
                            className={`border-2 border-secondary rounded-xl py-4 mx-4 mt-16 ${selectedDivision === 'skj'
                                ? 'bg-white text-[#1E0771] border-[#1E0771] font-bold'
                                : 'bg-[#1E0771] text-white'
                                } font-semibold text-xl hover:cursor-pointer hover:bg-white hover:text-[#1E0771]`}>
                            {selectedDivision === 'skj' ? 'Dipilih' : 'Pilih'}
                        </button>
                    </div>
                </div>

                {/* Peraturan Ujian */}
                <div>
                    <h2 className="text-3xl font-bold text-secondary mb-10 mt-16">
                        Peraturan Ujian
                    </h2>
                    <ol className="text-lg mx-4 list-decimal pl-4 space-y-2">
                        <li>Mengucapkan dua kalimat syahadat</li>
                        <li>Melaksanakan Sholat</li>
                        <li>Membayar Zakat</li>
                        <li>Berpuasa di Bulan Ramadhan</li>
                        <li>Melaksanakan ibadah haji bagi yang mampu</li>
                    </ol>
                </div>
                <button
                    className={`mt-20 border-2 border-[#1E0771] ${selectedDivision ? 'bg-[#1E0771] text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        } py-4 text-xl font-semibold rounded-xl ${selectedDivision ? 'hover:bg-white hover:text-[#1E0771] hover:cursor-pointer' : ''
                        } w-1/4`}
                    disabled={!selectedDivision}
                >
                    Mulai Ujian
                </button>
            </section>
        </div>
    );
};

export default ExamPreparation;