import { MdArrowCircleLeft, MdHome, MdInsertDriveFile, MdVerifiedUser, MdClose } from "react-icons/md";
import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";

const SidebarComponent = ({ closeSidebar }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    // Helper function to determine if a path is active
    const isActive = (path) => {
        return currentPath.includes(path);
    };

    const baseButtonClass = "flex flex-row gap-4 md:gap-10 text-xl md:text-2xl items-center px-6 md:px-20 py-4 font-bold hover:cursor-pointer";
    const activeClass = "bg-white text-[#2d2460] font-semibold";
    const inactiveClass = "text-white hover:bg-white hover:text-[#2d2460]";

    const handleLinkClick = () => {
        if (closeSidebar) {
            closeSidebar();
        }
    };

    return (
        <div className="h-full min-h-screen bg-[url('/assets/sidebar/sidebar.svg')] bg-cover bg-no-repeat flex flex-col justify-start relative ">
            <div className="flex justify-between items-center px-16 py-8 md:p-2" >
                <img src="/assets/sidebar/or14white.svg" alt="Logo" />
                {/* Close button for mobile */}
                {
                    closeSidebar && (
                        <button onClick={closeSidebar} className="md:hidden text-white text-3xl p-2">
                            <MdClose />
                        </button>
                    )
                }
            </div >

            <div className="w-full flex flex-col gap-4 md:gap-8 mt-12 md:mt-24">
                <Link
                    to="/dashboard"
                    onClick={handleLinkClick}
                    className={`${baseButtonClass} ${isActive('/dashboard') && !isActive('/verification') && !isActive('/preparation') ? activeClass : inactiveClass}`}
                >
                    <MdHome className="text-2xl md:text-3xl" />
                    <h2>
                        Dashboard
                    </h2>
                </Link>
                <Link
                    to="/verification"
                    onClick={handleLinkClick}
                    className={`${baseButtonClass} ${isActive('/verification') ? activeClass : inactiveClass}`}
                >
                    <MdVerifiedUser className="text-2xl md:text-3xl" />
                    <h2>
                        Verifikasi
                    </h2>
                </Link>
                <Link
                    to="/preparation"
                    onClick={handleLinkClick}
                    className={`${baseButtonClass} ${isActive('/preparation') ? activeClass : inactiveClass}`}
                >
                    <MdInsertDriveFile className="text-2xl md:text-3xl" />
                    <h2>
                        Ujian
                    </h2>
                </Link>
            </div>
            <button
                onClick={handleLinkClick}
                className="flex flex-row items-center justify-start w-full px-6 md:px-20 gap-4 md:gap-10 text-white text-xl md:text-2xl hover:bg-white hover:text-[#2d2460] hover:font-semibold py-4 font-bold hover:cursor-pointer mb-10 mt-auto"
            >
                <MdArrowCircleLeft className="text-3xl md:text-4xl" />
                <h2>
                    Keluar
                </h2>
            </button>
        </div >
    );
};

SidebarComponent.propTypes = {
    closeSidebar: PropTypes.func
};

export default SidebarComponent;