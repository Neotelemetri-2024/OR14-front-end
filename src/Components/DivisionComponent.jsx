import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const div = [
    {
        division: "Multimedia dan Desain",
        logo: "mmd",
        subdivision: [
            {
                name: "UIUX",
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

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((currentIndex) => (currentIndex + 1) % div.length);
    }

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((currentIndex) => (currentIndex - 1 + div.length) % div.length);
    }

    const data = div[currentIndex];

    return (
        <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Division Header */}
            <div className="flex flex-row justify-start py-5 sm:py-8 md:py-10 items-center">
                <motion.img
                    key={data.logo}
                    src={`/assets/${data.logo}.svg`}
                    className={`w-16 sm:w-24 md:w-32 lg:w-36 ml-4 sm:ml-8 md:ml-16 lg:ml-28 ${data.logo === "mmd" ? 'rotate-20' : ''}`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={data.division}
                        className="ml-4 sm:ml-8 md:ml-12 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-semibold"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        {data.division}
                    </motion.h1>
                </AnimatePresence>
            </div>

            {/* Cards Subdivision */}
            <div className="flex flex-row justify-between relative px-2 sm:px-6 md:px-8 lg:px-12 items-center">
                <FaAngleLeft
                    className="text-white hover:cursor-pointer hover:text-gray-300 z-10"
                    size={isMobile ? 40 : isTablet ? 60 : 100}
                    onClick={handlePrev}
                />
                <div className="overflow-hidden w-full flex justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ x: direction * 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -direction * 100, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="flex flex-col lg:flex-row justify-between gap-4 md:gap-6 lg:gap-8 w-full"
                        >
                            {data.subdivision?.map((subdiv, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl pt-4 sm:pt-6 md:pt-8 
                                    px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12
                                    pb-16 sm:pb-24 md:pb-32 lg:pb-48
                                    hover:bg-gray-300 hover:shadow-lg transition-all duration-300 
                                    mb-4 lg:mb-0 w-full max-w-full lg:max-w-lg xl:max-w-2xl"
                                >
                                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-secondary font-bold">{subdiv.name}</h2>
                                    <p className="text-[#170033] mt-2 sm:mt-4 md:mt-6 lg:mt-8 text-justify text-sm sm:text-base md:text-xl lg:text-2xl">
                                        {subdiv.desc}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <FaAngleRight
                    className="text-white hover:cursor-pointer hover:text-gray-300 z-10"
                    size={isMobile ? 40 : isTablet ? 60 : 100}
                    onClick={handleNext}
                />
            </div>
        </div>
    )
}

export default DivisionComponent;