import PropTypes from "prop-types";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const div = [
    {
        division: "Multimedia dan Desain",
        logo: "mmd",
    },
    {
        division: "Programming",
        logo: "programming",
        subdivison: [
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
        logo: "skj"
    }
]

const DivisionComponent = () => {

    const data = div[1];
    return (
        <div>
            <div className="flex flex-row justify-start py-10 items-center">
                <img src={`/assets/${data.logo}.svg`} className={`w-36 ml-28 ${data.logo === "mmd" ? 'rotate-20' : ''}`} />
                <h1 className="ml-12 text-5xl text-white font-semibold">{data.division}</h1>
            </div>

            {/* Cards Subdivision */}
            <div className="flex flex-row justify-between relative px-12 items-center">
                <FaAngleLeft className="text-white hover:cursor-pointer" size={100} />
                <div className="flex flex-row justify-between px-8 gap-6">
                    {data.subdivison?.map((subdiv, index) => (
                        <div key={index} className="bg-white rounded-xl pt-8 px-8 pb-40">
                            <h2 className="text-2xl text-secondary font-bold">
                                {subdiv.name}
                            </h2>
                            <p className="text-[#170033] mt-8 text-justify text-lg">
                                {subdiv.desc}
                            </p>
                        </div>
                    ))}
                </div>
                <FaAngleRight className="text-white hover:cursor-pointer" size={100} />
            </div>
        </div>
    )
}

DivisionComponent.propTypes = {
    division: PropTypes.string.isRequired,
    logo: PropTypes.string
}

export default DivisionComponent;