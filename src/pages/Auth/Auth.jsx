import { useState } from "react";
import PropTypes from "prop-types";

const Auth = ({ isLogin }) => {
    const [isLoginPage, setIsLoginPage] = useState(isLogin);

    const handleIsLoginPage = () => {
        setIsLoginPage(!isLoginPage);
    }

    return (
        <div className="flex flex-row w-full h-screen overflow-hidden">
            {/* CSS untuk animasi langsung di komponen */}
            <style jsx>{`
                @keyframes pulse {
                    0% { opacity: 0.2; transform: scale(0.95); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                    100% { opacity: 0.2; transform: scale(0.95); }
                }
                
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                    100% { transform: translateY(0px); }
                }
                
                .decoration-1 {
                    animation: pulse 7s ease-in-out infinite, float 15s ease-in-out infinite;
                }
                
                .decoration-2 {
                    animation: pulse 5s ease-in-out infinite, float 10s ease-in-out infinite;
                    animation-delay: 1s;
                }
            `}</style>

            {/* Form Section - Full width on mobile, half width on larger screens */}
            <section id="forms" className="flex flex-col justify-evenly w-full md:w-1/2 py-4 px-4 sm:px-8 md:px-12 pb-16">
                <div className="flex justify-center md:justify-start">
                    <img src="/images/or14.svg" className="max-w-full h-auto" />
                </div>
                <div className="px-2 sm:px-8 md:px-12">
                    {isLoginPage ?
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center md:text-left">Masuk</h1> :
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center md:text-left">Daftar</h1>
                    }

                    <form className="px-2 sm:px-4 md:px-6 py-6 md:py-8">
                        {isLoginPage ? "" :
                            (<div className="flex flex-col">
                                <label htmlFor="name" className="font-semibold text-lg sm:text-xl md:text-2xl mb-2">Nama Lengkap</label>
                                <input id="name" type="text" className="border-3 py-2 sm:py-3 px-3 sm:px-4 border-secondary rounded-lg font-semibold" />
                                <div className="p-2" />
                            </div>
                            )}
                        <div className="flex flex-col">
                            <label htmlFor="email" className="font-semibold text-lg sm:text-xl md:text-2xl mb-2">Email</label>
                            <input id="email" type="text" className="border-3 py-2 sm:py-3 px-3 sm:px-4 border-secondary rounded-lg font-semibold" />
                        </div>
                        {isLoginPage ? <div className="p-3 md:p-4" /> : <div className="p-2" />}
                        <div className="flex flex-col">
                            <label htmlFor="password" className="font-semibold text-lg sm:text-xl md:text-2xl mb-2">Password</label>
                            <input id="password" type="password" className="border-3 py-2 sm:py-3 px-3 sm:px-4 border-secondary rounded-lg font-semibold" />
                        </div>
                        {isLoginPage ?
                            <div className="p-2 flex justify-end">
                                <a className="text-[#868686] text-sm md:text-base font-semibold hover:font-bold" href="#">
                                    Lupa Kata Sandi?
                                </a>
                            </div> :
                            <div className="p-2" />
                        }
                        {isLoginPage ? <div className="p-3 md:p-4" /> : <div className="p-2" />}
                        {isLoginPage ?
                            <button type="submit" className="w-full p-3 md:p-4 bg-primary rounded-lg text-white font-semibold tracking-wide text-lg md:text-xl border-2 border-primary hover:bg-white hover:border-2 hover:border-primary hover:text-primary hover:cursor-pointer">
                                Masuk
                            </button>
                            :
                            <button type="submit" className="w-full p-3 md:p-4 bg-primary rounded-lg text-white font-semibold tracking-wide text-lg md:text-xl border-2 border-primary hover:cursor-pointer hover:bg-white hover:border-2 hover:border-primary hover:text-primary">
                                Daftar
                            </button>
                        }
                    </form>
                    <div className="p-2" />
                    {isLoginPage ?
                        <div>
                            <p className="text-center text-sm md:text-base text-[#868686]">Belum memiliki akun? <a className="text-black font-semibold hover:font-bold hover:cursor-pointer" onClick={handleIsLoginPage}>Daftar</a></p>
                        </div>
                        :
                        <div>
                            <p className="text-center text-sm md:text-base text-[#868686]">Sudah memiliki akun? <a className="text-black font-semibold hover:font-bold hover:cursor-pointer" onClick={handleIsLoginPage}>Login</a></p>
                        </div>
                    }
                </div>
            </section>

            {/* Background Image Section - Hidden on mobile, visible on larger screens */}
            <section className="hidden md:block bg-gradient-to-b from-[#1B054E] to-[#7449B6] md:w-1/2 relative">
                <img src="/assets/auth/Group184.png" className="w-full h-full object-cover" />
            </section>

            {/* Background Decoration - Hidden on small screens */}
            <img
                src="/assets/bg/Ellipse28.svg"
                className="decoration-1 absolute bottom-[55%] left-[20%] -z-10 hidden lg:block"
                style={{ opacity: 0.5 }}
            />
            <img
                src="/assets/bg/Ellipse29.svg"
                className="decoration-2 absolute top-[33%] right-[75%] -z-10 hidden lg:block"
                style={{ opacity: 0.5 }}
            />
        </div>
    )
}

Auth.propTypes = {
    isLogin: PropTypes.bool.isRequired,
}

export default Auth;