import { useState } from "react";
import { FaUser, FaFileAlt, FaFilePdf, FaFileImage } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import SidebarComponent from "../../Components/SidebarComponent";

const Verification = () => {
    const [krsFile, setKrsFile] = useState(null);
    const [paymentFile, setPaymentFile] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
            // Disini Anda akan mengirim file ke server
            // Untuk contoh ini, kita hanya menampilkan pesan sukses
        }
    };

    const getFileIcon = (file) => {
        if (!file) return <FaFileAlt />;

        const fileType = file.type;
        const fileName = file.name.toLowerCase();

        if (fileType.startsWith("image/")) {
            return <FaFileImage className="text-4xl md:text-6xl text-blue-500" />;
        } else if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
            return <FaFilePdf className="text-4xl md:text-6xl text-red-500" />;
        } else {
            return <FaFileAlt className="text-4xl md:text-6xl text-gray-600" />;
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
                    <p className="text-gray-500 mb-2 text-sm md:text-base">Klik &quot;Ganti File&quot; untuk mengunggah</p>
                    <p className="text-gray-400 text-xs md:text-sm">Format: PDF, JPG</p>
                </div>
            );
        }

        const preview = getFilePreview(file);

        if (preview) {
            return (
                <img
                    src={preview}
                    alt={`${fileType} Preview`}
                    className="max-h-28 md:max-h-56 max-w-full object-contain"
                />
            );
        } else {
            return (
                <div className="flex flex-col items-center justify-center">
                    {getFileIcon(file)}
                    <p className="text-center text-gray-700 mt-2 text-sm md:text-base">
                        {file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name}
                    </p>
                    <p className="text-center text-gray-500 text-xs md:text-sm mt-1">
                        {(file.size / 1024).toFixed(1)} KB
                    </p>
                </div>
            );
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-white">
            {/* Mobile Header with Burger Menu */}
            <div className="md:hidden bg-[#2d2460] p-4 flex justify-between items-center sticky top-0 z-50">
                <button onClick={toggleSidebar} className="text-white text-3xl">
                    <IoMenu />
                </button>
            </div>

            {/* Sidebar - hidden by default on mobile, shown when toggled */}
            <div className={`${sidebarOpen ? 'fixed inset-0 z-40' : 'hidden'} md:block md:w-1/4 h-full`}>
                <div className="md:fixed md:w-1/4 md:h-full">
                    <SidebarComponent closeSidebar={() => setSidebarOpen(false)} />
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 md:pl-12 flex flex-col gap-4 md:gap-8 relative">
                {/* User Profile Button */}
                <button className="self-end flex flex-row gap-2 md:gap-4 items-center">
                    <h2 className="text-[#2E1461] text-lg md:text-2xl font-bold">Berka Aldizar</h2>
                    <div className="border p-3 md:p-6 bg-[#372088]">
                        <FaUser className="text-white text-xl md:text-2xl" />
                    </div>
                </button>

                <div>
                    <h2 className="text-secondary text-xl md:text-3xl font-bold mt-2 md:mt-4">
                        Upload berkas yang diperlukan disini
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mt-6 p-2 md:p-4">
                        <div>
                            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-8">Scan KRS</h3>
                            <div className="w-full bg-[#EBF2FF] p-4 h-48 md:h-72 rounded-2xl flex flex-col justify-center items-center relative">
                                {renderFilePreview(krsFile, "KRS")}
                                {krsFile && (
                                    <div className="absolute bottom-4 left-0 right-0 bg-white bg-opacity-80 p-2 text-center">
                                        <p className="truncate text-sm md:text-lg font-medium">{krsFile.name}</p>
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
                                className="w-full md:w-3/4 border-2 py-3 md:py-6 rounded-xl mt-4 md:mt-8 text-secondary border-secondary text-lg md:text-2xl font-bold hover:bg-secondary hover:text-white hover:cursor-pointer block text-center"
                            >
                                Ganti File
                            </label>
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-8">Bukti Pembayaran</h3>
                            <div className="w-full bg-[#EBF2FF] p-4 h-48 md:h-72 rounded-2xl flex flex-col justify-center items-center relative">
                                {renderFilePreview(paymentFile, "Payment")}
                                {paymentFile && (
                                    <div className="absolute bottom-4 left-0 right-0 bg-white bg-opacity-80 p-2 text-center">
                                        <p className="truncate text-sm md:text-lg font-medium">{paymentFile.name}</p>
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
                                className="w-full md:w-3/4 border-2 py-3 md:py-6 rounded-xl mt-4 md:mt-8 text-secondary border-secondary text-lg md:text-2xl font-bold hover:bg-secondary hover:text-white hover:cursor-pointer block text-center"
                            >
                                Ganti File
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-center md:justify-start mt-6 md:mt-10">
                        <button
                            onClick={handleSubmit}
                            className={`w-full border-2 py-3 md:py-6 rounded-xl text-white bg-[#1E0771] text-lg md:text-2xl font-bold hover:bg-secondary hover:cursor-pointer ${!krsFile || !paymentFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!krsFile || !paymentFile}
                        >
                            Kirim
                        </button>
                    </div>

                    <div className="flex flex-row text-white place-items-center w-full bg-[#1E0771] py-3 md:py-6 px-4 md:px-8 text-lg md:text-2xl gap-3 md:gap-6 mt-6 md:mt-10 rounded-xl">
                        <MdVerifiedUser className="text-2xl md:text-4xl" />
                        <h2 className="">
                            Verifikasi Berhasil!
                        </h2>
                    </div>
                </div>

                {/* Background images - only visible on larger screens */}
                <img
                    src="/assets/bg/Ellipse31.svg"
                    alt="Decor 1"
                    className="absolute top-0 right-0 hidden lg:block"
                />

                <img
                    src="/assets/bg/Ellipse32.svg"
                    alt="Decor 2"
                    className="absolute top-[55%] right-[55%] hidden lg:block -z-10"
                />
            </main>
        </div>
    );
};

export default Verification;