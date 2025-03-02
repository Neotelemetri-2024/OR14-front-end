import { MdArrowCircleLeft, MdHome, MdInsertDriveFile, MdVerifiedUser } from "react-icons/md";
import { useLocation, Link } from "react-router-dom";

const SidebarComponent = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    // Helper function to determine if a path is active
    const isActive = (path) => {
        return currentPath.includes(path);
    };

    const baseButtonClass = "flex flex-row gap-10 text-2xl items-center px-20 py-4 font-bold hover:cursor-pointer";
    const activeClass = "bg-white text-[#2d2460] font-semibold";
    const inactiveClass = "text-white hover:bg-white hover:text-[#2d2460] hover:font-semibold";

    return (
        <div className="h-full bg-[url('/assets/sidebar/sidebar.svg')] bg-cover bg-no-repeat flex flex-col justify-start">
            <img src="/assets/sidebar/or14white.svg" className="p-2" alt="Logo" />
            <div className="w-full flex flex-col gap-8 mt-24">
                <Link to="/dashboard" className={`${baseButtonClass} ${isActive('/dashboard') && !isActive('/verification') && !isActive('/exam') ? activeClass : inactiveClass}`}>
                    <MdHome className="text-4xl" />
                    <h2>
                        Dashboard
                    </h2>
                </Link>
                <Link to="/verification" className={`${baseButtonClass} ${isActive('/verification') ? activeClass : inactiveClass}`}>
                    <MdVerifiedUser className="text-4xl" />
                    <h2>
                        Verifikasi
                    </h2>
                </Link>
                <Link to="/exam" className={`${baseButtonClass} ${isActive('/exam') ? activeClass : inactiveClass}`}>
                    <MdInsertDriveFile className="text-4xl" />
                    <h2>
                        Ujian
                    </h2>
                </Link>
            </div>
            <button className="flex flex-row items-center justify-start w-full px-20 gap-10 text-white text-2xl hover:bg-white hover:text-[#2d2460] hover:font-semibold py-4 font-bold hover:cursor-pointer mb-10 mt-auto">
                <MdArrowCircleLeft className="text-4xl" />
                <h2>
                    Keluar
                </h2>
            </button>
        </div>
    );
};

export default SidebarComponent;