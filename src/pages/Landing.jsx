import { useEffect } from "react";
import { useState } from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import DivisionComponent from "../Components/DivisionComponent";
import ProjectComponent from "../Components/ProjectComponent";
import AchievementComponent from "../Components/AchievementComponent";
import { useNavigate } from "react-router-dom";

const Landing = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [isScrolled, setIsScrolled] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setIsMenuOpen(false);
            }
        };

        const handleScroll = () => {
            const sections = ["home", "division", "projects", "achievements", "about"];
            let currentSection = "home";

            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            sections.forEach((section) => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 500 && rect.bottom >= 500) {
                        currentSection = section;
                    }
                }
            });

            setActiveSection(currentSection);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const scrollToSection = (section) => {
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    return (
        <div className="pt-4 relative w-full overflow-x-hidden" id="home">
            {/* Navbar */}
            <nav className={`sticky top-0 flex flex-row justify-between items-center px-4 md:px-8 mb-8 md:mb-12 lg:mb-20 bg-white w-full ${isScrolled ? "drop-shadow-md" : ""} z-10 py-2`}>
                <img src="/images/or14.svg" className="w-32 md:w-40 lg:w-56" alt="Logo" />

                {/* Desktop Navigation */}
                <div className="hidden lg:flex flex-row justify-between items-center gap-4 lg:gap-8 text-lg lg:text-xl font-semibold">
                    {["home", "division", "projects", "achievements", "about"].map((section) => (
                        <button
                            key={section}
                            className={`border-2 rounded-xl px-4 lg:px-8 py-1 border-secondary text-secondary hover:bg-secondary hover:text-white hover:cursor-pointer transition duration-300 ${activeSection === section ? "bg-secondary text-white" : ""
                                }`}
                            onClick={() => scrollToSection(section)}
                        >
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Burger Menu Button Mobile */}
                <button
                    className="lg:hidden text-secondary p-2 hover:cursor-pointer hover:bg-gray-200 focus:outline-none"
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
                    <div className="lg:hidden fixed top-20 right-0 mt-2 bg-white shadow-lg rounded-lg z-50 w-64 max-w-full">
                        <div className="flex flex-col p-4 gap-3">
                            {["home", "division", "projects", "achievements", "about"].map((section) => (
                                <button
                                    key={section}
                                    className={`border-2 rounded-xl px-4 py-2 border-secondary text-secondary hover:bg-secondary hover:cursor-pointer hover:text-white transition duration-300 ${activeSection === section ? "bg-secondary text-white" : ""
                                        }`}
                                    onClick={() => scrollToSection(section)}
                                >
                                    {section.charAt(0).toUpperCase() + section.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Home */}
            <section className="flex flex-col md:flex-row items-center mb-12 md:mb-20 pb-12 md:pb-24 lg:px-0 px-8">
                {/* Landing Page Card */}
                <div className="rounded-r-3xl px-4 sm:px-6 md:px-12 pt-8 md:pt-12 pb-12 md:pb-24 lg:pb-40 bg-gradient-to-b from-black to-[#3533cc] w-full md:w-1/2">
                    <h1 className="text-white text-2xl sm:text-3xl md:text-4xl mb-4 md:mb-6 font-bold">Apa itu OR UKM Neo Telemetri?</h1>
                    <p className="text-white text-base sm:text-lg md:text-xl font-light text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu massa arcu. Aliquam a odio sodales, iaculis neque eget, commodo tellus. Fusce varius commodo lorem, vitae vulputate mi ullamcorper in. Donec viverra neque tempor turpis molestie malesuada. Nam dapibus sapien ac ligula consectetur ultrices. Vestibulum ut ante elementum dolor molestie vestibulum.</p>
                </div>

                {/* Landing Page Title */}
                <div className="w-full lg:w-1/2 flex flex-col justify-start mt-8 md:mt-0 md:ml-4 lg:ml-16 px-4 md:px-0">
                    <h1 className="text-secondary text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 lg:mb-12">Open Recruitment XIV</h1>
                    <h1 className="text-secondary text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 lg:mb-12">UKM Neo Telemetri</h1>
                    <p className="text-tertiary text-base sm:text-lg md:text-xl font-regular text-justify mb-6 md:mb-10 lg:mb-16 lg:max-w-1/2">
                        Ayo! menjadi bagian dari Unit Kegiatan Mahasiswa berbasis IT terbesar di Universitas Andalas.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 lg:justify-between justify-evenly items-center lg:max-w-1/2">
                        <button className="w-full sm:w-auto border-2 px-6 sm:px-8 md:px-12 py-2 md:py-3 border-primary text-white bg-primary rounded-xl text-lg sm:text-xl md:text-2xl font-semibold hover:bg-white hover:text-primary hover:cursor-pointer transition duration-300" onClick={() => navigate("/auth?mode=register")}>
                            Daftar
                        </button>
                        <button className="w-full sm:w-auto border-2 px-6 sm:px-8 md:px-12 py-2 md:py-3 border-gray-300 text-secondary rounded-xl text-lg sm:text-xl md:text-2xl font-semibold hover:bg-gray-300 hover:text-secondary hover:cursor-pointer transition duration-300" onClick={() => navigate("/auth?mode=login")}>
                            Masuk
                        </button>
                    </div>
                </div>
            </section>

            {/* Division Section */}
            <section className="w-full bg-[url('/assets/bg.svg')] bg-cover bg-center bg-no-repeat py-8 pb-20 md:pb-40" id="division">
                <div className="flex flex-col items-center w-full bg-white py-4 md:py-6 rounded-sm">
                    <h1 className="text-[#1E0771] text-3xl sm:text-4xl md:text-5xl font-bold">
                        Our Division
                    </h1>
                </div>
                <DivisionComponent />
            </section>

            {/* Projects Section */}
            <section className="w-full bg-white py-8" id="projects">
                <div className="flex flex-col items-center w-full bg-[#1e1d75] py-4 md:py-6 mb-8">
                    <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">
                        Our Latest Projects
                    </h1>
                </div>
                <div className="px-4 md:px-0">
                    <ProjectComponent />
                </div>
            </section>

            {/* Achievements Section */}
            <section id="achievements" className="w-full mb-16 md:mb-32">
                <div className="flex flex-col items-center w-full bg-[#1e1d75] py-4 md:py-6 my-8 md:my-12">
                    <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">
                        Our Achievements
                    </h1>
                </div>
                <div className="px-4 md:px-0">
                    <AchievementComponent />
                </div>
            </section>

            {/* Jumbotron */}
            <section id="jumbotron" className="bg-[url('/assets/bg.svg')] bg-cover bg-center bg-no-repeat py-20 md:py-40 flex flex-col items-center justify-center gap-8 md:gap-16 px-4 md:px-0">
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold text-center px-4">
                    Tertarik untuk menjadi bagian dari UKM Neo Telemetri?
                </h1>
                <button className="border-2 border-white px-8 sm:px-12 md:px-16 py-3 sm:py-4 md:py-6 text-xl sm:text-2xl md:text-3xl bg-white rounded-2xl font-bold hover:cursor-pointer hover:bg-gray-300 hover:scale-105 transition duration-300">
                    Daftar Sekarang!
                </button>
            </section>

            {/* Footer */}
            <section id="about" className="bg-quarterary flex flex-col-reverse lg:grid lg:grid-cols-2 py-24 md:py-48 px-6 md:px-12 lg:px-48 gap-8">
                {/* Kiri - Logo & Alamat */}
                <div className="flex flex-col gap-8 text-center lg:text-left w-full max-w-lg mx-auto">
                    <img src="/images/neowhite.svg" className="w-40 md:w-56 mx-auto lg:mx-0" alt="Neo Logo" />
                    <p className="text-white lg:text-justify">
                        Neo Telemetri, Lt. 2, Gedung Pusat Kegiatan Mahasiswa, Universitas Andalas, Kota Padang, Sumatera Barat, Indonesia.
                    </p>
                    {/* Sosial Media */}
                    <div className="flex justify-center lg:justify-start gap-3 flex-wrap">
                        <button className="bg-white rounded-full p-2 size-10 flex items-center justify-center hover:bg-gray-300 transition">
                            <FaInstagram className="text-xl text-quarterary" />
                        </button>
                        <button className="bg-white rounded-full p-2 size-10 flex items-center justify-center hover:bg-gray-300 transition">
                            <FaFacebook className="text-xl text-quarterary" />
                        </button>
                        <button className="bg-white rounded-full p-2 size-10 flex items-center justify-center hover:bg-gray-300 transition">
                            <FaTwitter className="text-xl text-quarterary" />
                        </button>
                        <button className="bg-white rounded-full p-2 size-10 flex items-center justify-center hover:bg-gray-300 transition">
                            <FaTiktok className="text-xl text-quarterary" />
                        </button>
                    </div>
                </div>

                {/* Kanan - Kontak & Link */}
                <div className="flex flex-col gap-8 text-white text-center lg:text-left w-full max-w-lg mx-auto mt-8 lg:mt-4">
                    {/* Kontak */}
                    <div>
                        <h4 className="font-bold mb-2">Kontak</h4>
                        <p className="font-light">+62 9203-2920 -02</p>
                    </div>

                    {/* Relate */}
                    <div className="flex flex-col gap-3">
                        <h4 className="font-bold">Relate</h4>
                        <a href="#" className="font-light hover:underline cursor-pointer">
                            Marketing Neo Telemetri
                        </a>
                        <a href="#" className="font-light hover:underline cursor-pointer">
                            Portofolio Neo Telemetri
                        </a>
                    </div>
                </div>
            </section>

            {/* Background Decoration - Hidden on mobile, visible on large screens */}
            <img
                src="/assets/bg/Ellipse19.svg"
                alt="Decor 1"
                className="absolute top-[0%] right-[0%] hidden lg:block"
            />
            <img
                src="/assets/bg/Ellipse23.svg"
                alt="Decor 2"
                className="absolute top-[8%] right-[0%] -z-10 hidden lg:block"
            />
            <img
                src="/assets/bg/Ellipse24.svg"
                alt="Decor 3"
                className="absolute left-[30%] top-[8%] -z-10 hidden lg:block"
            />
            <img
                src="/assets/bg/Ellipse19.svg"
                alt="Decor 4"
                className="absolute top-[45%] right-[0%] hidden lg:block"
            />
            <img
                src="/assets/bg/Ellipse25.svg"
                alt="Decor 5"
                className="absolute top-[52%] left-[0%] hidden lg:block"
            />
            <img
                src="/assets/bg/Ellipse26.svg"
                alt="Decor 6"
                className="absolute top-[60%] left-[0%] -z-10 hidden lg:block"
            />
            <img
                src="/assets/bg/Ellipse27.svg"
                alt="Decor 7"
                className="absolute top-[62%] right-[0%] hidden lg:block"
            />
        </div>
    );
};

export default Landing;