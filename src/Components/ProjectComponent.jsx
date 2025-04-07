import { useState } from "react";
import { motion } from "framer-motion";

const projects = [
    {
        image: 'projects/agrowista.png',
        name: 'AgroWista',
        subdivisions: "Web Programming, Mobile Programming"
    },
    {
        image: 'projects/perceivo.png',
        name: 'Perceivo',
        subdivisions: "Mobile Programming"
    },
    {
        image: 'projects/simsapras.png',
        name: 'Simsapras',
        subdivisions: "Web Programming"
    },
    {
        image: 'projects/pixel.png',
        name: 'Pixel Bros 3D',
        subdivisions: "3D"
    },
    {
        image: 'projects/coffeeapp.png',
        name: 'CoffeeApp',
        subdivisions: "UIUX"
    },
    {
        image: 'projects/sprite.png',
        name: 'Sprite',
        subdivisions: "UIUX"
    },
];

const ProjectComponent = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const getProjectAnimation = (index) => {
        return index % 2 === 0
            ? {
                hidden: { y: 40, opacity: 0 },
                visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        delay: index * 0.08
                    }
                }
            }
            : {
                hidden: { y: -40, opacity: 0 },
                visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        delay: index * 0.08
                    }
                }
            };
    };

    return (
        <div className="w-full pt-8 pb-16 max-w-7xl mx-auto">

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-8 lg:px-12"
            >
                {projects.map((project, index) => (
                    <motion.div
                        key={index}
                        variants={getProjectAnimation(index)}
                        className="rounded-xl bg-white shadow-md overflow-hidden relative group"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        whileHover={{
                            y: -10,
                            transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 15
                            }
                        }}
                    >
                        {/* Image Container with Overlay on Hover */}
                        <div className="relative overflow-hidden aspect-auto">
                            {/* Decorative elements */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: hoveredIndex === index ? 0.6 : 0 }}
                                transition={{ duration: 0.3 }}
                            />

                            <motion.img
                                src={`/assets/${project.image}`}
                                className="w-full h-full object-cover transition-transform duration-700"
                                alt={project.name}
                                animate={{
                                    scale: hoveredIndex === index ? 1.08 : 1
                                }}
                                transition={{ duration: 0.7 }}
                            />

                            {/* Tag label */}
                        </div>

                        {/* Content */}
                        <div className="px-4 py-5">
                            <motion.div
                                className="flex flex-col"
                                animate={{
                                    y: hoveredIndex === index ? -5 : 0
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-[#301D54] font-bold text-xl">{project.name}</h3>
                                <p className="text-[#B1B1B1] font-medium text-sm mt-1">{project.subdivisions}</p>

                                {/* Decorative division bar */}
                                <motion.div
                                    className="w-12 h-1 bg-[#301D54] mt-3 rounded-full"
                                    initial={{ width: "20px" }}
                                    animate={{
                                        width: hoveredIndex === index ? "60px" : "20px"
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* See More Projects Button (decorative only) */}
            <motion.div
                className="mt-12 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                {/* <div className="inline-flex items-center gap-2 text-[#301D54] font-medium border-2 border-[#301D54] px-6 py-3 rounded-lg hover:bg-[#301D54] hover:text-white transition-colors duration-300">
                    <span>See More Projects</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div> */}
            </motion.div>

            <div className="absolute -z-10 opacity-5">
                <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default ProjectComponent;