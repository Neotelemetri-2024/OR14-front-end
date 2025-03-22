import { useState } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Simulasi API call untuk mengirim email
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Dalam implementasi nyata, ini akan memanggil API endpoint:
            // await api.post('/auth/forgot-password', { email });

            setIsSubmitted(true);
        } catch (err) {
            setError("Gagal mengirimkan email. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-row w-full h-screen overflow-hidden">
            <section id="form-container" className="flex flex-col justify-center w-full md:w-1/2 py-4 px-12 pb-16">
                <div className="mb-8">
                    <img src="/images/or14.svg" alt="Logo" />
                </div>
                <div className="px-12">
                    {!isSubmitted ? (
                        <>
                            <h1 className="text-4xl font-bold mb-6">Lupa Password</h1>
                            <p className="text-[#868686] mb-8">
                                Masukkan alamat email yang terdaftar. Kami akan mengirimkan link untuk mengatur ulang password Anda.
                            </p>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 mb-6 rounded-lg border border-red-200">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="px-6 py-8 bg-white rounded-lg shadow-sm border border-gray-100">
                                <div className="flex flex-col">
                                    <label htmlFor="email" className="font-semibold text-2xl mb-2">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="border-3 py-3 px-4 border-secondary rounded-lg font-semibold"
                                        placeholder="neotelemetri@example.com"
                                        required
                                    />
                                </div>
                                <div className="p-4"></div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full p-4 rounded-lg text-white font-semibold tracking-wide text-xl
                                    ${isLoading ? 'bg-gray-400' : 'bg-primary hover:bg-white hover:text-primary hover:cursor-pointer border-2 border-primary'}`}
                                >
                                    {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
                                </button>
                            </form>
                            <div className="p-4"></div>
                            <div>
                                <p className="text-center text-[#868686]">
                                    Ingat password Anda? <a className="text-black font-semibold hover:font-bold hover:cursor-pointer" href="/login">Login</a>
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="px-6 py-8 bg-white rounded-lg shadow-sm border border-gray-100 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Email Terkirim!</h2>
                            <p className="text-[#868686] mb-6">
                                Kami telah mengirimkan email ke <span className="font-semibold">{email}</span> dengan instruksi untuk mengatur ulang password Anda.
                            </p>
                            <p className="text-[#868686] mb-8">
                                Silakan periksa inbox atau folder spam Anda. Link akan berlaku selama 30 menit.
                            </p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="text-primary hover:underline font-semibold"
                            >
                                Kirim ulang email
                            </button>
                        </div>
                    )}
                </div>
            </section>
            <section className="bg-gradient-to-b from-[#1B054E] to-[#7449B6] md:w-1/2 relative hidden md:block">
                <img src="/assets/auth/Group184.png" className="w-full h-full object-cover" alt="Decorative" />
            </section>


            <img
                src="/assets/bg/Ellipse28.svg"
                className="decoration-1 absolute bottom-[55%] left-[20%] -z-10 hidden lg:block"
                style={{ opacity: 0.5 }}
                alt="Decoration"
            />
            <img
                src="/assets/bg/Ellipse29.svg"
                className="decoration-2 absolute top-[33%] right-[75%] -z-10 hidden lg:block"
                style={{ opacity: 0.5 }}
                alt="Decoration"
            />
        </div>
    );
};

export default ForgotPassword;