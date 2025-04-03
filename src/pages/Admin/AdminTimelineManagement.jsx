import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "./AdminSidebar";
import { MdAdd, MdDelete, MdEdit, MdClose, MdArrowUpward, MdArrowDownward, MdCheckCircle, MdInfo } from "react-icons/md";
import { timelineService } from "../../services/TimelineService";

const AdminTimelineManagement = () => {
    const [timelines, setTimelines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Form states
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        start_date: "",
        is_enabled: true,
        is_active: false
    });

    // Enhanced form states
    const [showDateHelp, setShowDateHelp] = useState(false);
    const [presetDates, setPresetDates] = useState([
        { label: "1 - 7 April 2025", value: "1 - 7 April 2025" },
        { label: "8 - 14 April 2025", value: "8 - 14 April 2025" },
        { label: "15 - 21 April 2025", value: "15 - 21 April 2025" },
        { label: "22 - 28 April 2025", value: "22 - 28 April 2025" }
    ]);
    const [customPreset, setCustomPreset] = useState("");

    // Fetch timelines on component mount
    useEffect(() => {
        fetchTimelines();
    }, []);

    // Check if mobile
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

    // Fetch timeline data
    const fetchTimelines = async () => {
        setLoading(true);
        try {
            const response = await timelineService.getTimelines();
            if (response.success) {
                setTimelines(response.data);
            } else {
                toast.error(response.message || "Gagal mengambil data timeline");
            }
        } catch (error) {
            console.error("Error fetching timelines:", error);
            toast.error("Terjadi kesalahan saat mengambil data timeline");
        } finally {
            setLoading(false);
        }
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle preset date selection
    const handlePresetDateSelect = (presetValue) => {
        setFormData({
            ...formData,
            start_date: presetValue
        });
    };

    // Add custom preset
    const handleAddCustomPreset = () => {
        if (customPreset.trim() === "") return;

        // Add to presets if not already exists
        if (!presetDates.some(preset => preset.value === customPreset)) {
            setPresetDates([
                ...presetDates,
                { label: customPreset, value: customPreset }
            ]);
        }

        // Set as current value
        setFormData({
            ...formData,
            start_date: customPreset
        });

        // Clear input
        setCustomPreset("");
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            title: "",
            start_date: "",
            is_enabled: true,
            is_active: false
        });
        setEditingId(null);
    };

    // Toggle form visibility
    const toggleForm = () => {
        if (showForm) {
            resetForm();
        }
        setShowForm(!showForm);
    };

    // Edit timeline
    const handleEdit = (timeline) => {
        setFormData({
            title: timeline.title,
            start_date: timeline.start_date || "",
            is_enabled: timeline.is_enabled,
            is_active: timeline.is_active
        });
        setEditingId(timeline.id);
        setShowForm(true);

        // Scroll to form
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.title.trim()) {
            toast.error("Judul timeline tidak boleh kosong");
            return;
        }

        // Prepare data for API
        const data = {
            ...formData,
        };

        try {
            let response;
            if (editingId) {
                // Update existing timeline
                response = await timelineService.updateTimeline(editingId, data);
                if (response.success) {
                    toast.success("Timeline berhasil diperbarui");
                } else {
                    toast.error(response.message || "Gagal memperbarui timeline");
                    return;
                }
            } else {
                // Create new timeline
                response = await timelineService.createTimeline(data);
                if (response.success) {
                    toast.success("Timeline berhasil ditambahkan");
                } else {
                    toast.error(response.message || "Gagal menambahkan timeline baru");
                    return;
                }
            }

            // Refresh data and reset form
            fetchTimelines();
            resetForm();
            setShowForm(false);
        } catch (error) {
            console.error("Error saving timeline:", error);
            toast.error("Terjadi kesalahan saat menyimpan data");
        }
    };

    // Delete timeline
    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus timeline ini?")) {
            return;
        }

        try {
            const response = await timelineService.deleteTimeline(id);
            if (response.success) {
                toast.success("Timeline berhasil dihapus");
                fetchTimelines();
            } else {
                toast.error(response.message || "Gagal menghapus timeline");
            }
        } catch (error) {
            console.error("Error deleting timeline:", error);
            toast.error("Terjadi kesalahan saat menghapus timeline");
        }
    };

    // Toggle timeline status quickly
    const handleToggleStatus = async (timeline, field) => {
        try {
            const updatedData = {
                ...timeline,
                [field]: !timeline[field]
            };

            const response = await timelineService.updateTimeline(timeline.id, updatedData);
            if (response.success) {
                toast.success(`Status timeline berhasil diubah`);
                fetchTimelines();
            } else {
                toast.error(response.message || "Gagal mengubah status timeline");
            }
        } catch (error) {
            console.error("Error updating timeline status:", error);
            toast.error("Terjadi kesalahan saat mengubah status timeline");
        }
    };

    // Move timeline up/down (reordering)
    const handleReorder = async (id, direction) => {
        const currentIndex = timelines.findIndex(item => item.id === id);
        if (
            (direction === 'up' && currentIndex === 0) ||
            (direction === 'down' && currentIndex === timelines.length - 1)
        ) {
            return; // Can't move further
        }

        const newTimelines = [...timelines];
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        // Swap order values
        const temp = newTimelines[currentIndex].order;
        newTimelines[currentIndex].order = newTimelines[targetIndex].order;
        newTimelines[targetIndex].order = temp;

        // Swap positions in array for UI update
        [newTimelines[currentIndex], newTimelines[targetIndex]] =
            [newTimelines[targetIndex], newTimelines[currentIndex]];

        // Update UI first for better UX
        setTimelines(newTimelines);

        // Prepare data for API - match controller's expected format
        const reorderData = {
            timelines: newTimelines.map((item, index) => ({
                id: item.id,
                order: index + 1
            }))
        };

        try {
            const response = await timelineService.reorderTimelines(reorderData);
            if (!response.success) {
                toast.error(response.message || "Gagal mengubah urutan timeline");
                fetchTimelines(); // Revert changes on error
            }
        } catch (error) {
            console.error("Error reordering timelines:", error);
            toast.error("Terjadi kesalahan saat mengubah urutan timeline");
            fetchTimelines(); // Revert changes on error
        }
    };

    // Common timeline title suggestions
    const commonTitles = [
        "Pendaftaran",
        "Verifikasi",
        "Seleksi",
        "Pengumuman Hasil",
        "Onboarding Peserta",
        "Briefing Peserta",
        "Pembukaan Acara",
        "Penutupan Acara"
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-screen h-full">
            {/* Mobile Header with Burger Menu */}
            <div className="md:hidden bg-[#2d2460] p-4 flex justify-between items-center sticky top-0 z-50">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-3xl">
                    <MdEdit />
                </button>
                <h1 className="text-white text-xl font-bold">Admin Timeline</h1>
                <div className="w-8"></div> {/* Empty div for balanced spacing */}
            </div>

            {/* Mobile Sidebar with Blur Effect */}
            {isMobile && (
                <>
                    {/* Mobile Sidebar */}
                    <div className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <AdminSidebar closeSidebar={() => setSidebarOpen(false)} />
                    </div>

                    {/* Invisible overlay to close sidebar when clicked */}
                    <div
                        className={`fixed inset-0 z-40 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                </>
            )}

            {/* Desktop Sidebar */}
            <div className="hidden md:block sticky top-0 h-screen overflow-y-auto">
                <AdminSidebar />
            </div>

            {/* Main Content */}
            <div className={`flex-1 ${isMobile && sidebarOpen ? 'blur-sm' : ''} transition-all duration-300`}
                style={{ pointerEvents: isMobile && sidebarOpen ? 'none' : 'auto' }}>
                <section className="flex-1 p-4 md:p-8 flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#1E0771]">Kelola Timeline</h1>
                        <button
                            onClick={toggleForm}
                            className="flex items-center gap-2 bg-gradient-to-b from-[#1B054E] to-[#7449B6] text-white px-4 py-2 rounded-lg hover:from-[#2A0775] hover:to-[#8A5BD0] transition-all duration-300"
                        >
                            {showForm ? (
                                <>
                                    <MdClose /> Tutup Form
                                </>
                            ) : (
                                <>
                                    <MdAdd /> Tambah Timeline
                                </>
                            )}
                        </button>
                    </div>

                    {/* Form for adding/editing timeline */}
                    {showForm && (
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                            <h2 className="text-xl font-bold mb-4 text-[#1E0771]">
                                {editingId ? "Edit Timeline" : "Tambah Timeline Baru"}
                            </h2>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                {/* Title with suggestions */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Judul Timeline <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E0771]"
                                        required
                                        list="title-suggestions"
                                    />
                                    <datalist id="title-suggestions">
                                        {commonTitles.map((title, index) => (
                                            <option key={index} value={title} />
                                        ))}
                                    </datalist>

                                    {/* Title suggestions */}
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {commonTitles.slice(0, 4).map((title, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200"
                                                onClick={() => setFormData({ ...formData, title })}
                                            >
                                                {title}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Display Date */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                                            Format Tanggal untuk Ditampilkan
                                        </label>
                                        <button
                                            type="button"
                                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                            onClick={() => setShowDateHelp(!showDateHelp)}
                                        >
                                            <MdInfo className="mr-1" />
                                            {showDateHelp ? "Sembunyikan bantuan" : "Bantuan"}
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        id="start_date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E0771]"
                                        placeholder="Contoh: 1 - 7 April 2025"
                                    />

                                    {/* Date format help */}
                                    {showDateHelp && (
                                        <div className="mt-2 p-3 bg-blue-50 rounded-md">
                                            <p className="text-sm text-blue-800">
                                                Format tanggal yang direkomendasikan:
                                                <ul className="list-disc list-inside mt-1">
                                                    <li>DD - DD Bulan YYYY (contoh: 1 - 7 April 2025)</li>
                                                    <li>Bulan YYYY (contoh: April 2025)</li>
                                                    <li>DD Bulan YYYY (contoh: 15 April 2025)</li>
                                                </ul>
                                            </p>
                                        </div>
                                    )}

                                    {/* Date presets */}
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600 mb-2">Pilih format tanggal:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {presetDates.map((preset, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    className={`px-2 py-1 text-xs rounded-md ${formData.start_date === preset.value
                                                            ? 'bg-purple-600 text-white'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                    onClick={() => handlePresetDateSelect(preset.value)}
                                                >
                                                    {preset.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Custom preset */}
                                    <div className="mt-3 flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={customPreset}
                                            onChange={(e) => setCustomPreset(e.target.value)}
                                            className="flex-1 p-2 text-sm border border-gray-300 rounded-md"
                                            placeholder="Tambah format tanggal kustom"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddCustomPreset}
                                            className="px-3 py-2 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200"
                                        >
                                            Tambah
                                        </button>
                                    </div>
                                </div>

                                {/* Status Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_enabled"
                                            name="is_enabled"
                                            checked={formData.is_enabled}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-[#1E0771] focus:ring-[#1E0771] border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_enabled" className="ml-2 block text-sm text-gray-700">
                                            Timeline ditampilkan
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-[#1E0771] focus:ring-[#1E0771] border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                                            Timeline aktif (akan disorot)
                                        </label>
                                    </div>
                                </div>
                                <div className="mt-1 p-3 bg-blue-50 rounded-md border border-blue-200">
                                    <p className="text-sm text-blue-800">
                                        <strong>Catatan:</strong> Timeline aktif akan ditampilkan dengan warna yang lebih terang dan menonjol dalam tampilan publik. Timeline tidak aktif akan tetap ditampilkan namun dengan warna yang lebih pudar.
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end space-x-4 mt-4">
                                    <button
                                        type="button"
                                        onClick={toggleForm}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-gradient-to-b from-[#1B054E] to-[#7449B6] text-white rounded-md hover:from-[#2A0775] hover:to-[#8A5BD0] transition-all duration-300"
                                    >
                                        {editingId ? "Perbarui" : "Simpan"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Loading state */}
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E0771]"></div>
                        </div>
                    ) : (
                        <>
                            {/* Timeline list */}
                            {timelines.length === 0 ? (
                                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                                    <p className="text-lg text-gray-600">Belum ada timeline yang ditambahkan.</p>
                                    <button
                                        onClick={toggleForm}
                                        className="mt-4 px-4 py-2 bg-gradient-to-b from-[#1B054E] to-[#7449B6] text-white rounded-md hover:from-[#2A0775] hover:to-[#8A5BD0] transition-all duration-300"
                                    >
                                        Tambah Timeline Pertama
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Urutan
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Judul
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Tanggal Tampil
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {timelines.map((timeline, index) => (
                                                    <tr key={timeline.id} className={`hover:bg-gray-50 ${timeline.is_active ? 'bg-purple-50' : ''}`}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <span className="text-sm text-gray-900 mr-2">{index + 1}</span>
                                                                <div className="flex flex-col">
                                                                    <button
                                                                        onClick={() => handleReorder(timeline.id, 'up')}
                                                                        disabled={index === 0}
                                                                        className={`text-gray-400 ${index === 0 ? 'cursor-not-allowed opacity-50' : 'hover:text-[#1E0771]'}`}
                                                                    >
                                                                        <MdArrowUpward />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleReorder(timeline.id, 'down')}
                                                                        disabled={index === timelines.length - 1}
                                                                        className={`text-gray-400 ${index === timelines.length - 1 ? 'cursor-not-allowed opacity-50' : 'hover:text-[#1E0771]'}`}
                                                                    >
                                                                        <MdArrowDownward />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className={`px-6 py-4 whitespace-nowrap ${timeline.is_active ? 'font-bold text-[#1E0771]' : ''}`}>
                                                            <div className="text-sm font-medium">
                                                                {timeline.title}
                                                                {timeline.is_active && (
                                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                                        Aktif
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-500">
                                                                {timeline.start_date || "Menggunakan tanggal asli"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center space-x-3">
                                                                {/* Quick toggle for is_enabled */}
                                                                <button
                                                                    className={`px-2 py-1 rounded-md text-xs font-medium flex items-center ${timeline.is_enabled
                                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                                        }`}
                                                                    onClick={() => handleToggleStatus(timeline, 'is_enabled')}
                                                                >
                                                                    <MdCheckCircle className={`mr-1 ${timeline.is_enabled ? 'opacity-100' : 'opacity-50'}`} />
                                                                    {timeline.is_enabled ? 'Ditampilkan' : 'Disembunyikan'}
                                                                </button>

                                                                {/* Quick toggle for is_active */}
                                                                <button
                                                                    className={`px-2 py-1 rounded-md text-xs font-medium flex items-center ${timeline.is_active
                                                                            ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                        }`}
                                                                    onClick={() => handleToggleStatus(timeline, 'is_active')}
                                                                >
                                                                    <MdCheckCircle className={`mr-1 ${timeline.is_active ? 'opacity-100' : 'opacity-50'}`} />
                                                                    {timeline.is_active ? 'Aktif' : 'Tidak Aktif'}
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => handleEdit(timeline)}
                                                                className="text-[#1E0771] hover:text-indigo-900 mr-4"
                                                                title="Edit timeline"
                                                            >
                                                                <MdEdit className="inline text-xl" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(timeline.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Hapus timeline"
                                                            >
                                                                <MdDelete className="inline text-xl" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export default AdminTimelineManagement;