import { MdArrowCircleLeft, MdHome, MdInsertDriveFile, MdVerifiedUser } from "react-icons/md";

const SidebarComponent = () => {
    return (
        <div className="lg:h-screen h-full bg-[url('/assets/sidebar/sidebar.svg')] bg-cover bg-no-repeat flex flex-col justify-between">
            <img src="/assets/sidebar/or14white.svg" className="p-2" />
            <div className="w-full flex flex-col gap-8">
                <button className="flex flex-row gap-10 text-white text-2xl items-center hover:bg-white hover:text-[#2d2460] hover:font-semibold px-20 py-4 font-bold hover:cursor-pointer">
                    <MdHome className="text-4xl" />
                    <h2>
                        Dashboard
                    </h2>
                </button>
                <button className="flex flex-row gap-10 text-white text-2xl items-center hover:bg-white hover:text-[#2d2460] hover:font-semibold px-20 py-4 font-bold hover:cursor-pointer">
                    <MdVerifiedUser className="text-4xl" />
                    <h2>
                        Verifikasi
                    </h2>
                </button>
                <button className="flex flex-row gap-10 text-white text-2xl items-center hover:bg-white hover:text-[#2d2460] hover:font-semibold px-20 py-4 font-bold hover:cursor-pointer">
                    <MdInsertDriveFile className="text-4xl" />
                    <h2>
                        Ujian
                    </h2>
                </button>
            </div>
            <button className="flex flex-row items-center justify-start w-full px-20 gap-10 text-white text-2xl hover:bg-white hover:text-[#2d2460] hover:font-semibold py-4 font-bold hover:cursor-pointer mb-10">
                <MdArrowCircleLeft className="text-4xl" />
                <h2>
                    Keluar
                </h2>
            </button>
        </div>
    )
}

export default SidebarComponent;