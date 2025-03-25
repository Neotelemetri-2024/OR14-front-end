import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";

const ProfileComponent = () => {
    // Mengambil data dari context
    const { user } = useAuth();
    const { profile } = useProfile();

    // Menentukan nama yang akan ditampilkan
    // Prioritas: 1. Nama dari user auth (tabel users) 2. Nama panggilan dari profile 3. Default
    const displayName = user?.name || profile?.panggilan || "User";

    return (
        <Link to="/profile">
            <button className="self-end flex flex-row gap-2 md:gap-4 items-center hover:bg-gray-100 hover:cursor-pointer pl-2">
                <h2 className="text-[#2E1461] text-lg md:text-xl font-bold">{displayName}</h2>
                <div className="border p-3 md:p-6 bg-[#372088] overflow-hidden relative">
                    {profile?.photo_url ? (
                        <img
                            src={profile.photo_url}
                            alt="Profile"
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                                // Jika gambar gagal dimuat, tampilkan ikon default
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }}
                        />
                    ) : null}
                    <FaUser className="text-white text-lg md:text-xl" style={{ display: profile?.photo_url ? 'none' : 'block' }} />
                </div>
            </button>
        </Link>
    );
};

export default ProfileComponent;