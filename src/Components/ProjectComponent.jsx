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

    return (
        <div className="flex grid lg:grid-cols-3 grid-cols-1 gap-12 justify-center place-items-center px-48 pt-16 lg:px-32">
            {
                projects.map((project, index) => (
                    <div key={index} className="hover:translate-2 transition duration-300 flex flex-col gap-2">
                        <img src={`/assets/${project.image}`} className="w-dvh" />
                        <h3 className="text-[#595959] font-bold text-2xl">{project.name}</h3>
                        <p className="text-[#B1B1B1] font-semibold text-lg">{project.subdivisions}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default ProjectComponent;