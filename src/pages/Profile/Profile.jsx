import { useState, useEffect } from "react";
import { IoMenu, IoInformationCircle } from "react-icons/io5";
import { FaUser, FaCamera } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import SidebarComponent from "../../components/SidebarComponent";
import ProfileComponent from "../../components/ProfileComponent";
import { useProfile } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Profile = () => {
    const { user } = useAuth();
    const { profile, loading, saveProfile } = useProfile();

    // UI states
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedDivision, setSelectedDivision] = useState('');
    const [selectedSubDivision, setSelectedSubDivision] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        panggilan: '',
        nim: '',
        whatsapp: '',
        program_studi: '',
        departemen: '',
        divisi: '',
        sub_divisi: '',
        twibbon: '',
    });
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

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

    // Populate form when profile data is loaded
    useEffect(() => {
        if (profile) {
            setFormData({
                nama_lengkap: profile.nama_lengkap || '',
                panggilan: profile.panggilan || '',
                nim: profile.nim || '',
                whatsapp: profile.whatsapp || '',
                program_studi: profile.program_studi || '',
                departemen: profile.departemen || '',
                divisi: profile.divisi || '',
                sub_divisi: profile.sub_divisi || '',
                twibbon: profile.twibbon || '',
            });

            setSelectedDepartment(profile.departemen || null);
            setSelectedDivision(profile.divisi || '');
            setSelectedSubDivision(profile.sub_divisi || '');

            // Set profile image preview if exists
            if (profile.photo_url) {
                setImagePreview(profile.photo_url);
            }
        }

        // Populate email from auth user if available
        if (user?.email) {
            setFormData(prev => ({
                ...prev,
                email: user.email
            }));
        }
    }, [profile, user]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleDepartmentSelect = (department) => {
        setSelectedDepartment(department);
        setFormData(prev => ({
            ...prev,
            departemen: department
        }));

        // Clear any error on this field
        if (errors.departemen) {
            setErrors(prev => ({ ...prev, departemen: null }));
        }
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
            setProfileImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;

        // If divisi is changed, reset sub_divisi
        if (name === 'divisi') {
            setSelectedDivision(value);
            setSelectedSubDivision('');
            setFormData(prev => ({
                ...prev,
                [name]: value,
                sub_divisi: ''
            }));
        } else if (name === 'sub_divisi') {
            setSelectedSubDivision(value);
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields validation
        const requiredFields = [
            'nama_lengkap',
            'panggilan',
            'nim',
            'whatsapp',
            'program_studi',
            'divisi',
            'sub_divisi'
        ];

        // Check if this is an update (profile exists) or a new profile
        const isUpdate = !!profile;

        requiredFields.forEach(field => {
            // For updates, only validate fields that were modified
            if (isUpdate) {
                // Only validate if the field has been changed and is empty
                const originalValue = profile[field] || '';
                const currentValue = formData[field] || '';

                // If the field was changed to empty, it's an error
                if (originalValue !== currentValue && !currentValue) {
                    newErrors[field] = `${field.replace('_', ' ').charAt(0).toUpperCase() + field.replace('_', ' ').slice(1)} wajib diisi`;
                }
            } else {
                // For new profiles, all fields are required
                if (!formData[field]) {
                    newErrors[field] = `${field.replace('_', ' ').charAt(0).toUpperCase() + field.replace('_', ' ').slice(1)} wajib diisi`;
                }
            }
        });

        // Validate department separately since it's a radio button
        if (!formData.departemen) {
            // For updates, only validate if department was changed
            if (!isUpdate || (isUpdate && profile.departemen !== formData.departemen)) {
                newErrors.departemen = 'Departemen wajib dipilih';
            }
        }

        // WhatsApp number validation - only validate if it's filled
        if (formData.whatsapp && !/^[0-9]+$/.test(formData.whatsapp)) {
            newErrors.whatsapp = 'Nomor WhatsApp hanya boleh berisi angka';
        }

        // Twibbon URL validation - only validate if it's filled
        if (formData.twibbon && !/^(https?:\/\/)/.test(formData.twibbon)) {
            newErrors.twibbon = 'URL Twibbon harus dimulai dengan http:// atau https://';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Mohon perbaiki kesalahan pada form');
            return;
        }

        setIsSubmitting(true);

        try {
            // Siapkan data yang berubah saja untuk dikirim
            const changedData = {};

            if (profile) {
                // Jika update profile yang sudah ada, hanya kirim field yang berubah
                Object.keys(formData).forEach(key => {
                    if (formData[key] !== profile[key] && key !== 'email') {
                        changedData[key] = formData[key];
                        console.log(`Field changed: ${key} from '${profile[key]}' to '${formData[key]}'`);
                    }
                });
            } else {
                // Jika membuat profile baru, kirim semua data
                Object.assign(changedData, formData);
            }

            // Tambahkan photo hanya jika ada perubahan
            if (profileImage) {
                changedData.photo = profileImage;
                console.log('Adding photo to changes');
            }

            console.log('Data yang akan dikirim:', changedData);

            // Periksa jika ada data yang berubah
            if (Object.keys(changedData).length === 0 && !profileImage) {
                toast.info('Tidak ada perubahan data yang perlu disimpan');
                setIsSubmitting(false);
                return;
            }

            // Tambahkan log data lengkap sebelum mengirim
            console.log('POST data to send:', changedData);
            const response = await saveProfile(changedData);
            console.log('Response setelah save:', response);

            if (response.success) {
                toast.success('Profil berhasil disimpan');

                // Update image preview dengan cache busting
                if (response.data && response.data.photo_url) {
                    const cacheBuster = Date.now();
                    const photoUrl = `${response.data.photo_url}?v=${cacheBuster}`;
                    console.log('Setting image preview with cache busting:', photoUrl);
                    setImagePreview(photoUrl);
                }
            } else {
                if (response.errors) {
                    setErrors(response.errors);
                }
                toast.error(response.message || 'Gagal menyimpan profil');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Terjadi kesalahan saat menyimpan profil');
        } finally {
            setIsSubmitting(false);
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

            {/* Main Content - Apply blur only on mobile and when sidebar is open */}
            <div
                className={`flex-1 ${isMobile && sidebarOpen ? 'blur-sm' : ''} ${showModal ? 'blur-sm' : ''} transition-all duration-300`}
                style={{ pointerEvents: (isMobile && sidebarOpen) || showModal ? 'none' : 'auto' }}
            >
                <section className="flex-1 p-4 px-6 md:p-8 md:px-16 flex flex-col gap-4 md:gap-6 overflow-y-auto">
                    {/* Profile component at top right */}
                    <div className="self-end">
                        <ProfileComponent />
                    </div>

                    {/* Page title */}
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-secondary">
                            {profile ? 'Edit Profile' : 'Buat Profile'}
                        </h1>
                    </div>

                    {/* Loading indicator */}
                    {loading && (
                        <div className="flex justify-center items-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E0771]"></div>
                        </div>
                    )}

                    {!loading && (
                        <>
                            {/* Profile picture with upload functionality */}
                            <div className="self-center relative">
                                <div className="border-2 p-6 md:p-8 bg-[#1E0771] text-white rounded-full relative overflow-hidden flex items-center justify-center" style={{ width: "250px", height: "250px" }}>
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
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
                            <form className="flex flex-col gap-6 mt-4" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    {/* Nama Lengkap */}
                                    <div className="flex flex-col gap-2">
                                        <label className="font-semibold text-base md:text-lg">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            name="nama_lengkap"
                                            value={formData.nama_lengkap}
                                            onChange={handleInputChange}
                                            className={`w-full py-3 px-4 border-2 ${errors.nama_lengkap ? 'border-red-500' : 'border-secondary'} rounded-xl focus:bg-gray-200 font-semibold`}
                                            placeholder="Masukan Nama Lengkap"
                                        />
                                        {errors.nama_lengkap && (
                                            <p className="text-red-500 text-sm">{errors.nama_lengkap}</p>
                                        )}
                                    </div>

                                    {/* Nama Panggilan */}
                                    <div className="flex flex-col gap-2">
                                        <label className="font-semibold text-base md:text-lg">Nama Panggilan</label>
                                        <input
                                            type="text"
                                            name="panggilan"
                                            value={formData.panggilan}
                                            onChange={handleInputChange}
                                            className={`w-full py-3 px-4 border-2 ${errors.panggilan ? 'border-red-500' : 'border-secondary'} rounded-xl focus:bg-gray-200 font-semibold`}
                                            placeholder="Masukan Nama Panggilan"
                                        />
                                        {errors.panggilan && (
                                            <p className="text-red-500 text-sm">{errors.panggilan}</p>
                                        )}
                                    </div>

                                    {/* NIM */}
                                    <div className="flex flex-col gap-2">
                                        <label className="font-semibold text-base md:text-lg">NIM</label>
                                        <input
                                            type="text"
                                            name="nim"
                                            value={formData.nim}
                                            onChange={handleInputChange}
                                            className={`w-full py-3 px-4 border-2 ${errors.nim ? 'border-red-500' : 'border-secondary'} rounded-xl focus:bg-gray-200 font-semibold`}
                                            placeholder="Masukan NIM"
                                        />
                                        {errors.nim && (
                                            <p className="text-red-500 text-sm">{errors.nim}</p>
                                        )}
                                    </div>

                                    {/* Email (Read-only) */}
                                    <div className="flex flex-col gap-2">
                                        <label className="font-semibold text-base md:text-lg">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email || user?.email || ''}
                                            readOnly
                                            className="w-full py-3 px-4 border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-600 font-semibold cursor-not-allowed"
                                            placeholder="neotelemetri@example.com"
                                        />
                                        <p className="text-xs text-gray-500">Email tidak dapat diubah</p>
                                    </div>

                                    {/* No Whatsapp */}
                                    <div className="flex flex-col gap-2">
                                        <label className="font-semibold text-base md:text-lg">No Whatsapp</label>
                                        <input
                                            type="text"
                                            name="whatsapp"
                                            value={formData.whatsapp}
                                            onChange={handleInputChange}
                                            className={`w-full py-3 px-4 border-2 ${errors.whatsapp ? 'border-red-500' : 'border-secondary'} rounded-xl focus:bg-gray-200 font-semibold`}
                                            placeholder="Masukan nomor WA"
                                        />
                                        {errors.whatsapp && (
                                            <p className="text-red-500 text-sm">{errors.whatsapp}</p>
                                        )}
                                    </div>

                                    {/* Program Studi */}
                                    <div className="flex flex-col gap-2">
                                        <label className="font-semibold text-base md:text-lg">Program Studi</label>
                                        <input
                                            type="text"
                                            name="program_studi"
                                            value={formData.program_studi}
                                            onChange={handleInputChange}
                                            className={`w-full py-3 px-4 border-2 ${errors.program_studi ? 'border-red-500' : 'border-secondary'} rounded-xl focus:bg-gray-200 font-semibold`}
                                            placeholder="Masukkan Program Studi"
                                        />
                                        {errors.program_studi && (
                                            <p className="text-red-500 text-sm">{errors.program_studi}</p>
                                        )}
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
                                                        handleInfoClick('Organisasi', 'Departemen Organisasi Neo Telemetri berfokus pada pengelolaan sumber daya manusia, komunikasi, dan operasional internal organisasi. Departemen ini bertanggung jawab dalam membangun lingkungan yang solid, profesional, dan kolaboratif, serta memastikan setiap anggota dapat berkembang secara optimal.');
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
                                                        handleInfoClick('Operasional', 'Departemen Operasional Neo Telemetri berfokus pada pengembangan hard skill anggota di bidang teknologi dan rekayasa sistem. Departemen ini menaungi divisi-divisi teknis yang mendukung inovasi dan implementasi proyek berbasis teknologi, sehingga anggota dapat mengasah keterampilan praktis serta siap terjun ke dunia industri.');
                                                    }}
                                                >
                                                    <IoInformationCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        {errors.departemen && (
                                            <p className="text-red-500 text-sm text-center mt-2">{errors.departemen}</p>
                                        )}
                                    </div>

                                    {/* Divisi */}
                                    <div className="flex flex-col gap-2">
                                        <label className="font-semibold text-base md:text-lg">Divisi</label>
                                        <div className="relative">
                                            <select
                                                name="divisi"
                                                className={`w-full py-3 px-4 border-2 ${errors.divisi ? 'border-red-500' : 'border-secondary'} rounded-xl focus:bg-gray-200 font-semibold appearance-none`}
                                                value={selectedDivision}
                                                onChange={handleSelectChange}
                                            >
                                                <option value="">Pilih Divisi</option>
                                                <option value="Programming">Programming</option>
                                                <option value="Multimedia & Desain">Multimedia & Desain</option>
                                                <option value="Sistem Komputer & Jaringan">Sistem Komputer & Jaringan</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        {errors.divisi && (
                                            <p className="text-red-500 text-sm">{errors.divisi}</p>
                                        )}
                                    </div>

                                    {/* Sub Divisi */}
                                    <div className="flex flex-col gap-2">
                                        <label className="font-semibold text-base md:text-lg">Subdivisi</label>
                                        <div className="relative">
                                            <select
                                                name="sub_divisi"
                                                className={`w-full py-3 px-4 border-2 ${errors.sub_divisi ? 'border-red-500' : 'border-secondary'} rounded-xl focus:bg-gray-200 font-semibold appearance-none`}
                                                value={selectedSubDivision}
                                                onChange={handleSelectChange}
                                                disabled={!selectedDivision}
                                            >
                                                <option value="">Pilih Sub Divisi</option>
                                                {selectedDivision === 'Programming' && (
                                                    <>
                                                        <option value="Web Programming">Web Programming</option>
                                                        <option value="Mobile Programming">Mobile Programming</option>
                                                        <option value="Machine Learning">Machine Learning</option>
                                                    </>
                                                )}
                                                {selectedDivision === 'Multimedia & Desain' && (
                                                    <>
                                                        <option value="UIUX">UIUX</option>
                                                        <option value="Video Editing">Video Editing</option>
                                                        <option value="3D">3D</option>
                                                    </>
                                                )}
                                                {selectedDivision === 'Sistem Komputer & Jaringan' && (
                                                    <>
                                                        <option value="Network Engineer">Network Engineer</option>
                                                        <option value="System Engineer">System Engineer</option>
                                                    </>
                                                )}
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        {errors.sub_divisi && (
                                            <p className="text-red-500 text-sm">{errors.sub_divisi}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Link Twibbon */}
                                <div className="mt-4 md:mt-6">
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="font-semibold text-base md:text-lg">Link Twibbon</label>
                                        <input
                                            type="url"
                                            name="twibbon"
                                            value={formData.twibbon}
                                            onChange={handleInputChange}
                                            className={`w-full py-3 px-4 border-2 ${errors.twibbon ? 'border-red-500' : 'border-secondary'} rounded-xl focus:bg-gray-200 font-semibold`}
                                            placeholder="Masukkan link twibbon anda"
                                        />
                                        {errors.twibbon && (
                                            <p className="text-red-500 text-sm">{errors.twibbon}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center md:justify-start mt-6 md:mt-8">
                                    <button
                                        type="submit"
                                        className={`w-full py-3 md:py-4 border-2 border-[#2E1461] bg-[#2E1461] text-white rounded-xl text-base md:text-lg font-semibold hover:bg-white hover:text-[#1E0771] transition duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Menyimpan...
                                            </span>
                                        ) : (
                                            'Simpan!'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

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
            </div>

            {/* Modal for info display */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div
                        className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-end items-center mb-4">
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
                                {modalContent.title === 'Organisasi'
                                    ? ' Departemen Organisasi Neo Telemetri berfokus pada pengelolaan sumber daya manusia, komunikasi, dan operasional internal organisasi. Departemen ini bertanggung jawab dalam membangun lingkungan yang solid, profesional, dan kolaboratif, serta memastikan setiap anggota dapat berkembang secara optimal.'
                                    : 'Departemen Operasional Neo Telemetri berfokus pada pengembangan hard skill anggota di bidang teknologi dan rekayasa sistem. Departemen ini menaungi divisi-divisi teknis yang mendukung inovasi dan implementasi proyek berbasis teknologi, sehingga anggota dapat mengasah keterampilan praktis serta siap terjun ke dunia industri.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;