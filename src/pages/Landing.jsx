import { useEffect, useRef } from "react";
import { useState } from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import DivisionComponent from "../components/DivisionComponent";
import ProjectComponent from "../components/ProjectComponent";
import AchievementComponent from "../components/AchievementComponent";
import { useNavigate } from "react-router-dom";
import OrganisasiComponent from "../components/OrganisasiComponent";
import { motion, useAnimation, useInView } from "framer-motion";

const Landing = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [isScrolled, setIsScrolled] = useState(false);

    const navigate = useNavigate();

    // Refs for all major sections
    const homeRef = useRef(null);
    const divisionRef = useRef(null);
    const projectsRef = useRef(null);
    const achievementsRef = useRef(null);
    const jumbotronRef = useRef(null);
    const aboutRef = useRef(null);
    const operationalRef = useRef(null);
    const organisasiRef = useRef(null);

    const divisionInView = useInView(divisionRef, { once: false, amount: 0.1 });
    const projectsInView = useInView(projectsRef, { once: false, amount: 0.1 });
    const achievementsInView = useInView(achievementsRef, { once: false, amount: 0.1 });
    const jumbotronInView = useInView(jumbotronRef, { once: false, amount: 0.1 });
    const aboutInView = useInView(aboutRef, { once: false, amount: 0.1 });
    const operationalInView = useInView(operationalRef, { once: false, amount: 0.1 });
    const organisasiInView = useInView(organisasiRef, { once: false, amount: 0.1 });

    // Animation controls
    const homeControls = useAnimation();
    const divisionControls = useAnimation();
    const projectsControls = useAnimation();
    const achievementsControls = useAnimation();
    const jumbotronControls = useAnimation();
    const aboutControls = useAnimation();
    const operationalControls = useAnimation();
    const organisasiControls = useAnimation();

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } }
    };

    const slideInFromLeft = {
        hidden: { x: -100, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const slideInFromRight = {
        hidden: { x: 100, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const slideInFromBottom = {
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const popIn = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] } }
    };

    const staggerChildren = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const decorationVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8 } }
    };

    // Floating decoration variants
    const floatingVariant = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: [0, -10, 0],
            transition: {
                y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                opacity: { duration: 0.5 }
            }
        }
    };

    const pulseVariant = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: [1, 1.05, 1],
            transition: {
                scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                opacity: { duration: 0.5 }
            }
        }
    };

    const bounceVariant = {
        hidden: { opacity: 0, y: 0 },
        visible: {
            opacity: 1,
            y: [0, -15, 0],
            transition: {
                y: { repeat: Infinity, duration: 1.5, ease: "easeOut" },
                opacity: { duration: 0.5 }
            }
        }
    };

    const wiggleVariant = {
        hidden: { opacity: 0, rotate: 0 },
        visible: {
            opacity: 1,
            rotate: [-5, 5, -5, 5, 0],
            transition: {
                rotate: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                opacity: { duration: 0.5 }
            }
        }
    };

    // Autostart home animations when page loads
    useEffect(() => {
        homeControls.start("visible");
    }, [homeControls]);

    // Individual useEffects for each section for better control
    useEffect(() => {
        if (divisionInView) divisionControls.start("visible");
    }, [divisionInView, divisionControls]);

    useEffect(() => {
        if (projectsInView) projectsControls.start("visible");
    }, [projectsInView, projectsControls]);

    useEffect(() => {
        if (achievementsInView) achievementsControls.start("visible");
    }, [achievementsInView, achievementsControls]);

    useEffect(() => {
        if (jumbotronInView) jumbotronControls.start("visible");
    }, [jumbotronInView, jumbotronControls]);

    useEffect(() => {
        if (aboutInView) aboutControls.start("visible");
    }, [aboutInView, aboutControls]);

    useEffect(() => {
        if (operationalInView) operationalControls.start("visible");
    }, [operationalInView, operationalControls]);

    useEffect(() => {
        if (organisasiInView) organisasiControls.start("visible");
    }, [organisasiInView, organisasiControls]);

    useEffect(() => {
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

        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setIsMenuOpen(false);
            }
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
        <div className="pt-4 relative w-full overflow-x-hidden" id="home" ref={homeRef}>
            {/* Navbar */}
            <motion.nav
                className={`sticky top-0 flex flex-row justify-between items-center px-4 md:px-8 mb-8 md:mb-12 lg:mb-0 bg-white w-full ${isScrolled ? "drop-shadow-md" : ""} z-10 transition-all duration-300`}
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <img src="/images/or14.svg" className="w-32 md:w-40 lg:w-56" alt="Logo" />

                {/* Desktop Navigation */}
                <div className="hidden lg:flex flex-row justify-between items-center gap-4 lg:gap-8 text-lg lg:text-xl font-semibold">
                    {["home", "division", "projects", "achievements", "about"].map((section, index) => (
                        <motion.button
                            key={section}
                            className={`border-2 rounded-xl px-4 lg:px-8 py-1 border-secondary text-secondary hover:bg-secondary hover:text-white hover:cursor-pointer transition-all duration-300 ${activeSection === section ? "bg-secondary text-white transform scale-105" : ""}`}
                            onClick={() => scrollToSection(section)}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </motion.button>
                    ))}
                </div>

                {/* Burger Menu Button Mobile */}
                <motion.button
                    className="lg:hidden text-secondary p-2 hover:cursor-pointer hover:bg-gray-200 focus:outline-none transition-transform duration-300"
                    onClick={toggleMenu}
                    aria-label="Toggle Menu"
                    whileTap={{ scale: 0.9 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </motion.button>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        className="lg:hidden fixed top-20 right-0 mt-2 bg-white shadow-lg rounded-lg z-50 w-64 max-w-full"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="flex flex-col p-4 gap-3"
                            variants={staggerChildren}
                            initial="hidden"
                            animate="visible"
                        >
                            {["home", "division", "projects", "achievements", "about"].map((section,) => (
                                <motion.button
                                    key={section}
                                    className={`border-2 rounded-xl px-4 py-2 border-secondary text-secondary hover:bg-secondary hover:cursor-pointer hover:text-white transition-all duration-300 ${activeSection === section ? "bg-secondary text-white" : ""}`}
                                    onClick={() => scrollToSection(section)}
                                    variants={slideInFromRight}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {section.charAt(0).toUpperCase() + section.slice(1)}
                                </motion.button>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </motion.nav>

            {/* Home */}
            <section className="flex flex-col md:flex-row items-center lg:px-0 px-8">
                <motion.div
                    className="w-full lg:w-1/2 flex flex-col justify-start mt-8 md:mt-0 md:ml-4 lg:ml-16 px-4 md:px-0"
                    variants={staggerChildren}
                    initial="hidden"
                    animate="visible" // Guarantee visible on load
                >
                    <motion.h1 variants={slideInFromLeft} className="text-secondary text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 lg:mb-4">Open Recruitment 14</motion.h1>
                    <motion.h1 variants={slideInFromLeft} className="text-secondary text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 lg:mb-12">UKM Neo Telemetri</motion.h1>
                    <motion.p variants={fadeIn} className="text-tertiary text-base sm:text-lg md:text-xl font-regular text-justify mb-6 md:mb-10 lg:mb-16 pr-34">
                        Ayo! menjadi bagian dari Unit Kegiatan Mahasiswa berbasis IT terbesar di Universitas Andalas.
                    </motion.p>
                    <motion.div variants={slideInFromBottom} className="flex flex-col sm:flex-row gap-4 lg:justify-between justify-evenly items-center lg:max-w-1/2">
                        <motion.button
                            className="w-full sm:w-auto border-2 px-6 sm:px-8 md:px-12 py-2 md:py-3 border-primary text-white bg-primary rounded-xl text-lg sm:text-xl md:text-2xl font-semibold hover:bg-white hover:text-primary hover:cursor-pointer transition-all duration-300"
                            onClick={() => navigate("/auth?mode=register")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Daftar
                        </motion.button>
                        <motion.button
                            className="w-full sm:w-auto border-2 px-6 sm:px-8 md:px-12 py-2 md:py-3 border-gray-300 text-secondary rounded-xl text-lg sm:text-xl md:text-2xl font-semibold hover:bg-gray-300 hover:text-secondary hover:cursor-pointer transition-all duration-300"
                            onClick={() => navigate("/auth?mode=login")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Masuk
                        </motion.button>
                    </motion.div>
                </motion.div>

                <div className="w-full md:w-1/2 hidden md:flex justify-center items-center pb-24 relative">
                    {/* Card di atas foto */}
                    <motion.div
                        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/4 bg-secondary text-white rounded-3xl px-24 py-1 text-center shadow-lg z-10"
                        variants={popIn}
                        initial="hidden"
                        animate="visible" // Guarantee visible on load
                    >
                        <p className="text-sm font-medium mb-1">Ketua Neo Telemetri</p>
                        <h3 className="text-xl font-bold">Abdalul Fikri</h3>
                    </motion.div>

                    {/* Enhanced animations for decorative elements */}
                    <motion.img
                        src="/assets/landing/Group170.png"
                        className="absolute right-128 bottom-36 md:block hidden"
                        variants={floatingVariant}
                        initial="hidden"
                        animate="visible" // Guarantee visible on load
                    />
                    <motion.img
                        src="/assets/landing/Group171.png"
                        className="absolute right-0 top-30 md:block hidden"
                        variants={pulseVariant}
                        initial="hidden"
                        animate="visible" // Guarantee visible on load
                    />
                    <motion.img
                        src="/assets/programming.svg"
                        className="absolute left-50 top-40 md:block hidden h-12 -rotate-30"
                        variants={floatingVariant}
                        initial="hidden"
                        animate="visible" // Guarantee visible on load
                    />
                    <motion.img
                        src="/assets/multimedia.svg"
                        className="absolute right-40 top-40 md:block hidden h-16"
                        variants={bounceVariant}
                        initial="hidden"
                        animate="visible" // Guarantee visible on load
                    />
                    <motion.img
                        src="/assets/skj.svg"
                        className="absolute right-30 bottom-40 md:block hidden h-16"
                        variants={wiggleVariant}
                        initial="hidden"
                        animate="visible" // Guarantee visible on load
                    />

                    <motion.img
                        src="/assets/fikri.png"
                        className="max-w-full h-auto relative z-0 md:block hidden"
                        variants={popIn}
                        initial="hidden"
                        animate="visible" // Guarantee visible on load
                    />
                </div>
            </section>

            <section className="flex flex-col md:flex-row items-center lg:px-0 px-8 mb-8 ">
                <div className="w-full md:w-1/2 hidden md:flex justify-center items-center pb-24 ">
                    <motion.img
                        src="/images/or14.svg"
                        className="right-128 bottom-36 md:block hidden w-3/4"
                        variants={slideInFromLeft}
                        initial="hidden"
                        animate="visible" // Guarantee visible on load
                    />
                </div>
                <motion.div
                    className="px-4 sm:px-6 md:px-12 pt-8 md:pt-12 pb-12 md:pb-24 lg:pb-28 bg-gradient-to-b from-[#1B054E] to-[#7449B6] w-full md:w-1/2 hidden md:block mr-10 rounded-2xl"
                    variants={slideInFromRight}
                    initial="hidden"
                    animate="visible" // Guarantee visible on load
                >
                    <h1 className="text-white text-2xl sm:text-2xl mb-4 md:mb-12 font-bold">Apa itu Open Recruitment UKM Neo Telemetri?</h1>
                    <p className="text-white text-base sm:text-lg md:text-xl font-light text-justify">Open Recruitment Neo Telemetri adalah proses seleksi untuk mencari dan merekrut mahasiswa Universitas Andalas angkatan 2023 dan 2024 yang memiliki semangat belajar dan berkembang di bidang teknologi maupun manajemen organisasi. Open Recruitment ini bukan sekadar rekrutmen biasa, tetapi merupakan kesempatan bagi mahasiswa untuk bergabung dengan komunitas inovatif dan berkembang bersama dalam ekosistem teknologi dan organisasi yang solid.h</p>
                </motion.div>
            </section>

            {/* Division Section */}
            <section className="w-full bg-gradient-to-b from-[#1B054E] to-[#7449B6] pb-20 md:pb-32" id="division" ref={divisionRef}>
                <motion.div
                    className="flex flex-col items-center w-full bg-white py-4 md:py-6 rounded-sm"
                    ref={operationalRef}
                    variants={slideInFromRight}
                    initial="hidden"
                    animate={operationalControls}
                >
                    <h1 className="text-[#1E0771] text-3xl sm:text-4xl font-bold">
                        Operasional
                    </h1>
                </motion.div>
                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate={operationalControls}
                >
                    <DivisionComponent />
                </motion.div>
            </section>

            <section className="w-full bg-gradient-to-b from-[#1B054E] to-[#7449B6] pb-12 md:pb-24">
                <motion.div
                    className="flex flex-col items-center w-full bg-white py-4 md:py-6 rounded-sm"
                    ref={organisasiRef}
                    variants={slideInFromLeft}
                    initial="hidden"
                    animate={organisasiControls}
                >
                    <h1 className="text-[#1E0771] text-3xl sm:text-4xl font-bold">
                        Organisasi
                    </h1>
                </motion.div>
                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate={organisasiControls}
                >
                    <OrganisasiComponent />
                </motion.div>
            </section>

            {/* Projects Section */}
            <section className="w-full bg-white py-6 md:py-10" id="projects" ref={projectsRef}>
                <motion.div
                    className="flex flex-col items-center w-full py-3 md:py-4"
                    variants={popIn}
                    initial="hidden"
                    animate={projectsControls}
                >
                    <h1 className="text-[#301D54] text-3xl sm:text-4xl font-bold">
                        Our Latest Projects
                    </h1>
                </motion.div>
                <motion.div
                    className="px-4 md:px-0 mt-2 md:mt-4"
                    variants={fadeIn}
                    initial="hidden"
                    animate={projectsControls}
                >
                    <ProjectComponent />
                </motion.div>
            </section>

            {/* Achievements Section */}
            <section id="achievements" className="w-full py-6 md:py-10 bg-gray-50" ref={achievementsRef}>
                <motion.div
                    className="flex flex-col items-center w-full py-3 md:py-4"
                    variants={popIn}
                    initial="hidden"
                    animate={achievementsControls}
                >
                    <h1 className="text-[#301D54] text-3xl sm:text-4xl font-bold mb-2">
                        Our Achievements
                    </h1>
                </motion.div>
                <motion.div
                    className="px-4 md:px-0 mt-2 md:mt-4"
                    variants={slideInFromBottom}
                    initial="hidden"
                    animate={achievementsControls}
                >
                    <AchievementComponent />
                </motion.div>
            </section>

            {/* Jumbotron with enhanced animations */}
            <section id="jumbotron" className="bg-gradient-to-b from-[#1B054E] to-[#7449B6] py-16 md:py-24 flex flex-col items-center justify-center gap-8 md:gap-16 px-4 md:px-0 relative mt-6 md:mt-8" ref={jumbotronRef}>

                <motion.h1
                    className="text-white text-2xl sm:text-3xl font-bold text-center px-4 z-10"
                    variants={fadeIn}
                    initial="hidden"
                    animate={jumbotronControls}
                >
                    Tertarik untuk menjadi bagian dari UKM Neo Telemetri?
                </motion.h1>
                <motion.button
                    className="border-2 border-white px-8 sm:px-12 md:px-16 py-3 sm:py-4 md:py-6 text-xl sm:text-2xl md:text-3xl bg-white rounded-2xl font-bold hover:cursor-pointer hover:bg-gray-300 text-[#170033]"
                    variants={popIn}
                    initial="hidden"
                    animate={jumbotronControls}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/auth?mode=login")}
                >
                    Ayo Daftar!
                </motion.button>
            </section>

            {/* Footer */}
            <section id="about" className="bg-[#8471AB] flex flex-col-reverse lg:grid lg:grid-cols-2 py-24 md:py-32 px-6 md:px-12 lg:px-48 gap-8" ref={aboutRef}>
                {/* Kiri - Logo & Alamat */}
                <motion.div
                    className="flex flex-col gap-8 text-center lg:text-left w-full max-w-lg mx-auto"
                    variants={slideInFromLeft}
                    initial="hidden"
                    animate={aboutControls}
                >
                    <img src="/images/neowhite.svg" className="w-40 md:w-56 mx-auto lg:mx-0" alt="Neo Logo" />
                    <p className="text-white lg:text-justify">
                        Neo Telemetri, Lt. 2, Gedung Pusat Kegiatan Mahasiswa, Universitas Andalas, Kota Padang, Sumatera Barat, Indonesia.
                    </p>
                    {/* Sosial Media with staggered animations */}
                    <motion.div
                        className="flex justify-center lg:justify-start gap-3 flex-wrap"
                        variants={staggerChildren}
                        initial="hidden"
                        animate={aboutControls}
                    >
                        <motion.button
                            className="bg-white rounded-full p-2 size-10 flex items-center justify-center hover:bg-gray-300 transition-all duration-300"
                            variants={fadeIn}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaInstagram className="text-xl text-quarterary" />
                        </motion.button>
                        <motion.button
                            className="bg-white rounded-full p-2 size-10 flex items-center justify-center hover:bg-gray-300 transition-all duration-300"
                            variants={fadeIn}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaFacebook className="text-xl text-quarterary" />
                        </motion.button>
                        <motion.button
                            className="bg-white rounded-full p-2 size-10 flex items-center justify-center hover:bg-gray-300 transition-all duration-300"
                            variants={fadeIn}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaTwitter className="text-xl text-quarterary" />
                        </motion.button>
                        <motion.button
                            className="bg-white rounded-full p-2 size-10 flex items-center justify-center hover:bg-gray-300 transition-all duration-300"
                            variants={fadeIn}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaTiktok className="text-xl text-quarterary" />
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Kanan - Kontak & Link */}
                <motion.div
                    className="flex flex-col gap-8 text-white text-center lg:text-left w-full max-w-lg mx-auto mt-8 lg:mt-4"
                    variants={slideInFromRight}
                    initial="hidden"
                    animate={aboutControls}
                >
                    {/* Kontak */}
                    <div>
                        <h4 className="font-bold mb-2">Kontak (Ainul)</h4>
                        <a href="https://wa.me/6281328161732" className="font-light">Klik disini</a>
                    </div>

                    {/* Relate with staggered animations */}
                    <motion.div
                        className="flex flex-col gap-3"
                        variants={staggerChildren}
                        initial="hidden"
                        animate={aboutControls}
                    >
                        <h4 className="font-bold">Relate</h4>
                        <motion.a
                            href="https://www.neotelemetri.id"
                            target="_blank"
                            className="font-light hover:underline cursor-pointer transition-all duration-300"
                            variants={slideInFromRight}
                            whileHover={{ x: 10, transition: { duration: 0.2 } }}
                        >
                            Profile Neo Telemetri
                        </motion.a>
                        <motion.a
                            href="https://www.neotelemetri.id"
                            className="font-light hover:underline cursor-pointer transition-all duration-300"
                            variants={slideInFromRight}
                            whileHover={{ x: 10, transition: { duration: 0.2 } }}
                        >
                            Marketing Neo Telemetri
                        </motion.a>
                        <motion.a
                            href="https://drive.google.com/file/d/1VXZTxNkrh3XIqg983OZNwaOFjGahWyaP/view?fbclid=PAZXh0bgNhZW0CMTEAAacvDSqtO2mEI1lhR8mWgI6GMhw4N4YAJZW_Uia2P70DBs0YgkMyka5hxTsOVA_aem_ABVMgpVpyUJCrQ1SN0Zmsw"
                            className="font-light hover:underline cursor-pointer transition-all duration-300"
                            variants={slideInFromRight}
                            whileHover={{ x: 10, transition: { duration: 0.2 } }}
                        >
                            Portofolio Neo Telemetri
                        </motion.a>
                    </motion.div>
                </motion.div>
            </section>

            {/* Background Decoration - Enhanced with framer motion */}
            <motion.img
                src="/assets/bg/Ellipse19.svg"
                alt="Decor 1"
                className="absolute top-[0%] right-[0%] hidden lg:block"
                variants={decorationVariants}
                initial="hidden"
                animate="visible"
            />
            <motion.img
                src="/assets/bg/Ellipse23.svg"
                alt="Decor 2"
                className="absolute top-[8%] right-[0%] -z-10 hidden lg:block"
                variants={decorationVariants}
                initial="hidden"
                animate="visible"
            />
            <motion.img
                src="/assets/bg/Ellipse24.svg"
                alt="Decor 3"
                className="absolute left-[30%] top-[8%] -z-10 hidden lg:block"
                variants={decorationVariants}
                initial="hidden"
                animate="visible"
            />
            <motion.img
                src="/assets/bg/Ellipse19.svg"
                alt="Decor 4"
                className="absolute top-[45%] right-[0%] hidden lg:block"
                variants={pulseVariant}
                initial="hidden"
                animate="visible"
            />
            <motion.img
                src="/assets/bg/Ellipse25.svg"
                alt="Decor 5"
                className="absolute top-[52%] left-[0%] hidden lg:block"
                variants={floatingVariant}
                initial="hidden"
                animate="visible"
            />
            <motion.img
                src="/assets/bg/Ellipse26.svg"
                alt="Decor 6"
                className="absolute top-[60%] left-[0%] -z-10 hidden lg:block"
                variants={decorationVariants}
                initial="hidden"
                animate="visible"
            />
            <motion.img
                src="/assets/bg/Ellipse27.svg"
                alt="Decor 7"
                className="absolute top-[62%] right-[0%] hidden lg:block"
                variants={wiggleVariant}
                initial="hidden"
                animate="visible"
            />
        </div>
    );
};

export default Landing;