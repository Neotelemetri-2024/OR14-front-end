import { useState, useEffect } from "react";

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

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
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

    return (
        <div className="relative px-4 sm:px-8 md:px-16 lg:px-32 py-4">
            <style>{scrollbarStyles}</style>
            {isMobile ? (
                // Mobile view - horizontal scrolling with fixed height
                <div className="relative">
                    <div className="overflow-x-auto scrollbar-hide pb-8">
                        <div className="flex flex-row gap-4 w-max">
                            {achievements.map((achievement, index) => (
                                <div key={index} className="flex flex-row items-stretch transition-all duration-300 hover:scale-105 hover:shadow-lg w-[280px] h-[100px]">
                                    <div className="bg-secondary rounded-l-xl flex items-center justify-center w-[60px]">
                                        <img src="/assets/Vector.svg" className="w-8" alt="Trophy" />
                                    </div>
                                    <div className="flex flex-col justify-center pl-4 bg-quarterary pr-4 rounded-r-xl gap-1 py-4 flex-1">
                                        <h3 className="text-white font-bold text-lg break-words">{achievement.title}</h3>
                                        {achievement.awardee.map((data, index) => (
                                            <h4 className="text-white font-regular text-xs" key={index}>{data.name}, {data.division}</h4>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Optional scroll hint */}
                    <div className="text-center text-white text-xs opacity-60 mt-2">
                        Swipe untuk melihat lebih banyak
                    </div>
                </div>
            ) : (
                // Desktop view - original grid layout
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-12 justify-center place-items-center">
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
            )}
        </div>
    );
}

export default AchievementComponent;