import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const achievements = [
    {
        title: "Finalis Juara Pimnas",
        awardee: [
            {
                name: "Berka Aldizar",
                division: "Programming"
            }
        ]
    },
    {
        title: "Finalis Juara Pimnas",
        awardee: [
            {
                name: "Berka Aldizar",
                division: "Programming"
            }
        ]
    },
    {
        title: "Finalis Juara Pimnas",
        awardee: [
            {
                name: "Berka Aldizar",
                division: "Programming"
            }
        ]
    },
    {
        title: "Finalis Juara Pimnas",
        awardee: [
            {
                name: "Berka Aldizar",
                division: "Programming"
            }
        ]
    },
    {
        title: "Finalis Juara Pimnas",
        awardee: [
            {
                name: "Berka Aldizar",
                division: "Programming"
            }
        ]
    },
    {
        title: "Finalis Juara Pimnas",
        awardee: [
            {
                name: "Berka Aldizar",
                division: "Programming"
            }
        ]
    },
]

const AchievementComponent = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };

        // Set initial value
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Custom scrollbar styles
    const scrollbarStyles = `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    `;

    // Animation variants
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

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const mobileCardVariants = {
        hidden: { opacity: 0, x: 30 },
        visible: index => ({
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: index * 0.1
            }
        })
    };

    // Enhanced trophy animation variants
    const trophyVariants = {
        hidden: { scale: 0, rotate: -15 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
            }
        }
    };

    // New trophy hover animations
    const trophyHoverVariants = {
        hover: {
            y: [-2, 2, -2],
            rotate: [0, -5, 5, -5, 0],
            scale: 1.15,
            transition: {
                y: {
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut"
                },
                rotate: {
                    duration: 0.8,
                    ease: "easeInOut"
                },
                scale: {
                    duration: 0.3
                }
            }
        }
    };

    // Award ribbon icon based on the image you shared
    const AwardIcon = () => (
        <svg width="48" height="48" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4C11.58 4 8 7.58 8 12C8 16.42 11.58 20 16 20C20.42 20 24 16.42 24 12C24 7.58 20.42 4 16 4ZM16 6C19.31 6 22 8.69 22 12C22 15.31 19.31 18 16 18C12.69 18 10 15.31 10 12C10 8.69 12.69 6 16 6Z" />
            <path d="M13 19L10 26V21M19 19L22 26V21" />
        </svg>
    );

    // Properly contained hover animation without white edge
    const hoverAnimation = {
        y: -5,
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.3 }
    };

    return (
        <div className="relative px-4 sm:px-6 md:px-8 lg:px-12 py-4 max-w-7xl mx-auto">
            <style>{scrollbarStyles}</style>
            {isMobile || isTablet ? (
                // Mobile & Tablet view - horizontal scrolling with proportional size
                <div className="relative">
                    <motion.div
                        className="overflow-x-auto scrollbar-hide pb-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="flex flex-row gap-4 sm:gap-6 w-max">
                            {achievements.map((achievement, index) => (
                                <motion.div
                                    key={index}
                                    custom={index}
                                    variants={mobileCardVariants}
                                    className="flex w-[280px] sm:w-[320px]"
                                >
                                    <motion.div
                                        className="flex flex-row items-stretch w-full bg-quarterary rounded-xl overflow-hidden"
                                        whileHover={hoverAnimation}
                                    >
                                        <div className="bg-secondary flex-shrink-0 flex items-center justify-center w-[60px] sm:w-[70px]">
                                            <motion.div
                                                variants={trophyVariants}
                                                whileHover="hover"
                                                className="text-white hover:text-yellow-400 transition-colors duration-300"
                                            >
                                                <motion.div variants={trophyHoverVariants}>
                                                    <AwardIcon />
                                                </motion.div>
                                            </motion.div>
                                        </div>
                                        <div className="flex flex-col justify-center pl-4 pr-4 py-4 flex-1">
                                            <h3 className="text-white font-bold text-base sm:text-lg break-words">{achievement.title}</h3>
                                            {achievement.awardee.map((data, i) => (
                                                <h4 className="text-white font-regular text-xs sm:text-sm" key={i}>{data.name}, {data.division}</h4>
                                            ))}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Scroll hint with animation */}
                    <motion.div
                        className="text-center text-gray-400 text-xs sm:text-sm opacity-80 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0.3, 0.8, 0.3],
                            transition: {
                                repeat: Infinity,
                                duration: 2
                            }
                        }}
                    >
                        Swipe untuk melihat lebih banyak
                    </motion.div>
                </div>
            ) : (
                // Desktop view - grid layout with better proportions
                <motion.div
                    className="grid lg:grid-cols-2 grid-cols-1 gap-8 lg:gap-12"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {achievements.map((achievement, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className="flex"
                        >
                            <motion.div
                                className="flex flex-row items-stretch w-full bg-quarterary rounded-xl overflow-hidden"
                                whileHover={hoverAnimation}
                            >
                                <div className="bg-secondary flex-shrink-0 flex items-center justify-center px-5 sm:px-6">
                                    <motion.div
                                        variants={trophyVariants}
                                        whileHover="hover"
                                        className="text-white hover:text-yellow-400 transition-colors duration-300"
                                    >
                                        <motion.div variants={trophyHoverVariants}>
                                            <AwardIcon />
                                        </motion.div>
                                    </motion.div>
                                </div>
                                <div className="flex flex-col justify-center pl-6 pr-16 sm:pr-24 md:pr-32 lg:pr-40 py-4">
                                    <h3 className="text-white font-bold text-xl md:text-2xl">{achievement.title}</h3>
                                    {achievement.awardee.map((data, i) => (
                                        <h4 className="text-white font-regular text-sm md:text-base" key={i}>{data.name}, {data.division}</h4>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}

export default AchievementComponent;