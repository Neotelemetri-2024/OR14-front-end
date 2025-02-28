import { useEffect } from "react";
import DivisionComponent from "../Components/DivisionComponent";
import { useState } from "react";

const Landing = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const scrollToSection = (section) => {
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="py-4 overflow-hidden">
            {/* Absolute Decoration */}

            {/* Navbar */}
            <nav className="flex flex-row justify-between items-center mx-4 md:mx-8 mb-12 md:mb-20 relative">
                <img src="/images/or14.svg" className="w-40 md:w-56" />

                {/* Desktop Navigation */}
                <div className="hidden lg:flex flex-row justify-between items-center gap-4 md:gap-8 text-lg md:text-xl font-semibold">
                    <button className="border-2 rounded-xl px-4 md:px-8 py-1 border-secondary text-secondary hover:bg-secondary hover:text-white hover:cursor-pointer transition duration-300">
                        Home
                    </button>
                    <button className="border-2 rounded-xl px-4 md:px-8 py-1 border-secondary text-secondary hover:bg-secondary hover:text-white hover:cursor-pointer transition duration-300" onClick={() => scrollToSection("division")}>
                        Division
                    </button>
                    <button className="border-2 rounded-xl px-4 md:px-8 py-1 border-secondary text-secondary hover:bg-secondary hover:text-white hover:cursor-pointer transition duration-300">
                        Achievements
                    </button>
                    <button className="border-2 rounded-xl px-4 md:px-8 py-1 border-secondary text-secondary hover:bg-secondary hover:text-white hover:cursor-pointer transition duration-300">
                        About
                    </button>
                </div>

                {/* Burger Menu Button for Mobile */}
                <button
                    className="lg:hidden text-secondary p-2 hover:cursor-pointer hover:bg-gray-200"
                    onClick={toggleMenu}
                    aria-label="Toggle Menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg z-50 w-64">
                        <div className="flex flex-col p-4 gap-3">
                            <button className="border-2 rounded-xl px-4 py-2 border-secondary text-secondary hover:bg-secondary hover:text-white hover:cursor-pointer transition duration-300">
                                Home
                            </button>
                            <button className="border-2 rounded-xl px-4 py-2 border-secondary text-secondary hover:bg-secondary hover:text-white hover:cursor-pointer transition duration-300">
                                Division
                            </button>
                            <button className="border-2 rounded-xl px-4 py-2 border-secondary text-secondary hover:bg-secondary hover:text-white hover:cursor-pointer transition duration-300">
                                Achievements
                            </button>
                            <button className="border-2 rounded-xl px-4 py-2 border-secondary text-secondary hover:bg-secondary hover:text-white hover:cursor-pointer transition duration-300">
                                About
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <section className="flex flex-row items-center mb-20">
                {/* Landing Page Card */}
                <div className="border-2 rounded-2xl px-12 pt-12 pb-40 bg-gradient-to-b from-black to-[#3533cc] max-w-1/2 -ml-4">
                    <h1 className="text-white text-4xl mb-6 font-bold">Apa itu OR UKM Neo Telemetri?</h1>
                    <p className="text-white text-lg font-light text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu massa arcu. Aliquam a odio sodales, iaculis neque eget, commodo tellus. Fusce varius commodo lorem, vitae vulputate mi ullamcorper in. Donec viverra neque tempor turpis molestie malesuada. Nam dapibus sapien ac ligula consectetur ultrices. Vestibulum ut ante elementum dolor molestie vestibulum. </p>
                </div>

                {/* Landing Page Title */}
                <div className="max-w-1/2 flex flex-col justify-start ml-20">
                    <h1 className="text-secondary text-5xl font-bold sm:mb-4 mb-12 max-w-4/5">Open Recruitment XIV</h1>
                    <h1 className="text-secondary text-5xl font-bold mb-12 max-w-4/5">UKM Neo Telemetri</h1>
                    <p className="text-tertiary text-xl  font-regular text-justify max-w-3/4 mb-20">
                        Ayo! menjadi bagian dari Unit Kegiatan Mahasiswa berbasis IT terbesar di Universitas Andalas.
                    </p>
                    <div className="flex md:flex-row gap-8 flex-col px-8 justify-between items-center max-w-3/4">
                        <button className="border-2 px-16 py-3 border-primary text-white bg-primary rounded-xl text-2xl font-semibold hover:bg-white hover:text-primary hover:cursor-pointer transition duration-300">
                            Daftar
                        </button>
                        <button className="border-3 px-16 py-3 border-gray-300 text-secondary vh rounded-xl text-2xl font-semibold hover:bg-gray-300 hover:text-secondary hover:cursor-pointer transition duration-300">
                            Masuk
                        </button>
                    </div>
                </div>
            </section>


            {/* Division Section */}
            <section className="w-screen bg-[url('/assets/bg.svg')] bg-cover bg-center bg-no-repeat py-8">
                <div className="flex flex-col items-center w-full bg-white py-6 rounded-sm">
                    <h1 id="division" className="text-[#1E0771] text-3xl font-bold">
                        Our Division
                    </h1>
                </div>
                <DivisionComponent />

            </section>
        </div>
    )
}

export default Landing;