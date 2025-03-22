import { useState, useEffect } from "react";

const projects = [
    {
        image: 'Rectangle32.png',
        name: 'Project 1',
        subdivisions: "UIUX, Web Programming"
    },
    {
        image: 'Rectangle32.png',
        name: 'Project 2',
        subdivisions: "UIUX, Web Programming"
    },
    {
        image: 'Rectangle32.png',
        name: 'Project 3',
        subdivisions: "UIUX, Web Programming"
    },
    {
        image: 'Rectangle32.png',
        name: 'Project 4',
        subdivisions: "UIUX, Web Programming"
    },
    {
        image: 'Rectangle32.png',
        name: 'Project 5',
        subdivisions: "UIUX, Web Programming"
    },
    {
        image: 'Rectangle32.png',
        name: 'Project 6',
        subdivisions: "UIUX, Web Programming"
    },
]

const ProjectComponent = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [activeProject, setActiveProject] = useState(null);

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Set initial value
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="w-full pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 px-6 sm:px-12 lg:px-32">
                {
                    projects.map((project, index) => (
                        <div key={index} className="hover:translate-y-[-8px] transition duration-300 flex flex-col gap-2">
                            <img
                                src={`/assets/${project.image}`}
                                className="w-full object-cover rounded-lg"
                                alt={project.name}
                            />
                            <h3 className="text-[#595959] font-bold text-xl sm:text-2xl mt-2">{project.name}</h3>
                            <p className="text-[#B1B1B1] font-semibold text-base sm:text-lg">{project.subdivisions}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
};

export default ProjectComponent;