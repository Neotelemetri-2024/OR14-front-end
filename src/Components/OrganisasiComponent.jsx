import { motion, useInView, useAnimation } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const div = [
    {
        division: "Organizing Committee",
        logo: "oc",
        desc: "OC berperan dalam perencanaan dan pelaksanaan acara atau kegiatan Neo Telemetri. Anggota akan belajar bagaimana mengatur timeline, menyusun konsep acara, serta memastikan setiap kegiatan berjalan dengan lancar."
    },
    {
        division: "Marketing",
        logo: "marketing",
        desc: "divisi ini berfokus pada strategi pemasaran digital untuk produk Neo Telemetri serta pengelolaan proyek yang masuk. Anggota akan belajar bagaimana menyusun strategi promosi, mengelola brand produk Neo, serta memastikan proyek yang masuk dapat berjalan dengan optimal dan memberikan manfaat bagi client  maupun organisasi.h"
    },
    {
        division: "HRD",
        logo: "hrd",
        desc: "HRD bertanggung jawab atas pengelolaan dan pengembangan anggota Neo Telemetri. Subdivisi ini berfokus pada rekrutmen, pelatihan, serta peningkatan soft skill dan teamwork, sehingga setiap anggota dapat berkembang secara profesional dan pribadi dalam organisasi."
    },
    {
        division: "Public Relation",
        logo: "pr",
        desc: "divisi ini berperan sebagai jembatan komunikasi antara Neo Telemetri dengan pihak eksternal maupun internal. Anggota PR akan belajar cara membangun citra positif organisasi melalui media sosial, publikasi, serta relasi dengan komunitas dan mitra eksternal."
    }
];

const OrganisasiComponent = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState(null);

    // Animation controls
    const controls = useAnimation();

    // Ref for the component container to detect when it's in view
    const ref = useRef(null);

    // UseInView hook to detect when the component is in viewport
    const isInView = useInView(ref, {
        once: false,     // Animation will trigger every time it comes into view
        amount: 0.2      // 20% of the component needs to be visible to trigger
    });

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Trigger animation when component comes into view
    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        } else {
            controls.start("hidden");
        }
    }, [isInView, controls]);

    // For mobile: toggle expanded state
    const toggleExpand = (index) => {
        if (isMobile || isTablet) {
            setExpandedIndex(expandedIndex === index ? null : index);
        }
    };

    // Container animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    // Card variants - different animations for each card
    const getCardVariants = (index) => {
        const baseVariants = {
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
                opacity: 1,
                scale: 1,
                transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    delay: index * 0.1
                }
            }
        };

        // Different entry animations based on index
        switch (index % 4) {
            case 0: // Zoom and rotate from top-left
                return {
                    ...baseVariants,
                    hidden: {
                        opacity: 0,
                        scale: 0.5,
                        x: -50,
                        y: -50,
                        rotate: -10
                    },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        x: 0,
                        y: 0,
                        rotate: 0,
                        transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                            delay: index * 0.15
                        }
                    }
                };
            case 1: // Slide in from right
                return {
                    ...baseVariants,
                    hidden: { opacity: 0, x: 100 },
                    visible: {
                        opacity: 1,
                        x: 0,
                        transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            delay: index * 0.15
                        }
                    }
                };
            case 2: // Slide up with bounce
                return {
                    ...baseVariants,
                    hidden: { opacity: 0, y: 100 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                            type: "spring",
                            stiffness: 500,
                            damping: 15, // Less damping for more bounce
                            delay: index * 0.15
                        }
                    }
                };
            case 3: // Fade in with scale
                return {
                    ...baseVariants,
                    hidden: { opacity: 0, scale: 1.2 },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        transition: {
                            type: "spring",
                            stiffness: 200,
                            damping: 25,
                            delay: index * 0.15
                        }
                    }
                };
            default:
                return baseVariants;
        }
    };

    // Text reveal animation
    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.2 }
        }
    };

    // Create a custom color for each division
    const getDivisionColor = (index) => {
        const colors = [
            'bg-gradient-to-br from-purple-500 to-indigo-600',  // Purple to Indigo
            'bg-gradient-to-br from-blue-500 to-cyan-600',      // Blue to Cyan
            'bg-gradient-to-br from-emerald-500 to-teal-600',   // Emerald to Teal
            'bg-gradient-to-br from-rose-500 to-pink-600'       // Rose to Pink
        ];
        return colors[index % colors.length];
    };

    // 3D hover effect with different intensities
    const get3DHoverEffect = (index, isHovered) => {
        if (!isHovered) return {};

        // Different 3D effects based on card position
        const effects = [
            { rotateX: '5deg', rotateY: '5deg', z: 20 },      // Subtle top-right tilt
            { rotateX: '-5deg', rotateY: '-5deg', z: 25 },    // Subtle bottom-left tilt
            { rotateX: '8deg', rotateY: '-3deg', z: 30 },     // Medium top-left tilt
            { rotateX: '-3deg', rotateY: '8deg', z: 15 }      // Medium bottom-right tilt
        ];

        const effect = effects[index % effects.length];

        return {
            transform: `perspective(800px) rotateX(${effect.rotateX}) rotateY(${effect.rotateY}) translateZ(${effect.z}px)`
        };
    };

    return (
        <div className="py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto" ref={ref}>
            {/* Cards Division with Staggered Animation */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={controls} // Using animation controls instead of "visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
            >
                {div.map((division, index) => (
                    <motion.div
                        key={index}
                        variants={getCardVariants(index)}
                        onHoverStart={() => setHoveredIndex(index)}
                        onHoverEnd={() => setHoveredIndex(null)}
                        onClick={() => toggleExpand(index)}
                        className={`rounded-xl overflow-hidden transition-all duration-500 border border-white/10
                                 ${hoveredIndex === index ? 'shadow-xl shadow-white/10 transform-gpu scale-105' : 'shadow-md'}
                                 ${(isMobile || isTablet) && expandedIndex === index ? 'h-auto' : ''}
                                 h-full`}
                        style={get3DHoverEffect(index, hoveredIndex === index)}
                    >
                        {/* Card Header with Custom Gradient */}
                        <div className={`${getDivisionColor(index)} p-4 md:p-5`}>
                            <h2 className="text-xl md:text-2xl text-white font-bold">
                                {division.division}
                            </h2>
                        </div>

                        {/* Card Body */}
                        <div className="bg-white p-4 md:p-6 flex flex-col h-full">
                            <motion.p
                                variants={textVariants}
                                className="text-sm md:text-base text-gray-700 flex-grow text-justify"
                            >
                                {division.desc}
                            </motion.p>

                            {/* Interactive Element */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-4 text-center"
                            >
                                <a
                                    href="#"
                                    className={`inline-block px-4 py-2 rounded-lg text-white text-sm md:text-base font-medium transition-all duration-300 ${getDivisionColor(index)} hover:opacity-90`}
                                >
                                    Lihat Detail
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Decorative Elements */}
            <div className="mt-16 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={controls} // Using animation controls
                    variants={{
                        hidden: { opacity: 0, scale: 0 },
                        visible: { opacity: 0.7, scale: 1, transition: { delay: 1.2, duration: 0.8 } }
                    }}
                    className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-purple-500/10 blur-xl hidden lg:block"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={controls} // Using animation controls
                    variants={{
                        hidden: { opacity: 0, scale: 0 },
                        visible: { opacity: 0.5, scale: 1, transition: { delay: 1.4, duration: 0.8 } }
                    }}
                    className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-blue-500/10 blur-xl hidden lg:block"
                />
            </div>
        </div>
    );
};

export default OrganisasiComponent;