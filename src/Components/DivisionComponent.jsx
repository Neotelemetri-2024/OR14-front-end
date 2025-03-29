import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const div = [
    {
        division: "Multimedia dan Desain",
        logo: "mmd",
        subdivision: [
            {
                name: "UI/UX",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu massa arcu. Aliquam a odio sodales, iaculis neque eget, commodo tellus. Fusce varius commodo lorem, vitae vulputate mi ullamcorper in."
            },
            {
                name: "Video Editing",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu massa arcu. Aliquam a odio sodales, iaculis neque eget, commodo tellus. Fusce varius commodo lorem, vitae vulputate mi ullamcorper in."
            },
            {
                name: "3D",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu massa arcu. Aliquam a odio sodales, iaculis neque eget, commodo tellus. Fusce varius commodo lorem, vitae vulputate mi ullamcorper in."
            }
        ]
    },
    {
        division: "Programming",
        logo: "programming",
        subdivision: [
            {
                name: "Web Programming",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu massa arcu. Aliquam a odio sodales, iaculis neque eget, commodo tellus. Fusce varius commodo lorem, vitae vulputate mi ullamcorper in."
            },
            {
                name: "Mobile Programming",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu massa arcu. Aliquam a odio sodales, iaculis neque eget, commodo tellus. Fusce varius commodo lorem, vitae vulputate mi ullamcorper in."
            },
            {
                name: "Machine learning",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu massa arcu. Aliquam a odio sodales, iaculis neque eget, commodo tellus. Fusce varius commodo lorem, vitae vulputate mi ullamcorper in."
            }
        ]
    },
    {
        division: "Sistem Komputer dan Jaringan",
        logo: "skj",
        subdivision: [
            {
                name: "Network",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu massa arcu. Aliquam a odio sodales, iaculis neque eget, commodo tellus. Fusce varius commodo lorem, vitae vulputate mi ullamcorper in."
            },
            {
                name: "System",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu massa arcu. Aliquam a odio sodales, iaculis neque eget, commodo tellus. Fusce varius commodo lorem, vitae vulputate mi ullamcorper in."
            }
        ]
    }
]

const DivisionComponent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [flippedCards, setFlippedCards] = useState({});

    // Handle responsive behavior based on screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };

        // Set initial values
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Reset flipped cards state when changing divisions
    useEffect(() => {
        setFlippedCards({});
    }, [currentIndex]);

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % div.length);
    }

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + div.length) % div.length);
    }

    const toggleFlip = (index) => {
        setFlippedCards(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    }

    const data = div[currentIndex];

    // Animation variants for smoother transitions
    const sectionVariants = {
        initial: (direction) => ({
            x: direction * 100,
            opacity: 0
        }),
        animate: {
            x: 0,
            opacity: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.5 },
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        },
        exit: (direction) => ({
            x: -direction * 100,
            opacity: 0,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 }
            }
        })
    };

    const cardVariants = {
        initial: { y: 50, opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20
            }
        }
    };

    // Logo animation variants
    const logoVariants = {
        initial: { opacity: 0, x: -50, scale: 0.8 },
        animate: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20
            }
        },
        exit: {
            opacity: 0,
            x: 50,
            scale: 0.8,
            transition: {
                duration: 0.3
            }
        }
    };

    // Title animation variants
    const titleVariants = {
        initial: { opacity: 0, x: -30 },
        animate: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.1
            }
        },
        exit: {
            opacity: 0,
            x: 30,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
            {/* Division Header with enhanced animations */}
            <div className="flex flex-row justify-start py-5 sm:py-6 md:py-8 items-center mb-6 sm:mb-8 md:mb-10">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={`logo-${data.logo}`}
                        src={`/assets/${data.logo}.svg`}
                        className={`w-12 sm:w-16 md:w-24 lg:w-28 ml-2 sm:ml-4 md:ml-8 lg:ml-12 ${data.logo === "mmd" ? 'rotate-20' : ''}`}
                        variants={logoVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    />
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    <motion.h1
                        key={`title-${data.division}`}
                        className="ml-4 sm:ml-6 md:ml-8 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-semibold"
                        variants={titleVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {data.division}
                    </motion.h1>
                </AnimatePresence>
            </div>

            {/* Cards Subdivision with enhanced animations and flip effect */}
            <div className="flex flex-row justify-between relative px-2 sm:px-4 md:px-6 lg:px-8 items-center">
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white hover:cursor-pointer hover:text-gray-300 z-10"
                    onClick={handlePrev}
                >
                    <FaAngleLeft size={isMobile ? 30 : isTablet ? 45 : 60} />
                </motion.div>

                <div className="overflow-hidden w-full flex justify-center">
                    <AnimatePresence custom={direction} mode="wait">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={sectionVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex flex-col lg:flex-row justify-between gap-3 md:gap-4 lg:gap-6 w-full"
                        >
                            {data.subdivision?.map((subdiv, index) => (
                                <motion.div
                                    key={index}
                                    variants={cardVariants}
                                    className="w-full h-full perspective-1000 my-2 lg:my-0"
                                    onClick={() => toggleFlip(index)}
                                >
                                    <div
                                        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flippedCards[index] ? 'rotate-y-180' : ''}`}
                                        style={{
                                            transformStyle: "preserve-3d",
                                            perspective: "1000px",
                                            height: isMobile ? "200px" : isTablet ? "250px" : "300px"
                                        }}
                                    >
                                        {/* Front of card */}
                                        <div
                                            className="absolute w-full h-full backface-hidden bg-white rounded-xl p-4 sm:p-6 
                                            flex flex-col justify-center items-center
                                            shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                                            style={{ backfaceVisibility: "hidden" }}
                                        >
                                            <h2 className="text-lg sm:text-xl md:text-2xl text-secondary font-bold mb-2 text-center">{subdiv.name}</h2>
                                            <div className="text-secondary text-sm md:text-base opacity-75">Lihat selengkapnya</div>
                                        </div>

                                        {/* Back of card */}
                                        <div
                                            className="absolute w-full h-full backface-hidden bg-secondary rounded-xl p-4 sm:p-6 
                                            text-white rotate-y-180 flex flex-col justify-center
                                            shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                                            style={{
                                                backfaceVisibility: "hidden",
                                                transform: "rotateY(180deg)"
                                            }}
                                        >
                                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{subdiv.name}</h2>
                                            <p className="text-xs sm:text-sm md:text-base text-white/90 overflow-auto">
                                                {subdiv.desc}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white hover:cursor-pointer hover:text-gray-300 z-10"
                    onClick={handleNext}
                >
                    <FaAngleRight size={isMobile ? 30 : isTablet ? 45 : 60} />
                </motion.div>
            </div>

            {/* Division Navigation Dots */}
            <div className="flex justify-center mt-6 md:mt-8 gap-2">
                {div.map((_, index) => (
                    <button
                        key={index}
                        className={`h-2 md:h-3 rounded-full transition-all duration-300 ${currentIndex === index ? "w-8 md:w-12 bg-white" : "w-2 md:w-3 bg-white/50"
                            }`}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        aria-label={`Go to division ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default DivisionComponent;