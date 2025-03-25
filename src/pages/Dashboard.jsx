import { FaUser } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import SidebarComponent from "../components/SidebarComponent";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import ProfileComponent from "../components/ProfileComponent";
import { useProfile } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

const TimelineItem = ({ title, date, isActive, isLast }) => {
    return (
        <div className="flex items-start">
            {/* Circle and Line */}
            <div className="flex flex-col items-center mr-4 md:mr-6">
                <div className={`w-5 h-5 rounded-full ${isActive ? 'bg-[#1E0771]' : 'bg-[#7872B6]'} flex items-center justify-center z-10`}>
                </div>
                {!isLast && (
                    <div className="w-1 h-16 md:h-24 bg-[#7872B6]"></div>
                )}
            </div>
            {/* Content */}
            <div className="flex-1">
                <div className="flex justify-between items-start flex-col md:flex-row">
                    <h3 className={`text-lg md:text-xl font-medium ${isActive ? 'text-[#1E0771]' : 'text-[#7872B6]'}`}>
                        {title}
                    </h3>
                    <span className={`${isActive ? 'text-[#1E0771]' : 'text-[#7872B6]'} md:ml-4 font-bold text-base md:text-xl`}>{date}</span>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    // States for UI
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Get user and profile data from context
    const { user } = useAuth();
    const { profile, isProfileComplete, verificationStatus, loading, refreshProfileData } = useProfile();

    // Fetch data on load
    useEffect(() => {
        refreshProfileData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reset image error when profile changes
    useEffect(() => {
        if (profile) {
            setImageError(false);
            console.log('Dashboard received profile data:', profile);
            console.log('Profile photo URL:', profile.photo_url);
        }
    }, [profile]);

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

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Handle image loading error
    const handleImageError = () => {
        console.error('Failed to load profile image:', profile?.photo_url);
        setImageError(true);
    };

    // Timeline data
    const timelineItems = [
        { title: 'Pendaftaran', date: '1 - 7 April 2025', isActive: true },
        { title: 'Verifikasi', date: 'Tgl-Bulan-Tahun', isActive: verificationStatus === 'verified' },
        { title: 'Peserta memasuki WA grup', date: 'Tgl-Bulan-Tahun', isActive: false },
        { title: 'Pembukaan OR14', date: 'Tgl-Bulan-Tahun', isActive: false }
    ];

    // Get the greeting message based on the time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 6) return "Selamat Malam";
        if (hour < 12) return "Selamat Pagi";
        if (hour < 16) return "Selamat Siang";
        if (hour < 18) return "Selamat Sore";
        return "Selamat Malam";
    };

    // Get verification message based on status
    const getVerificationMessage = () => {
        if (!isProfileComplete) {
            return "Lengkapi profil kamu terlebih dahulu!";
        }

        switch (verificationStatus) {
            case 'verified':
                return "Profil kamu sudah lengkap!";
            case 'pending':
                return "Verifikasi kamu sedang diproses!";
            case 'rejected':
                return "Verifikasi kamu ditolak, silakan upload ulang!";
            default:
                return "Kamu belum melakukan verifikasi!";
        }
    };

    // Get verification button text
    const getVerificationButtonText = () => {
        if (!isProfileComplete) {
            return "Lengkapi Profil";
        }

        switch (verificationStatus) {
            case 'verified':
                return "Profil Lengkap";
            case 'pending':
                return "Sedang Diproses";
            case 'rejected':
                return "Upload Ulang Verifikasi";
            default:
                return "Verifikasi Sekarang";
        }
    };

    // Get button properties
    const getVerificationButtonProps = () => {
        if (!isProfileComplete) {
            return {
                disabled: false,
                destination: "/profile",
                bgColor: "bg-gradient-to-b from-[#1B054E] to-[#7449B6]",
                show: true
            };
        }

        switch (verificationStatus) {
            case 'verified':
                return {
                    disabled: true,
                    destination: "#",
                    bgColor: "bg-green-500",
                    show: false // Sembunyikan tombol ketika sudah diverifikasi
                };
            case 'pending':
                return {
                    disabled: true,
                    destination: "#",
                    bgColor: "bg-yellow-500",
                    show: true
                };
            case 'rejected':
            case null:
                return {
                    disabled: false,
                    destination: "/verification",
                    bgColor: "bg-gradient-to-b from-[#1B054E] to-[#7449B6]",
                    show: true
                };
            default:
                return {
                    disabled: false,
                    destination: "/verification",
                    bgColor: "bg-gradient-to-b from-[#1B054E] to-[#7449B6]",
                    show: true
                };
        }
    };

    // Get verification card background color
    const getVerificationCardBgColor = () => {
        switch (verificationStatus) {
            case 'verified':
                return "bg-green-500";
            case 'pending':
                return "bg-yellow-500";
            case 'rejected':
                return "bg-red-500";
            default:
                return "bg-[#AD87B5]";
        }
    };

    // Button properties
    const buttonProps = getVerificationButtonProps();

    // Determine if we should show the profile image
    const shouldShowProfileImage = profile?.photo_url && !imageError;

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

            {/* Main Content - Apply blur only on mobile */}
            <div className={`flex-1 ${isMobile && sidebarOpen ? 'blur-sm' : ''} transition-all duration-300`}
                style={{ pointerEvents: isMobile && sidebarOpen ? 'none' : 'auto' }}>
                <section className="flex-1 p-4 px-6 md:p-8 md:px-16 flex flex-col gap-4 md:gap-6 overflow-y-auto">
                    {/* Profile Component at top right */}
                    <div className="self-end">
                        <ProfileComponent />
                    </div>

                    {/* Greeting */}
                    <div>
                        <h2 className="text-secondary text-xl md:text-2xl font-semibold">
                            {getGreeting()}, {user?.name || profile?.panggilan || "Calon Peserta"}!
                        </h2>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E0771]"></div>
                        </div>
                    )}

                    {!loading && (
                        <>
                            {/* Verification Status Card */}
                            <div className={`flex flex-row items-center gap-3 md:gap-4 px-4 md:px-6 border-2 py-3 ${getVerificationCardBgColor()} rounded-xl text-white`}>
                                <MdVerifiedUser className="text-lg md:text-xl" />
                                <h2 className="text-base md:text-lg">{getVerificationMessage()}</h2>
                            </div>

                            {/* Verification Button - Hanya tampilkan jika buttonProps.show adalah true */}
                            {buttonProps.show && (
                                <Link to={buttonProps.destination} className={buttonProps.disabled ? "pointer-events-none" : ""}>
                                    <button
                                        className={`flex justify-center items-center ${buttonProps.bgColor} text-white font-bold py-3 px-8 w-full md:w-auto rounded-lg transition-all duration-300 ease-in-out ${!buttonProps.disabled ? 'hover:cursor-pointer hover:shadow-lg hover:shadow-purple-400/50 hover:scale-105 hover:from-[#2A0775] hover:to-[#8A5BD0]' : 'opacity-80'
                                            }`}
                                        disabled={buttonProps.disabled}
                                    >
                                        {getVerificationButtonText()}
                                    </button>
                                </Link>
                            )}

                            {/* Profile and Timeline - Stack on mobile, side by side on larger screens */}
                            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                {/* Profile Card */}
                                <div className="w-full md:w-2/5 bg-[#E8D9FF] py-6 md:py-8 flex flex-col place-items-center gap-3 rounded-xl text-secondary h-fit">
                                    <div className="relative border-2 p-6 md:p-8 bg-[#1E0771] text-white rounded-full overflow-hidden flex items-center justify-center" style={{ width: "120px", height: "120px" }}>
                                        {shouldShowProfileImage ? (
                                            <img
                                                src={profile.photo_url}
                                                alt="Profile"
                                                className="w-full h-full object-cover absolute inset-0"
                                                onError={handleImageError}
                                                onLoad={() => console.log('Dashboard image loaded successfully')}
                                            />
                                        ) : (
                                            <FaUser className="w-12 h-12 md:w-16 md:h-16" />
                                        )}
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold">
                                        {profile?.nama_lengkap || user?.name || "Belum diatur"}
                                    </h3>
                                    {profile ? (
                                        <>
                                            <h4 className="text-lg md:text-xl">{profile.divisi || "Divisi belum dipilih"}</h4>
                                            <h4 className="text-lg md:text-xl">{profile.sub_divisi || "Subdivisi belum dipilih"}</h4>
                                        </>
                                    ) : (
                                        <h4 className="text-sm md:text-md text-center px-16">Profil belum lengkap, silakan isi profil terlebih dahulu</h4>
                                    )}
                                </div>

                                {/* Timeline */}
                                <div className="w-full md:w-3/5 py-4 md:py-8 px-4 md:px-8">
                                    <h2 className="text-xl md:text-2xl font-bold text-secondary">
                                        Alur Kegiatan
                                    </h2>
                                    <div className="space-y-0 py-4 md:py-6">
                                        {timelineItems.map((item, index) => (
                                            <TimelineItem
                                                key={index}
                                                title={item.title}
                                                date={item.date}
                                                isActive={item.isActive}
                                                isLast={index === timelineItems.length - 1}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

TimelineItem.propTypes = {
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    isLast: PropTypes.bool.isRequired,
};

export default Dashboard;