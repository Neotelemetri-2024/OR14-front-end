const Landing = () => {
    return (
        <div className="py-4 px-8">
            {/* Absolute Decoration */}



            {/* Navbar */}
            <nav className="flex flex-row justify-between items-center">
                <img src="/images/or14.svg" className="w-56" />
                <div className="flex flex-row justify-between items-center gap-8 text-xl font-semibold">
                    <button className="border-2 rounded-xl px-8 py-1 border-secondary text-secondary hover:bg-secondary hover:text-white hover:cursor-pointer transition duration-300">
                        Home
                    </button>
                    <button className="border-2 rounded-xl px-8 py-1 border-secondary text-secondary hover:bg-secondary hover:text-white hover:cursor-pointer transition duration-300">
                        Division
                    </button>
                    <button className="border-2 rounded-xl px-8 py-1 border-secondary text-secondary hover:bg-secondary hover:text-white hover:cursor-pointer transition duration-300">
                        Achievements
                    </button>
                    <button className="border-2 rounded-xl px-8 py-1 border-secondary text-secondary hover:bg-secondary hover:text-white hover:cursor-pointer transition duration-300">
                        About
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <section className="flex flex-row items-center mt-20">
                {/* Landing Page Card */}
                <div className="border-2 rounded-2xl px-12 pt-12 pb-36 bg-gradient-to-b from-black to-[#3533cc] max-w-1/2 -ml-12">
                    <h1 className="text-white text-4xl mb-6 font-bold">Apa itu OR UKM Neo Telemetri?</h1>
                    <p className="text-white text-lg font-light text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu massa arcu. Aliquam a odio sodales, iaculis neque eget, commodo tellus. Fusce varius commodo lorem, vitae vulputate mi ullamcorper in. Donec viverra neque tempor turpis molestie malesuada. Nam dapibus sapien ac ligula consectetur ultrices. Vestibulum ut ante elementum dolor molestie vestibulum. </p>
                </div>

                {/* Landing Page Title */}
                <div className="max-w-1/2 flex flex-col justify-start ml-20">
                    <h1 className="text-secondary text-5xl font-bold sm:mb-4 mb-12 max-w-3/4">Open Recruitment XIV</h1>
                    <h1 className="text-secondary text-5xl font-bold mb-12 max-w-3/4">UKM Neo Telemetri</h1>
                    <p className="text-tertiary text-xl  font-regular text-justify max-w-3/4 mb-20">
                        Ayo! menjadi bagian dari Unit Kegiatan Mahasiswa berbasis IT terbesar di Universitas Andalas.
                    </p>
                    <div className="flex flex-row px-2 justify-between max-w-3/4">
                        <button className="border-2 px-16 py-3 border-primary text-white bg-primary rounded-xl text-2xl font-semibold hover:bg-white hover:text-primary hover:cursor-pointer transition duration-300">
                            Daftar
                        </button>
                        <button className="border-3 px-16 py-3 border-gray-300 text-secondary vh rounded-xl text-2xl font-semibold hover:bg-gray-300 hover:text-secondary hover:cursor-pointer transition duration-300">
                            Masuk
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Landing;