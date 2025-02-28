import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import { useState } from "react";
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
        <div>
            <div className="flex flex-row justify-start py-10 items-center">
                <motion.img
                    key={data.logo}
                    src={`/assets/${data.logo}.svg`}
                    className={`w-36 ml-28 ${data.logo === "mmd" ? 'rotate-20' : ''}`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={data.division}
                        className="ml-12 text-5xl text-white font-semibold"
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
            <div className="flex flex-row justify-between relative px-12 items-center">
                <FaAngleLeft className="text-white hover:cursor-pointer hover:text-gray-300" size={100} onClick={handlePrev} />
                <div className="overflow-hidden w-full flex justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ x: direction * 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -direction * 100, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="flex flex-col lg:flex-row justify-between px-8 gap-8"
                        >
                            {data.subdivision?.map((subdiv, index) => (
                                <div key={index} className="bg-white rounded-xl pt-8 px-8 pb-48 hover:bg-gray-300 hover:shadow-lg transition-all duration-300">
                                    <h2 className="text-4xl text-secondary font-bold">{subdiv.name}</h2>
                                    <p className="text-[#170033] mt-8 text-justify text-2xl">
                                        {subdiv.desc}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <FaAngleRight className="text-white hover:cursor-pointer hover:text-gray-300" size={100} onClick={handleNext} />
            </div>
        </div>
    )
}

DivisionComponent.propTypes = {
    division: PropTypes.string.isRequired,
    logo: PropTypes.string
}

export default DivisionComponent;