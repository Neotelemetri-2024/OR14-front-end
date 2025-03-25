import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import examService from "../../services/ExamService";
import { toast } from "react-toastify"; // You may need to install this library

const ExamResult = () => {
    const [loading, setLoading] = useState(true);
    const [examResult, setExamResult] = useState(null);

    const navigate = useNavigate();
    const { examId } = useParams(); // If you want to support viewing specific exam results

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

    // Fetch exam result on component mount
    useEffect(() => {
        const fetchExamResult = async () => {
            setLoading(true);
            const response = await examService.getExamResult(examId);

            if (response.success) {
                setExamResult(response.data.data);
            } else {
                toast.error(response.message);
                // If there's no result, redirect to dashboard
                setTimeout(() => navigate('/dashboard'), 2000);
            }

            setLoading(false);
        };

        fetchExamResult();
    }, [examId, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1E0771]">
                <div className="bg-white p-6 rounded-xl">
                    <p className="text-lg">Loading hasil ujian...</p>
                </div>
            </div>
        );
    }

    if (!examResult) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1E0771]">
                <div className="bg-white p-6 rounded-xl">
                    <p className="text-lg">Hasil ujian tidak ditemukan</p>
                    <Link to="/dashboard">
                        <button className="mt-4 border-2 w-full py-3 px-4 rounded-lg bg-secondary text-white font-semibold hover:cursor-pointer hover:bg-white hover:text-[#2E1461] transition duration-300">
                            Kembali ke Dashboard
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

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
                            Ujian divisi {examResult.division}
                        </h2>

                        {/* ExamResult */}
                        <div className="flex flex-col justify-between px-2 md:px-4 gap-6 md:gap-8 mt-6 md:mt-8">

                            {/* Benar */}
                            <div className="flex flex-row text-[#2E1461] text-xl md:text-2xl items-center justify-between">
                                <div className="flex flex-row items-center gap-3 md:gap-6">
                                    <FaCheckCircle className="text-4xl md:text-5xl text-green-600" />
                                    <h2 className="font-semibold">
                                        Benar:
                                    </h2>
                                </div>
                                <h2 className="text-lg md:text-xl font-bold text-[#2E1461]">
                                    {examResult.correct_answers}
                                </h2>
                            </div>

                            {/* Salah */}
                            <div className="flex flex-row text-[#2E1461] text-xl md:text-2xl items-center justify-between">
                                <div className="flex flex-row items-center gap-3 md:gap-6">
                                    <FaTimesCircle className="text-4xl md:text-5xl text-red-600" />
                                    <h2 className="font-semibold">
                                        Salah:
                                    </h2>
                                </div>
                                <h2 className="text-lg md:text-xl font-bold text-[#2E1461]">
                                    {examResult.incorrect_answers}
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
                                    {examResult.score}
                                </h2>
                            </div>

                            {/* Waktu */}
                            <div className="flex flex-row text-[#2E1461] text-xl md:text-2xl items-center justify-between">
                                <div className="flex flex-row items-center gap-3 md:gap-6">
                                    <FaTimesCircle className="text-4xl md:text-5xl opacity-0" />
                                    <h2 className="font-semibold">
                                        Waktu:
                                    </h2>
                                </div>
                                <h2 className="text-lg md:text-xl font-bold text-[#2E1461]">
                                    {new Date(examResult.start_time).toLocaleString()} - {new Date(examResult.end_time).toLocaleString()}
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