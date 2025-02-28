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

    return (
        <div className="flex grid lg:grid-cols-2 grid-cols-1 gap-12 justify-center place-items-center px-32 ">
            {achievements.map((achievement, index) => (
                <div key={index} className="flex flex-row items-center items-stretch justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <div className="bg-secondary rounded-l-xl p-6">
                        <img src="/assets/Vector.svg" />
                    </div>
                    <div className="flex flex-col pl-6 bg-quarterary pr-32 lg:pr-64 rounded-r-xl gap-1 py-4">
                        <h3 className="text-white font-bold text-2xl">{achievement.title}</h3>
                        {achievement.awardee.map((data, index) => (
                            <h4 className="text-white font-regular text-sm" key={index}>{data.name}, {data.division}</h4>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AchievementComponent;