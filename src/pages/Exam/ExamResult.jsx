import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaTrophy } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import examService from "../../services/ExamService";
import { toast } from "react-toastify";

const ExamResult = () => {
    const [loading, setLoading] = useState(true);
    const [animationStage, setAnimationStage] = useState("initial"); // initial -> congratulation -> calculating -> result
    const [examResult, setExamResult] = useState(null);

    const navigate = useNavigate();
    const { examId } = useParams();

    // Enhanced CSS untuk animasi yang lebih menarik
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

    // Fetch exam result on component mount
    useEffect(() => {
        const fetchExamResult = async () => {
            try {
                // Start animation sequence
                setAnimationStage("congratulation");

                // Wait for congratulation animation
                setTimeout(() => {
                    setAnimationStage("calculating");

                    // Simulate calculation time
                    setTimeout(async () => {
                        const response = await examService.getExamResult(examId);

                        if (response.success) {
                            setExamResult(response.data.data);
                            setAnimationStage("result");
                        } else {
                            toast.error(response.message);
                            setTimeout(() => navigate('/dashboard'), 2000);
                        }

                        setLoading(false);
                    }, 3000); // 3 seconds for "calculating" stage
                }, 3000); // 3 seconds for "congratulation" stage

            } catch (error) {
                console.error("Error fetching exam result:", error);
                toast.error("Terjadi kesalahan saat memuat hasil ujian");
                setLoading(false);
                setTimeout(() => navigate('/dashboard'), 2000);
            }
        };

        fetchExamResult();
    }, [examId, navigate]);

    const renderAnimationStage = () => {
        switch (animationStage) {
            case "congratulation":
                return (
                    <div className="bg-white p-6 md:p-12 rounded-xl text-center">
                        <div className="trophy-animate text-yellow-500 text-7xl md:text-8xl mx-auto mb-6">
                            <FaTrophy />
                        </div>
                        <h1 className="text-2xl md:text-4xl font-bold text-[#1E0771] mb-4" style={{ animation: "pulse 2s infinite" }}>
                            Selamat!
                        </h1>
                        <p className="text-xl md:text-2xl text-[#2E1461]">
                            Anda telah menyelesaikan ujian!
                        </p>
                    </div>
                );

            case "calculating":
                return (
                    <div className="bg-white p-6 md:p-12 rounded-xl text-center">
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
                if (!examResult) return null;

                return (
                    <div className="bg-white p-6 md:p-12 rounded-xl">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#1E0771]">Hasil akhir ujian</h1>
                        <div className="border-2 mt-6 md:mt-8 p-4 md:p-6 rounded-xl border-secondary">
                            <h2 className="text-lg md:text-xl font-bold">
                                Ujian divisi {examResult.division}
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
                                        {examResult.correct_answers}
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
                                        {examResult.incorrect_answers}
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
                                        {examResult.score}
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
                );

            default:
                return (
                    <div className="bg-white p-6 rounded-xl">
                        <p className="text-lg">Loading hasil ujian...</p>
                    </div>
                );
        }
    };

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
                {renderAnimationStage()}
            </div>
        </div>
    );
};

export default ExamResult;