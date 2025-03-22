import { FaUser } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import SidebarComponent from "../Components/SidebarComponent";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import ProfileComponent from "../Components/ProfileComponent";

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
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

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

    const timelineItems = [
        { title: 'Pendaftaran', date: '1 - 7 April 2025', isActive: true },
        { title: 'Verifikasi', date: 'Tgl-Bulan-Tahun', isActive: false },
        { title: 'Peserta memasuki WA grup', date: 'Tgl-Bulan-Tahun', isActive: false },
        { title: 'Pembukaan OR14', date: 'Tgl-Bulan-Tahun', isActive: false }
    ]

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
                {/* Edit Profile */}
                <div className="self-end">
                    <ProfileComponent />
                </div>

                <div>
                    <h2 className="text-secondary text-xl md:text-2xl font-semibold">Hello Berka Aldizar Ganteng!</h2>
                </div>

                <div className="flex flex-row items-center gap-3 md:gap-4 px-4 md:px-6 border-2 py-3 md:py-4 bg-[#AD87B5] rounded-xl text-white">
                    <MdVerifiedUser className="text-lg md:text-xl" />
                    <h2 className="text-base md:text-xl">Waduh, Kamu Belum Verifikasi!</h2>
                </div>

                <button className="flex justify-center items-center bg-gradient-to-b from-[#1B054E] to-[#7449B6] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out hover:cursor-pointer hover:shadow-lg hover:shadow-purple-400/50 hover:scale-105 hover:from-[#2A0775] hover:to-[#8A5BD0]">
                    Verifikasi Sekarang
                </button>



                {/* Profile and Timeline - Stack on mobile, side by side on larger screens */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">

                    <div className="w-full md:w-2/5 bg-[#E8D9FF] py-6 md:py-8 flex flex-col place-items-center gap-3 md:gap-4 rounded-xl text-secondary h-fit">
                        <div className="text-4xl md:text-6xl p-4 md:p-5 bg-[#1E0771] text-white rounded-full">
                            <FaUser />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold">Berka Aldizar</h3>
                        <h4 className="text-lg md:text-xl">Programming</h4>
                        <h4 className="text-lg md:text-xl">Web Programming</h4>
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

                {/* Background images - only visible on larger screens */}
                {/* <img
                    src="/assets/bg/Ellipse31.svg"
                    alt="Decor 1"
                    className="absolute top-0 right-0 hidden lg:block -z-10"
                />

                <img
                    src="/assets/bg/Ellipse32.svg"
                    alt="Decor 2"
                    className="absolute top-[55%] right-[55%] hidden lg:block -z-10"
                /> */}
            </section>
        </div>
    )
}

TimelineItem.propTypes = {
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    isLast: PropTypes.bool.isRequired,
}

export default Dashboard;