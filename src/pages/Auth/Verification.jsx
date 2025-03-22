import { useState, useEffect } from "react";
import { FaFileAlt, FaFilePdf, FaFileImage } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import SidebarComponent from "../../Components/SidebarComponent";
import ProfileComponent from "../../Components/ProfileComponent";

const Verification = () => {
    const [krsFile, setKrsFile] = useState(null);
    const [paymentFile, setPaymentFile] = useState(null);
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

    const handleKrsFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setKrsFile(file);
        }
    };

    const handlePaymentFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPaymentFile(file);
        }
    };

    const handleSubmit = () => {
        if (krsFile && paymentFile) {
            // Di sini Anda akan mengirim file ke server
            // Untuk contoh ini, kita hanya menampilkan pesan sukses
        }
    };

    const getFileIcon = (file) => {
        if (!file) return <FaFileAlt />;

        const fileType = file.type;
        const fileName = file.name.toLowerCase();

        if (fileType.startsWith("image/")) {
            return <FaFileImage className="text-3xl md:text-4xl text-blue-500" />;
        } else if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
            return <FaFilePdf className="text-3xl md:text-4xl text-red-500" />;
        } else {
            return <FaFileAlt className="text-3xl md:text-4xl text-gray-600" />;
        }
    };

    const getFilePreview = (file) => {
        if (!file) return null;

        const fileType = file.type;

        if (fileType.startsWith("image/")) {
            return URL.createObjectURL(file);
        }

        return null;
    };

    const renderFilePreview = (file, fileType) => {
        if (!file) {
            return (
                <div className="text-center">
                    <p className="text-gray-500 mb-2 text-sm">Klik &quot;Ganti File&quot; untuk mengunggah</p>
                    <p className="text-gray-400 text-xs">Format: PDF, JPG</p>
                </div>
            );
        }

        const preview = getFilePreview(file);

        if (preview) {
            return (
                <img
                    src={preview}
                    alt={`${fileType} Preview`}
                    className="max-h-24 md:max-h-40 max-w-full object-contain"
                />
            );
        } else {
            return (
                <div className="flex flex-col items-center justify-center">
                    {getFileIcon(file)}
                    <p className="text-center text-gray-700 mt-2 text-xs md:text-sm">
                        {file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name}
                    </p>
                    <p className="text-center text-gray-500 text-xs mt-1">
                        {(file.size / 1024).toFixed(1)} KB
                    </p>
                </div>
            );
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen h-full">
            {/* Mobile Header with Burger Menu */}
            <div className="md:hidden bg-[#2d2460] p-4 flex justify-between items-center sticky top-0 z-50">
                <button onClick={toggleSidebar} className="text-white text-3xl">
                    <IoMenu />
                </button>
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
                    {/* Edit Profile */}
                    <div className="self-end">
                        <ProfileComponent />
                    </div>

                    <div>
                        <h2 className="text-secondary text-lg md:text-xl font-bold mt-2">
                            Upload berkas yang diperlukan di sini
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-4 p-2">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Scan KRS</h3>
                                <div className="w-full bg-[#EBF2FF] p-3 h-40 md:h-52 rounded-xl flex flex-col justify-center items-center relative">
                                    {renderFilePreview(krsFile, "KRS")}
                                    {krsFile && (
                                        <div className="absolute bottom-2 left-0 right-0 bg-white bg-opacity-80 p-1 text-center">
                                            <p className="truncate text-xs md:text-sm font-medium">{krsFile.name}</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="krsFileInput"
                                    className="hidden"
                                    onChange={handleKrsFileChange}
                                    accept=".pdf"
                                />
                                <label
                                    htmlFor="krsFileInput"
                                    className="w-full md:w-3/4 border-2 py-2 md:py-3 rounded-lg mt-3 text-secondary border-secondary text-sm md:text-base font-bold hover:bg-secondary hover:text-white hover:cursor-pointer block text-center"
                                >
                                    Ganti File
                                </label>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Bukti Pembayaran</h3>
                                <div className="w-full bg-[#EBF2FF] p-3 h-40 md:h-52 rounded-xl flex flex-col justify-center items-center relative">
                                    {renderFilePreview(paymentFile, "Payment")}
                                    {paymentFile && (
                                        <div className="absolute bottom-2 left-0 right-0 bg-white bg-opacity-80 p-1 text-center">
                                            <p className="truncate text-xs md:text-sm font-medium">{paymentFile.name}</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="paymentFileInput"
                                    className="hidden"
                                    onChange={handlePaymentFileChange}
                                    accept=".pdf,.jpg,.jpeg"
                                />
                                <label
                                    htmlFor="paymentFileInput"
                                    className="w-full md:w-3/4 border-2 py-2 md:py-3 rounded-lg mt-3 text-secondary border-secondary text-sm md:text-base font-bold hover:bg-secondary hover:text-white hover:cursor-pointer block text-center"
                                >
                                    Ganti File
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-center md:justify-start mt-4 md:mt-6">
                            <button
                                onClick={handleSubmit}
                                className={`w-full md:w-1/2 border-2 py-2 md:py-3 rounded-lg text-white bg-[#1E0771] text-sm md:text-base font-bold hover:bg-secondary hover:cursor-pointer ${!krsFile || !paymentFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!krsFile || !paymentFile}
                            >
                                Kirim
                            </button>
                        </div>

                        <div className="flex flex-row text-white place-items-center w-full bg-[#1E0771] py-2 md:py-3 px-3 md:px-5 text-sm md:text-base gap-2 md:gap-4 mt-4 md:mt-6 rounded-lg">
                            <MdVerifiedUser className="text-xl md:text-2xl" />
                            <h2>
                                Verifikasi Berhasil!
                            </h2>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Verification;