import { FaUser } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import SidebarComponent from "../Components/SidebarComponent";
import PropTypes from "prop-types";

const TimelineItem = ({ title, date, isActive, isLast }) => {
    return (
        <div className="flex items-start">
            {/* Circle and Line */}
            <div className="flex flex-col items-center mr-6">

                <div className={`w-6 h-6 rounded-full ${isActive ? 'bg-[#1E0771]' : 'bg-[#7872B6]'} flex items-center justify-center z-10`}>
                </div>
                {!isLast && (
                    <div className="w-1 h-24 bg-[#7872B6]"></div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h3 className={`text-lg font-medium ${isActive ? 'text-[#1E0771]' : 'text-[#7872B6]'}`}>
                        {title}
                    </h3>
                    <span className={`${isActive ? 'text-[#1E0771]' : 'text-[#7872B6]'} ml-4 font-bold`}>{date}</span>
                </div>
            </div>
        </div >
    );
};

const Dashboard = () => {

    const timelineItems = [
        { title: 'Pendaftaran', date: '1 - 7 April 2025', isActive: true },
        { title: 'Verifikasi', date: 'Tgl-Bulan-Tahun', isActive: false },
        { title: 'Peserta memasuki WA grup', date: 'Tgl-Bulan-Tahun', isActive: false },
        { title: 'Pembukaan OR14', date: 'Tgl-Bulan-Tahun', isActive: false }
    ]

    return (
        <div className="flex flex-row">
            {/* Sidebar */}
            <section className="lg:flex-1 flex-2">
                <SidebarComponent />
            </section>

            {/* Main Content */}
            <section className="lg:flex-4 flex-3 flex flex-col p-8 pl-20 gap-8">
                {/* Edit Profile */}
                <button className="self-end flex flex-row gap-4 items-center">
                    <h2 className="text-[#2E1461] text-2xl font-bold">Berka Aldizar</h2>
                    <div className="border p-6 bg-[#372088]">
                        <FaUser className="text-white text-2xl" />
                    </div>
                </button>

                <div>
                    <h2 className="text-secondary text-3xl font-semibold mt-12">Hello Berka Aldizar Ganteng!</h2>
                </div>

                <div className="flex flex-row items-center gap-6 px-10 border-2 py-4 bg-[#1f1e78] rounded-xl text-white">
                    <MdVerifiedUser className="text-3xl" />
                    <h2 className="text-xl">Waduh, Kamu Belum Verifikasi!</h2>
                </div>

                {/* Profile */}
                <div className="flex flex-row">
                    <div className="flex-1 bg-[#EBF2FF] py-16 flex flex-col place-items-center gap-4 rounded-xl text-secondary h-fit" >
                        <div className="text-8xl p-8 bg-[#1E0771] text-white rounded-full">
                            <FaUser />
                        </div>
                        <h3 className="text-2xl font-bold ">Berka Aldizar</h3>
                        <h4>Programming</h4>
                        <h4>Web Programming</h4>
                    </div>

                    {/* Timeline */}
                    <div className="flex-2 py-12 px-16">
                        <h2 className="text-3xl font-bold text-secondary">
                            Alur Kegiatan
                        </h2>
                        <div className="space-y-0 py-16">
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