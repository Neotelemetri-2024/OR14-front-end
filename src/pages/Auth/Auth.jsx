import { useState } from "react";
import PropTypes from "prop-types";

const Auth = ({ isLogin }) => {
    const [isLoginPage, setIsLoginPage] = useState(isLogin);

    const handleIsLoginPage = () => {
        setIsLoginPage(!isLoginPage);
    }

    return (
        <div className="flex flex-row w-full h-screen ">
            <section id="forms" className="flex flex-col justify-evenly w-full md:w-1/2 py-4 px-12 pb-16">
                <div>
                    <img src="/images/or14.svg" />
                </div>
                <div className="px-12">
                    {isLoginPage ? <h1 className="text-4xl font-bold">Masuk</h1> : <h1 className="text-4xl font-bold">Daftar</h1>}

                    <form className="px-6 py-8">
                        {isLoginPage ? "" :
                            (<div className="flex flex-col">
                                <label htmlFor="name" className="font-semibold text-2xl mb-2">Nama Lengkap</label>
                                <input id="name" type="text" className="border-3 py-3 px-4 border-secondary rounded-lg font-semibold" />
                                <div className="p-2" />
                            </div>
                            )}
                        <div className="flex flex-col">
                            <label htmlFor="email" className="font-semibold text-2xl mb-2">Email</label>
                            <input id="email" type="text" className="border-3 py-3 px-4 border-secondary rounded-lg font-semibold" />
                        </div>
                        {isLoginPage ? <div className="p-4" /> : <div className="p-2" />}
                        <div className="flex flex-col">
                            <label htmlFor="password" className="font-semibold text-2xl mb-2">Password</label>
                            <input id="password" type="password" className="border-3 py-3 px-4 border-secondary rounded-lg font-semibold" />
                        </div>
                        {isLoginPage ? <div className="p-2 place-self-end">
                            <a className="text-[#868686] font-semibold hover:font-bold" href="#">
                                Lupa Kata Sandi?
                            </a>
                        </div> : <div className="p-2" />}
                        {isLoginPage ? <div className="p-4" /> : <div className="p-2" />}
                        {isLoginPage ? <button type="submit" className="w-full p-4 bg-primary rounded-lg text-white font-semibold tracking-wide text-xl border-2 border-primary hover:bg-white hover:border-2 hover:border-primary hover:text-primary hover:cursor-pointer">
                            Masuk
                        </button>
                            :
                            <button type="submit" className="w-full p-4 bg-primary rounded-lg text-white font-semibold tracking-wide text-xl border-2 border-primary hover:cursor-pointer hover:bg-white hover:border-2 hover:border-primary hover:text-primary">
                                Daftar
                            </button>
                        }
                    </form>
                    <div className="p-2" />
                    {isLoginPage ?
                        <div>
                            <p className="text-center text-[#868686]">Belum memiliki akun? <a className="text-black font-semibold hover:font-bold hover:cursor-pointer" onClick={handleIsLoginPage}>Daftar</a></p>
                        </div>
                        :
                        <div>
                            <p className="text-center text-[#868686]">Sudah memiliki akun? <a className="text-black font-semibold hover:font-bold hover:cursor-pointer" onClick={handleIsLoginPage}>Login</a></p>
                        </div>
                    }
                </div>
            </section>
            <section className="w-0 bg-[url('/assets/bg.svg')] bg-cover bg-no-repeat md:w-1/2" />

            {/* Background Decoration */}
            <img
                src="/assets/bg/Ellipse28.svg"
                className="absolute bottom-[55%] left-[20%] -z-10 hidden lg:block"
            />
            <img
                src="/assets/bg/Ellipse29.svg"
                className="absolute top-[33%] right-[75%] -z-10 hidden lg:block"
            />
        </div>
    )
}

Auth.propTypes = {
    isLogin: PropTypes.bool.isRequired,
}

export default Auth;