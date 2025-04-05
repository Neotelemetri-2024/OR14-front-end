import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import examService from "../services/ExamService";
import { toast } from "react-toastify";

const ProfileComponent = () => {
    // Mengambil data dari context
    const { user } = useAuth();
    const { profile } = useProfile();
    const navigate = useNavigate();
    const [hasOngoingExam, setHasOngoingExam] = useState(false);
    const [loading, setLoading] = useState(false);

    // Menentukan nama yang akan ditampilkan
    // Prioritas: 1. Nama dari user auth (tabel users) 2. Nama panggilan dari profile 3. Default
    const displayName = user?.name || profile?.panggilan || "User";

    // Check if user has an ongoing exam
    useEffect(() => {
        const checkOngoingExam = async () => {
            try {
                const response = await examService.getExamQuestions();
                // If we can get questions, it means there's an ongoing exam
                if (response.success) {
                    setHasOngoingExam(true);
                }
            } catch (error) {
                // If we get an error other than "no ongoing exam", log it
                if (error?.response?.data?.message !== "You don't have an ongoing exam") {
                    console.error("Error checking ongoing exam:", error);
                }
            }
        };

        checkOngoingExam();
    }, []);

    // Handler for continuing exam
    const handleContinueExam = async () => {
        setLoading(true);
        try {
            const response = await examService.getExamQuestions();
            if (response.success) {
                navigate('/exam');
            } else {
                // If exam has expired or other error
                toast.error(response.message || "Tidak dapat melanjutkan ujian");
                setHasOngoingExam(false);
            }
        } catch (error) {
            toast.error("Terjadi kesalahan saat memuat ujian");
            setHasOngoingExam(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-end">
            <div className="w-full">
                <Link to="/profile" className="block w-full">
                    <button className="flex flex-row gap-2 md:gap-4 items-center hover:bg-gray-100 hover:cursor-pointer pl-2 w-full justify-end">
                        <h2 className="text-[#2E1461] text-lg md:text-xl font-bold">{displayName}</h2>
                        <div className="border p-3 md:p-6 bg-[#372088] overflow-hidden relative">
                            {profile?.photo_url ? (
                                <img
                                    src={profile.photo_url}
                                    alt="Profile"
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={(e) => {
                                        // Jika gambar gagal dimuat, tampilkan ikon default
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                            ) : null}
                            <FaUser className="text-white text-lg md:text-xl" style={{ display: profile?.photo_url ? 'none' : 'block' }} />
                        </div>
                    </button>
                </Link>
            </div>

            {/* Button to continue exam if there's an ongoing one */}
            {hasOngoingExam && (
                <button
                    onClick={handleContinueExam}
                    disabled={loading}
                    className="mt-2 px-4 py-2 bg-[#2E1461] text-white rounded-lg text-sm font-medium hover:bg-[#231c5b] transition-colors w-full flex justify-center items-center"
                >
                    {loading ? "Memuat..." : "Lanjutkan Ujian"}
                </button>
            )}
        </div>
    );
};

export default ProfileComponent;