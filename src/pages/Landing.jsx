import { useEffect, useRef } from "react";
import { useState } from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import DivisionComponent from "../components/DivisionComponent";
import ProjectComponent from "../components/ProjectComponent";
import AchievementComponent from "../components/AchievementComponent";
import { useNavigate } from "react-router-dom";
import OrganisasiComponent from "../components/OrganisasiComponent";

const Landing = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [isScrolled, setIsScrolled] = useState(false);
    const [animatedSections, setAnimatedSections] = useState({});

    const navigate = useNavigate();

    const homeRef = useRef(null);
    const divisionRef = useRef(null);
    const projectsRef = useRef(null);
    const achievementsRef = useRef(null);
    const jumbotronRef = useRef(null);
    const aboutRef = useRef(null);

    // Animation check function
    const checkAnimation = () => {
        const sections = [
            { id: 'home', ref: homeRef },
            { id: 'division', ref: divisionRef },
            { id: 'projects', ref: projectsRef },
            { id: 'achievements', ref: achievementsRef },
            { id: 'jumbotron', ref: jumbotronRef },
            { id: 'about', ref: aboutRef }
        ];

        sections.forEach(({ id, ref }) => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const isVisible = (rect.top <= window.innerHeight * 0.8);

                if (isVisible && !animatedSections[id]) {
                    setAnimatedSections(prev => ({ ...prev, [id]: true }));
                }
            }
        });
    };

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
            checkAnimation();
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener("scroll", handleScroll);

        // Initial check
        setTimeout(checkAnimation, 100);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [animatedSections]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const scrollToSection = (section) => {
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    // Animation class helper function
    const getAnimationClass = (sectionId, animationType = 'fadeIn', delay = 0) => {
        if (animatedSections[sectionId]) {
            return `animate-${animationType} opacity-100 delay-${delay}`;
        }
        return "opacity-0";
    };

    // Background decoration animation classes
    const getBgDecorAnimationClass = (index) => {
        const baseDelay = 300; // 300ms
        const delay = index * baseDelay;
        return animatedSections['home']
            ? `animate-float opacity-100 delay-${delay}`
            : "opacity-0";
    };

    return (
        <div className="pt-4 relative w-full overflow-x-hidden" id="home" ref={homeRef}>
            {/* Navbar */}
            <nav className={`sticky top-0 flex flex-row justify-between items-center px-4 md:px-8 mb-8 md:mb-12 lg:mb-0 bg-white w-full ${isScrolled ? "drop-shadow-md" : ""} z-10 transition-all duration-300`}>
                <img src="/images/or14.svg" className="w-32 md:w-40 lg:w-56" alt="Logo" />

                {/* Desktop Navigation */}
                <div className="hidden lg:flex flex-row justify-between items-center gap-4 lg:gap-8 text-lg lg:text-xl font-semibold">
                    {["home", "division", "projects", "achievements", "about"].map((section) => (
                        <button
                            key={section}
                            className={`border-2 rounded-xl px-4 lg:px-8 py-1 border-secondary text-secondary hover:bg-secondary hover:text-white hover:cursor-pointer transition-all duration-300 ${activeSection === section ? "bg-secondary text-white transform scale-105" : ""}`}
                            onClick={() => scrollToSection(section)}
                        >
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Burger Menu Button Mobile */}
                <button
                    className="lg:hidden text-secondary p-2 hover:cursor-pointer hover:bg-gray-200 focus:outline-none transition-transform duration-300 transform active:scale-90"
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
                    <div className="lg:hidden fixed top-20 right-0 mt-2 bg-white shadow-lg rounded-lg z-50 w-64 max-w-full animate-slideInFromRight">
                        <div className="flex flex-col p-4 gap-3">
                            {["home", "division", "projects", "achievements", "about"].map((section, index) => (
                                <button
                                    key={section}
                                    className={`border-2 rounded-xl px-4 py-2 border-secondary text-secondary hover:bg-secondary hover:cursor-pointer hover:text-white transition-all duration-300 animate-fadeIn delay-${index * 100} ${activeSection === section ? "bg-secondary text-white" : ""}`}
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
            <section className="flex flex-col md:flex-row items-center lg:px-0 px-8">
                <div className="w-full lg:w-1/2 flex flex-col justify-start mt-8 md:mt-0 md:ml-4 lg:ml-16 px-4 md:px-0">
                    <h1 className={`text-secondary text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 lg:mb-4 ${getAnimationClass('home', 'slideInFromLeft')}`}>Open Recruitment 14</h1>
                    <h1 className={`text-secondary text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 lg:mb-12 ${getAnimationClass('home', 'slideInFromLeft', 200)}`}>UKM Neo Telemetri</h1>
                    <p className={`text-tertiary text-base sm:text-lg md:text-xl font-regular text-justify mb-6 md:mb-10 lg:mb-16 pr-34 ${getAnimationClass('home', 'fadeIn', 400)}`}>
                        Ayo! menjadi bagian dari Unit Kegiatan Mahasiswa berbasis IT terbesar di Universitas Andalas.
                    </p>
                    <div className={`flex flex-col sm:flex-row gap-4 lg:justify-between justify-evenly items-center lg:max-w-1/2 ${getAnimationClass('home', 'slideInFromBottom', 600)}`}>
                        <button className="w-full sm:w-auto border-2 px-6 sm:px-8 md:px-12 py-2 md:py-3 border-primary text-white bg-primary rounded-xl text-lg sm:text-xl md:text-2xl font-semibold hover:bg-white hover:text-primary hover:cursor-pointer transition-all duration-300 hover:scale-105" onClick={() => navigate("/auth?mode=register")}>
                            Daftar
                        </button>
                        <button className="w-full sm:w-auto border-2 px-6 sm:px-8 md:px-12 py-2 md:py-3 border-gray-300 text-secondary rounded-xl text-lg sm:text-xl md:text-2xl font-semibold hover:bg-gray-300 hover:text-secondary hover:cursor-pointer transition-all duration-300 hover:scale-105" onClick={() => navigate("/auth?mode=login")}>
                            Masuk
                        </button>
                    </div>
                </div>

                <div className="w-full md:w-1/2 hidden md:flex justify-center items-center pb-24 relative">
                    {/* Card di atas foto */}
                    <div className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/4 bg-secondary text-white rounded-3xl px-24 py-1 text-center shadow-lg z-10 ${getAnimationClass('home', 'popIn', 800)}`}>
                        <p className="text-sm font-medium mb-1">Ketua Neo Telemetri</p>
                        <h3 className="text-xl font-bold">Abdalul Fikri</h3>
                    </div>

                    <img src="/assets/landing/Group170.png" className={`absolute right-128 bottom-36 md:block hidden ${getAnimationClass('home', 'fadeIn', 300)}`} />
                    <img src="/assets/landing/Group171.png" className={`absolute right-0 top-30 md:block hidden ${getAnimationClass('home', 'fadeIn', 500)}`} />
                    <img src="/assets/programming.svg" className={`absolute left-50 top-40 md:block hidden h-12 -rotate-30 ${getAnimationClass('home', 'fadeIn', 700)}`} />
                    <img src="/assets/mmd.svg" className={`absolute right-40 top-40 md:block hidden h-16 ${getAnimationClass('home', 'fadeIn', 900)}`} />
                    <img src="/assets/skj.svg" className={`absolute right-30 bottom-40 md:block hidden h-16 ${getAnimationClass('home', 'fadeIn', 1100)}`} />

                    <img src="/assets/fikri.png" className={`max-w-full h-auto relative z-0 md:block hidden ${getAnimationClass('home', 'fadeIn', 200)}`} />
                </div>
            </section>

            <section className="flex flex-col md:flex-row items-center lg:px-0 px-8 mb-8">
                <div className="w-full md:w-1/2 hidden md:flex justify-center items-center pb-24">
                    <img src="/images/or14.svg" className={`right-128 bottom-36 md:block hidden w-3/4 ${getAnimationClass('home', 'popIn', 300)}`} />
                </div>
                <div className={`px-4 sm:px-6 md:px-12 pt-8 md:pt-12 pb-12 md:pb-24 lg:pb-28 bg-gradient-to-b from-[#1B054E] to-[#7449B6] w-full md:w-1/2 hidden md:block mr-10 ${getAnimationClass('home', 'slideInFromRight', 400)}`}>
                    <h1 className="text-white text-2xl sm:text-2xl mb-4 md:mb-12 font-bold">Apa itu Open Recruitment UKM Neo Telemetri?</h1>
                    <p className="text-white text-base sm:text-lg md:text-xl font-light text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu massa arcu. Aliquam a odio sodales, iaculis neque eget, commodo tellus. Fusce varius commodo lorem, vitae vulputate mi ullamcorper in. Donec viverra neque tempor turpis molestie malesuada. Nam dapibus sapien ac ligula consectetur ultrices. Vestibulum ut ante elementum dolor molestie vestibulum.</p>
                </div>
            </section>

            {/* Division Section */}
            <section className="w-full bg-gradient-to-b from-[#1B054E] to-[#7449B6] pb-20 md:pb-40" id="division" ref={divisionRef}>
                <div className={`flex flex-col items-center w-full bg-white py-4 md:py-6 rounded-sm ${getAnimationClass('division', 'slideInFromTop')}`}>
                    <h1 className="text-[#1E0771] text-3xl sm:text-4xl font-bold">
                        Operasional
                    </h1>
                </div>
                <div className={`${getAnimationClass('division', 'fadeIn', 300)}`}>
                    <DivisionComponent />
                </div>
            </section>

            <section className="w-full bg-gradient-to-b from-[#1B054E] to-[#7449B6]">
                <div className={`flex flex-col items-center w-full bg-white py-4 md:py-6 rounded-sm ${getAnimationClass('division', 'slideInFromTop', 500)}`}>
                    <h1 className="text-[#1E0771] text-3xl sm:text-4xl font-bold">
                        Organisasi
                    </h1>
                </div>
                <div className={`${getAnimationClass('division', 'fadeIn', 700)}`}>
                    <OrganisasiComponent />
                </div>
            </section>

            {/* Projects Section */}
            <section className="w-full bg-white" id="projects" ref={projectsRef}>
                <div className={`flex flex-col items-center w-full py-4 md:py-6 md:mt-0 mt-10 ${getAnimationClass('projects', 'popIn')}`}>
                    <h1 className="text-[#301D54] text-3xl sm:text-4xl font-bold">
                        Our Latest Projects
                    </h1>
                </div>
                <div className={`px-4 md:px-0 ${getAnimationClass('projects', 'fadeIn', 300)}`}>
                    <ProjectComponent />
                </div>
            </section>

            {/* Achievements Section */}
            <section id="achievements" className="w-full mb-16 md:mb-32 md:mt-0 mt-10" ref={achievementsRef}>
                <div className={`flex flex-col items-center w-full py-4 md:py-6 md:my-12 ${getAnimationClass('achievements', 'popIn')}`}>
                    <h1 className="text-[#301D54] text-3xl sm:text-4xl font-bold mb-6">
                        Our Achievements
                    </h1>
                </div>
                <div className={`px-4 md:px-0 ${getAnimationClass('achievements', 'slideInFromBottom', 300)}`}>
                    <AchievementComponent />
                </div>
            </section>

            {/* Jumbotron */}
            <section id="jumbotron" className="bg-gradient-to-b from-[#1B054E] to-[#7449B6] py-20 md:py-40 flex flex-col items-center justify-center gap-8 md:gap-16 px-4 md:px-0 relative" ref={jumbotronRef}>
                <img src="/assets/landing/Group172.png" className={`absolute left-0 md:block hidden ${getAnimationClass('jumbotron', 'slideInFromLeft', 300)}`} />
                <img src="/assets/landing/Group173.png" className={`absolute right-0 top-28 md:block hidden ${getAnimationClass('jumbotron', 'slideInFromRight', 300)}`} />

                <h1 className={`text-white text-2xl sm:text-3xl font-bold text-center px-4 z-10 ${getAnimationClass('jumbotron', 'fadeIn')}`}>
                    Tertarik untuk menjadi bagian dari UKM Neo Telemetri?
                </h1>
                <button className={`border-2 border-white px-8 sm:px-12 md:px-16 py-3 sm:py-4 md:py-6 text-xl sm:text-2xl md:text-3xl bg-white rounded-2xl font-bold hover:cursor-pointer hover:bg-gray-300 hover:scale-105 transition-all duration-300 text-[#170033] ${getAnimationClass('jumbotron', 'popIn', 300)}`}>
                    Ayo Daftar!
                </button>
            </section>

            {/* Footer */}
            <section id="about" className="bg-[#8471AB] flex flex-col-reverse lg:grid lg:grid-cols-2 py-24 md:py-48 px-6 md:px-12 lg:px-48 gap-8" ref={aboutRef}>
                {/* Kiri - Logo & Alamat */}
                <div className={`flex flex-col gap-8 text-center lg:text-left w-full max-w-lg mx-auto ${getAnimationClass('about', 'slideInFromLeft')}`}>
                    <img src="/images/neowhite.svg" className="w-40 md:w-56 mx-auto lg:mx-0" alt="Neo Logo" />
                    <p className="text-white lg:text-justify">
                        Neo Telemetri, Lt. 2, Gedung Pusat Kegiatan Mahasiswa, Universitas Andalas, Kota Padang, Sumatera Barat, Indonesia.
                    </p>
                    {/* Sosial Media */}
                    <div className="flex justify-center lg:justify-start gap-3 flex-wrap">
                        <button className="bg-white rounded-full p-2 size-10 flex items-center justify-center hover:bg-gray-300 transition-all duration-300 hover:scale-110">
                            <FaInstagram className="text-xl text-quarterary" />
                        </button>
                        <button className="bg-white rounded-full p-2 size-10 flex items-center justify-center hover:bg-gray-300 transition-all duration-300 hover:scale-110">
                            <FaFacebook className="text-xl text-quarterary" />
                        </button>
                        <button className="bg-white rounded-full p-2 size-10 flex items-center justify-center hover:bg-gray-300 transition-all duration-300 hover:scale-110">
                            <FaTwitter className="text-xl text-quarterary" />
                        </button>
                        <button className="bg-white rounded-full p-2 size-10 flex items-center justify-center hover:bg-gray-300 transition-all duration-300 hover:scale-110">
                            <FaTiktok className="text-xl text-quarterary" />
                        </button>
                    </div>
                </div>

                {/* Kanan - Kontak & Link */}
                <div className={`flex flex-col gap-8 text-white text-center lg:text-left w-full max-w-lg mx-auto mt-8 lg:mt-4 ${getAnimationClass('about', 'slideInFromRight')}`}>
                    {/* Kontak */}
                    <div>
                        <h4 className="font-bold mb-2">Kontak</h4>
                        <p className="font-light">+62 9203-2920 -02</p>
                    </div>

                    {/* Relate */}
                    <div className="flex flex-col gap-3">
                        <h4 className="font-bold">Relate</h4>
                        <a href="#" className="font-light hover:underline cursor-pointer transition-all duration-300 hover:translate-x-2">
                            Profile Neo Telemetri
                        </a>
                        <a href="#" className="font-light hover:underline cursor-pointer transition-all duration-300 hover:translate-x-2">
                            Marketing Neo Telemetri
                        </a>
                        <a href="#" className="font-light hover:underline cursor-pointer transition-all duration-300 hover:translate-x-2">
                            Portofolio Neo Telemetri
                        </a>
                    </div>
                </div>
            </section>

            {/* Background Decoration - Hidden on mobile, visible on large screens */}
            <img
                src="/assets/bg/Ellipse19.svg"
                alt="Decor 1"
                className={`absolute top-[0%] right-[0%] hidden lg:block ${getBgDecorAnimationClass(0)}`}
            />
            <img
                src="/assets/bg/Ellipse23.svg"
                alt="Decor 2"
                className={`absolute top-[8%] right-[0%] -z-10 hidden lg:block ${getBgDecorAnimationClass(1)}`}
            />
            <img
                src="/assets/bg/Ellipse24.svg"
                alt="Decor 3"
                className={`absolute left-[30%] top-[8%] -z-10 hidden lg:block ${getBgDecorAnimationClass(2)}`}
            />
            <img
                src="/assets/bg/Ellipse19.svg"
                alt="Decor 4"
                className={`absolute top-[45%] right-[0%] hidden lg:block ${getBgDecorAnimationClass(3)}`}
            />
            <img
                src="/assets/bg/Ellipse25.svg"
                alt="Decor 5"
                className={`absolute top-[52%] left-[0%] hidden lg:block ${getBgDecorAnimationClass(4)}`}
            />
            <img
                src="/assets/bg/Ellipse26.svg"
                alt="Decor 6"
                className={`absolute top-[60%] left-[0%] -z-10 hidden lg:block ${getBgDecorAnimationClass(5)}`}
            />
            <img
                src="/assets/bg/Ellipse27.svg"
                alt="Decor 7"
                className={`absolute top-[62%] right-[0%] hidden lg:block ${getBgDecorAnimationClass(6)}`}
            />
        </div>
    );
};

export default Landing;