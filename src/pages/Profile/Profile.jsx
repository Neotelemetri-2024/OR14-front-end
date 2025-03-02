import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import SidebarComponent from "../../Components/SidebarComponent";
import { FaUser } from "react-icons/fa";

const Profile = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen h-full">
            {/* Mobile Header with Burger Menu */}
            <div className="md:hidden bg-[#2d2460] p-4 flex justify-between items-center sticky top-0 z-50">
                <button onClick={toggleSidebar} className="text-white text-3xl">
                    <IoMenu />
                </button>
            </div>

            {/* Sidebar - hidden by default on mobile, shown when toggled */}
            <section className={`${sidebarOpen ? 'fixed inset-0 z-40' : 'hidden'} md:block md:sticky md:top-0 md:h-screen md:w-1/4`}>
                <SidebarComponent closeSidebar={() => setSidebarOpen(false)} />
            </section>

            {/* Main content */}
            <div className="flex-1 p-4 md:p-8 md:pl-12 flex flex-col gap-4 md:gap-8">
                {/* Avatar */}
                <div>
                    <h1 className="text-2xl font-bold text-secondary">
                        Edit Profile
                    </h1>
                </div>
                <div className="self-center border-2 p-8 bg-[#1E0771] text-white rounded-full">
                    <FaUser size={100} />
                </div>
                <form className="flex flex-col gap-8">
                    <div className="grid grid-cols-2 gap-8 mt-8">
                        <div className="flex flex-col gap-2 text-lg">
                            <label className="font-semibold">Nama</label>
                            <input type="text" className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold" placeholder="Masukan Nama" />
                        </div>
                        <div className="flex flex-col gap-2 text-lg">
                            <label className="font-semibold">Nama Lengkap</label>
                            <input type="text" className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold" placeholder="Masukan Nama Lengkap" />
                        </div>
                        <div className="flex flex-col gap-2 text-lg">
                            <label className="font-semibold">Email</label>
                            <input type="email" className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold" placeholder="neotelemetri@example.com" />
                        </div>
                        <div className="flex flex-col gap-2 text-lg">
                            <label className="font-semibold">Nomor Whatsapp</label>
                            <input type="text" className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold" placeholder="Masukan Nomor Whatsapp" />
                        </div>
                        <div className="flex flex-col gap-2 text-lg">
                            <label className="font-semibold">Jurusan</label>
                            <input type="text" className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold" placeholder="Masukan Jurusan" />
                        </div>
                        <div className="flex flex-col gap-2 text-lg">
                            <label className="font-semibold">Divisi</label>
                            <input type="text" className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold" placeholder="Pilih Divisi" />
                        </div>
                        <div className="flex flex-col gap-2 text-lg">
                            <label className="font-semibold">Subdivisi</label>
                            <input type="text" className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold" placeholder="Pilih Subdivisi" />
                        </div>
                        <div className="flex flex-col gap-2 text-lg">
                            <label className="font-semibold">NIM</label>
                            <input type="text" className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold" placeholder="Masukan NIM" />
                        </div>

                        <div className="flex flex-col gap-2 text-lg">
                            <h2 className="text-2xl font-bold my-8">
                                Ganti Password
                            </h2>
                            <label className="font-semibold">Password baru</label>
                            <input type="password" className="w-full py-3 px-4 border-2 border-secondary rounded-xl focus:bg-gray-200 font-semibold" placeholder="" />
                            <button type="submit" className="w-full py-4 px-8 border-2 border-primary text-white bg-primary rounded-xl text-xl font-semibold hover:cursor-pointer hover:bg-white hover:text-primary hover:transition duration-300 mt-8">
                                Simpan!
                            </button>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    );
}
export default Profile;