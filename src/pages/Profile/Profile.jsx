import { useState, useEffect } from "react";
import { IoMenu, IoInformationCircle } from "react-icons/io5";
import { FaUser, FaCamera } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import SidebarComponent from "../../Components/SidebarComponent";
import ProfileComponent from "../../Components/ProfileComponent";

const Profile = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedDivision, setSelectedDivision] = useState('');
    const [selectedSubDivision, setSelectedSubDivision] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', description: '' });
    const [profileImage, setProfileImage] = useState(null);

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

    const handleDepartmentSelect = (department) => {
        setSelectedDepartment(department);
    };

    const handleInfoClick = (title, description) => {
        setModalContent({
            title,
            description
        });
        setShowModal(true);
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen h-full relative">
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

            {/* Main content - Increased left and right padding */}
            <section className={`flex-1 p-4 px-6 md:p-8 md:px-16 flex flex-col gap-4 md:gap-6 overflow-y-auto ${showModal ? 'filter blur-sm' : ''}`}>
                {/* Profile component at top right */}
                <div className="self-end">
                    <ProfileComponent />
                </div>

                {/* Page title */}
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-secondary">
                        Edit Profile
                    </h1>
                </div>

                {/* Profile picture with upload functionality */}
                <div className="self-center relative">
                    <div className="border-2 p-6 md:p-8 bg-[#1E0771] text-white rounded-full relative overflow-hidden flex items-center justify-center" style={{ width: "250px", height: "250px" }}>
                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover absolute inset-0"
                            />
                        ) : (
                            <FaUser className="w-20 h-20 md:w-24 md:h-24" />
                        )}
                    </div>
                    <label htmlFor="profile-upload" className="absolute bottom-2 right-2 bg-white text-[#1E0771] p-2 rounded-full cursor-pointer z-20 shadow-md hover:bg-gray-100">
                        <FaCamera className="w-5 h-5 md:w-6 md:h-6" />
                    </label>
                    <input
                        type="file"
                        id="profile-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                    />
                </div>

                {/* Form */}
                <form className="flex flex-col gap-6 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-base md:text-lg">Nama Lengkap</label>
                            <input type="text" className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold" placeholder="Masukan Nama Lengkap" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-base md:text-lg">Nama Panggilan</label>
                            <input type="text" className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold" placeholder="Masukan Nama Panggilan" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-base md:text-lg">NIM</label>
                            <input type="text" className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold" placeholder="Masukan NIM" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-base md:text-lg">Email</label>
                            <input type="email" className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold" placeholder="neotelemetri@example.com" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-base md:text-lg">No Whatsapp</label>
                            <input type="text" className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold" placeholder="Masukan nomor wa" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-base md:text-lg">Program Studi</label>
                            <input type="text" className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold" placeholder="Pilih Sub Divisi" />
                        </div>

                        {/* Radio Button Department */}
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="font-semibold text-base md:text-lg mb-3 text-center">Departemen yang Diminati</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    className={`border-2 border-[#2d2460] rounded-lg p-4 flex justify-between items-center cursor-pointer ${selectedDepartment === 'organisasi' ? 'bg-[#2d2460] text-white' : 'bg-white'}`}
                                    onClick={() => handleDepartmentSelect('organisasi')}
                                >
                                    <span className="text-base md:text-lg">Organisasi</span>
                                    <button
                                        type="button"
                                        className={`rounded-full p-1 cursor-pointer ${selectedDepartment === 'organisasi' ? 'text-[#2d2460] bg-white' : 'text-white bg-[#2d2460]'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleInfoClick('Organisasi', 'Departemen Organisasi adalah departemen yang bertanggung jawab untuk mengatur struktur, koordinasi, dan manajemen organisasi.');
                                        }}
                                    >
                                        <IoInformationCircle className="w-5 h-5" />
                                    </button>
                                </div>
                                <div
                                    className={`border-2 border-[#2d2460] rounded-lg p-4 flex justify-between items-center cursor-pointer ${selectedDepartment === 'operasional' ? 'bg-[#2d2460] text-white' : 'bg-white'}`}
                                    onClick={() => handleDepartmentSelect('operasional')}
                                >
                                    <span className="text-base md:text-lg">Operasional</span>
                                    <button
                                        type="button"
                                        className={`rounded-full p-1 cursor-pointer ${selectedDepartment === 'operasional' ? 'text-[#2d2460] bg-white' : 'text-white bg-[#2d2460]'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleInfoClick('Operasional', 'Departemen Operasional adalah departemen yang bertanggung jawab untuk menjalankan kegiatan operasional sehari-hari.');
                                        }}
                                    >
                                        <IoInformationCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Divisi */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-base md:text-lg">Divisi</label>
                            <div className="relative">
                                <select
                                    className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold appearance-none"
                                    value={selectedDivision}
                                    onChange={(e) => setSelectedDivision(e.target.value)}
                                >
                                    <option value="">Pilih Sub Divisi</option>
                                    <option value="programming">Programming</option>
                                    <option value="multimedia">Multimedia & Design</option>
                                    <option value="skj">Sistem Komputer & Jaringan</option>
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Sub Divisi */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-base md:text-lg">Subdivisi</label>
                            <div className="relative">
                                <select
                                    className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold appearance-none"
                                    value={selectedSubDivision}
                                    onChange={(e) => setSelectedSubDivision(e.target.value)}
                                    disabled={!selectedDivision}
                                >
                                    <option value="">Pilih Sub Divisi</option>
                                    {selectedDivision === 'programming' && (
                                        <>
                                            <option value="web">Web Programming</option>
                                            <option value="mobile">Mobile Programming</option>
                                            <option value="game">Machine Learning</option>
                                        </>
                                    )}
                                    {selectedDivision === 'multimedia' && (
                                        <>
                                            <option value="graphic">UIUX</option>
                                            <option value="video">Video Editing</option>
                                            <option value="3d">3D</option>
                                        </>
                                    )}
                                    {selectedDivision === 'skj' && (
                                        <>
                                            <option value="network">Network Engineer</option>
                                            <option value="sysadmin">System Engineer</option>
                                        </>
                                    )}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Link Twibbon */}
                    <div className="mt-4 md:mt-6">
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="font-semibold text-base md:text-lg">Link Twibbon</label>
                            <input
                                type="url"
                                className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold"
                                placeholder="Masukkan link twibbon anda"
                            />
                        </div>
                    </div>

                    {/* Password Change */}
                    <div className="mt-6 md:mt-8">
                        <h2 className="text-xl md:text-2xl font-bold text-secondary mb-4">
                            Ganti Password
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-base md:text-lg">Password Lama</label>
                                <input type="password" className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold" placeholder="Masukkan password lama" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-base md:text-lg">Password Baru</label>
                                <input type="password" className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold" placeholder="Masukkan password baru" />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center md:justify-start mt-6 md:mt-8">
                        <button
                            type="submit"
                            className="w-full py-3 md:py-4 border-2 border-[#2E1461] bg-[#2E1461] text-white rounded-xl text-base md:text-lg font-semibold hover:bg-white hover:text-[#1E0771] transition duration-300"
                        >
                            Simpan!
                        </button>
                    </div>
                </form>

                {/* Background images - only visible on larger screens */}
                <img
                    src="/assets/bg/Ellipse31.svg"
                    alt="Decor 1"
                    className="absolute top-0 right-0 hidden lg:block -z-10"
                />

                <img
                    src="/assets/bg/Ellipse32.svg"
                    alt="Decor 2"
                    className="absolute top-[55%] right-[55%] hidden lg:block -z-10"
                />
            </section>

            {/* Modal for info display - not blurred */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <MdClose className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="border-2 border-[#2d2460] rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-2">{modalContent.title}</h3>
                            <p className="text-base text-gray-700">
                                Departemen {modalContent.title} adalah departemen yang bertanggung jawab untuk
                                {modalContent.title === 'Organisasi'
                                    ? ' mengatur struktur, koordinasi, dan manajemen organisasi.'
                                    : ' menjalankan kegiatan operasional sehari-hari dan berbagai proses teknis.'}
                            </p>
                            <p className="mt-2 text-gray-500">
                                ...........................................................................
                                ...........................................................................
                                ...........................................................................
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;