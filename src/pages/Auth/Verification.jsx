import { useState } from "react";
import { FaUser, FaFileAlt, FaFilePdf, FaFileImage } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import SidebarComponent from "../../Components/SidebarComponent";

const Verification = () => {
    const [krsFile, setKrsFile] = useState(null);
    const [paymentFile, setPaymentFile] = useState(null);

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
            return <FaFileImage className="text-6xl text-blue-500" />;
        } else if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
            return <FaFilePdf className="text-6xl text-red-500" />;
        } else {
            return <FaFileAlt className="text-6xl text-gray-600" />;
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

    // Fungsi untuk menampilkan preview atau ikon file
    const renderFilePreview = (file, fileType) => {
        if (!file) {
            return (
                <div className="text-center">
                    <p className="text-gray-500 mb-2">Klik &quot;Ganti File&quot; untuk mengunggah</p>
                    <p className="text-gray-400 text-sm">Format: PDF, JPG</p>
                </div>
            );
        }

        const preview = getFilePreview(file);

        if (preview) {
            return (
                <img
                    src={preview}
                    alt={`${fileType} Preview`}
                    className="max-h-56 max-w-full object-contain"
                />
            );
        } else {
            return (
                <div className="flex flex-col items-center justify-center">
                    {getFileIcon(file)}
                    <p className="text-center text-gray-700 mt-2">
                        {file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name}
                    </p>
                    <p className="text-center text-gray-500 text-sm mt-1">
                        {(file.size / 1024).toFixed(1)} KB
                    </p>
                </div>
            );
        }
    };

    return (
        <div className="flex flex-row">
            <section className="lg:flex-1 flex-2">
                <SidebarComponent />
            </section>
            {/* Edit Profile */}
            <section className="lg:flex-4 flex-3 p-8 pl-20 gap-8 flex flex-col">
                <button className="self-end flex flex-row gap-4 items-center">
                    <h2 className="text-[#2E1461] text-2xl font-bold">Berka Aldizar</h2>
                    <div className="border p-6 bg-[#372088]">
                        <FaUser className="text-white text-2xl" />
                    </div>
                </button>

                <div>
                    <h2 className="text-secondary text-3xl font-bold mt-6">
                        Upload berkas yang diperlukan disini
                    </h2>
                    <div className="grid grid-cols-2 gap-12 mt-24 p-4">
                        <div>
                            <h3 className="text-2xl font-semibold mb-12">Scan KRS</h3>
                            <div className="w-full bg-[#EBF2FF] p-4 h-72 rounded-2xl flex flex-col justify-center items-center relative">
                                {renderFilePreview(krsFile, "KRS")}
                                {krsFile && (
                                    <div className="absolute bottom-4 left-0 right-0 bg-white bg-opacity-80 p-2 text-center">
                                        <p className="truncate text-lg font-medium">{krsFile.name}</p>
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
                                className="w-3/4 border-2 py-8 rounded-xl mt-12 text-secondary border-secondary text-2xl font-bold hover:bg-secondary hover:text-white hover:cursor-pointer block text-center"
                            >
                                Ganti File
                            </label>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-12">Bukti Pembayaran</h3>
                            <div className="w-full bg-[#EBF2FF] p-4 h-72 rounded-2xl flex flex-col justify-center items-center relative">
                                {renderFilePreview(paymentFile, "Payment")}
                                {paymentFile && (
                                    <div className="absolute bottom-4 left-0 right-0 bg-white bg-opacity-80 p-2 text-center">
                                        <p className="truncate text-lg font-medium">{paymentFile.name}</p>
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
                                className="w-3/4 border-2 py-8 rounded-xl mt-12 text-secondary border-secondary text-2xl font-bold hover:bg-secondary hover:text-white hover:cursor-pointer block text-center"
                            >
                                Ganti File
                            </label>
                        </div>
                        <button
                            onClick={handleSubmit}
                            className={`w-3/4 border-2 py-8 rounded-xl mt-12 text-white bg-[#1E0771] text-2xl font-bold hover:bg-secondary hover:cursor-pointer ${!krsFile || !paymentFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!krsFile || !paymentFile}
                        >
                            Kirim
                        </button>
                    </div>
                    <div className="flex flex-row text-white place-items-center w-full bg-[#1E0771] py-6 px-8 text-2xl gap-6 mt-12 rounded-xl mx-4">
                        <MdVerifiedUser className="text-4xl" />
                        <h2 className="">
                            Verifikasi Berhasil!
                        </h2>
                    </div>
                </div>
            </section>

            <img
                src="/assets/bg/Ellipse31.svg"
                alt="Decor 1"
                className="absolute top-[0%] right-[0%] hidden lg:block"
            />

            <img
                src="/assets/bg/Ellipse32.svg"
                alt="Decor 1"
                className="absolute top-[55%] right-[55%] hidden lg:block -z-10"
            />

        </div>
    );
};

export default Verification;