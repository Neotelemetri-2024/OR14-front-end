import { motion } from "framer-motion";

const div = [
    {
        division: "Marketing",
        logo: "marketing",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu massa arcu. Aliquam a odio sodales, iaculis neque eget, commodo tellus. Fusce varius commodo lorem, vitae vulputate mi ullamcorper in."
    },
    {
        division: "Organizing Committee",
        logo: "oc",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu massa arcu. Aliquam a odio sodales, iaculis neque eget, commodo tellus. Fusce varius commodo lorem, vitae vulputate mi ullamcorper in."
    },
    {
        division: "HRD",
        logo: "hrd",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu massa arcu. Aliquam a odio sodales, iaculis neque eget, commodo tellus. Fusce varius commodo lorem, vitae vulputate mi ullamcorper in."
    },
    {
        division: "Public Relation",
        logo: "pr",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu massa arcu. Aliquam a odio sodales, iaculis neque eget, commodo tellus. Fusce varius commodo lorem, vitae vulputate mi ullamcorper in."
    }
];

const OrganisasiComponent = () => {
    return (
        <div className="py-20 px-4 md:px-8 lg:px-12">
            {/* Cards Division */}
            <div className="w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {div.map((division, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-white rounded-xl p-8 h-full hover:bg-gray-100 hover:shadow-lg transition-all duration-300"
                        >
                            <h2 className="text-2xl md:text-3xl text-secondary font-bold mb-4">{division.division}</h2>
                            <p className="text-[#170033] text-base md:text-lg text-justify">
                                {division.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default OrganisasiComponent;