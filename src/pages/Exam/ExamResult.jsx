import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const ExamResult = () => {
    // CSS untuk animasi gambar dekorasi
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
    `;
    return (
        <div className="min-h-screen h-full bg-[#1E0771] relative overflow-hidden">
            {/* Inject animation keyframes */}
            <style>{animationStyles}</style>
            {/* Decorative image - fixed at top, full width with animation */}
            <img
                src="/assets/result/Group90.png"
                className="w-full object-cover absolute top-0 left-0 animate-pulse-slow opacity-80"
                alt="Decoration"
                style={{
                    animation: "fadeInScale 1.5s ease-out forwards, float 6s ease-in-out infinite"
                }}
            />

            {/* Content container with padding to position card - improved for mobile */}
            <div className="relative z-10 py-16 md:py-36 px-4 md:px-16">
                <div className="bg-white p-6 md:p-12 rounded-xl">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1E0771]">Hasil akhir ujian</h1>
                    <div className="border-2 mt-6 md:mt-8 p-4 md:p-6 rounded-xl border-secondary">
                        <h2 className="text-lg md:text-xl font-bold">
                            Ujian divisi
                        </h2>

                        {/* ExamResult */}
                        <div className="flex flex-col justify-between px-2 md:px-4 gap-6 md:gap-8 mt-6 md:mt-8">

                            {/* Benar */}
                            <div className="flex flex-row text-[#2E1461] text-xl md:text-2xl items-center justify-between">
                                <div className="flex flex-row items-center gap-3 md:gap-6">
                                    <FaCheckCircle className="text-4xl md:text-5xl" />
                                    <h2 className="font-semibold">
                                        Benar:
                                    </h2>
                                </div>
                                <h2 className="text-lg md:text-xl font-bold text-[#2E1461]">
                                    17
                                </h2>
                            </div>


                            {/* Salah */}
                            <div className="flex flex-row text-[#2E1461] text-xl md:text-2xl items-center justify-between">
                                <div className="flex flex-row items-center gap-3 md:gap-6">
                                    <FaTimesCircle className="text-4xl md:text-5xl" />
                                    <h2 className="font-semibold">
                                        Salah:
                                    </h2>
                                </div>
                                <h2 className="text-lg md:text-xl font-bold text-[#2E1461]">
                                    0
                                </h2>
                            </div>

                            {/* Nilai */}
                            <div className="flex flex-row text-[#2E1461] text-xl md:text-2xl items-center justify-between">
                                <div className="flex flex-row items-center gap-3 md:gap-6">
                                    <FaTimesCircle className="text-4xl md:text-5xl opacity-0" />
                                    <h2 className="font-semibold">
                                        Nilai:
                                    </h2>
                                </div>
                                <h2 className="text-lg md:text-xl font-bold text-[#2E1461]">
                                    100
                                </h2>
                            </div>

                        </div>
                    </div>
                    <Link to="/dashboard">
                        <div className="w-full flex flex-col mt-8 md:mt-12">
                            <button className="border-2 w-full md:w-auto md:self-end py-3 md:py-4 px-4 rounded-lg bg-secondary text-white font-semibold hover:cursor-pointer hover:bg-white hover:text-[#2E1461] transition duration-300">
                                Kembali ke Dashboard
                            </button>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ExamResult;