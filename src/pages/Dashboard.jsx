import { FaUser } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import { IoMenu } from "react-icons/io5"; // Added burger menu icon
import SidebarComponent from "../Components/SidebarComponent";
import PropTypes from "prop-types";
import { useState } from "react";

const TimelineItem = ({ title, date, isActive, isLast }) => {
    return (
        <div className="flex items-start">
            {/* Circle and Line */}
            <div className="flex flex-col items-center mr-4 md:mr-6">
                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${isActive ? 'bg-[#1E0771]' : 'bg-[#7872B6]'} flex items-center justify-center z-10`}>
                </div>
                {!isLast && (
                    <div className="w-1 h-16 md:h-24 bg-[#7872B6]"></div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1">
                <div className="flex justify-between items-start flex-col md:flex-row">
                    <h3 className={`text-lg md:text-2xl font-medium ${isActive ? 'text-[#1E0771]' : 'text-[#7872B6]'}`}>
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
            </div>

            {/* Sidebar - hidden by default on mobile, shown when toggled */}
            <section className={`${sidebarOpen ? 'fixed inset-0 z-40' : 'hidden'} md:block md:sticky md:top-0 md:h-screen md:w-1/4`}>
                <SidebarComponent closeSidebar={() => setSidebarOpen(false)} />
            </section>

            {/* Main Content */}
            <section className="flex-1 p-4 md:p-8 md:pl-12 flex flex-col gap-4 md:gap-8">
                {/* Edit Profile */}
                <button className="self-end flex flex-row gap-2 md:gap-4 items-center">
                    <h2 className="text-[#2E1461] text-lg md:text-2xl font-bold">Berka Aldizar</h2>
                    <div className="border p-3 md:p-6 bg-[#372088]">
                        <FaUser className="text-white text-xl md:text-2xl" />
                    </div>
                </button>

                <div>
                    <h2 className="text-secondary text-xl md:text-3xl font-semibold">Hello Berka Aldizar Ganteng!</h2>
                </div>

                <div className="flex flex-row items-center gap-3 md:gap-6 px-4 md:px-10 border-2 py-3 md:py-4 bg-[#1f1e78] rounded-xl text-white">
                    <MdVerifiedUser className="text-2xl md:text-3xl" />
                    <h2 className="text-base md:text-xl">Waduh, Kamu Belum Verifikasi!</h2>
                </div>

                {/* Profile and Timeline - Stack on mobile, side by side on larger screens */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-0">
                    <div className="w-full md:flex-1 bg-[#EBF2FF] py-8 md:py-16 flex flex-col place-items-center gap-3 md:gap-4 rounded-xl text-secondary h-fit">
                        <div className="text-5xl md:text-8xl p-4 md:p-8 bg-[#1E0771] text-white rounded-full">
                            <FaUser />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold">Berka Aldizar</h3>
                        <h4 className="text-lg md:text-xl">Programming</h4>
                        <h4 className="text-lg md:text-xl">Web Programming</h4>
                    </div>

                    {/* Timeline */}
                    <div className="w-full md:flex-2 py-6 md:py-12 px-4 md:px-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                            Alur Kegiatan
                        </h2>
                        <div className="space-y-0 py-8 md:py-16">
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