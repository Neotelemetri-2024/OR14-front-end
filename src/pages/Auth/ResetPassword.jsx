import { useState } from "react";

const ResetPassword = () => {


    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        newPassword: "",
        confirmPassword: "",
        general: ""
    });
    const [tokenValid, setTokenValid] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords({
            ...passwords,
            [name]: value
        });

        // Reset error when typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ""
            });
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        // Validate password (at least 8 characters, contains number and letter)
        if (passwords.newPassword.length < 8) {
            newErrors.newPassword = "Password harus minimal 8 karakter";
            isValid = false;
        } else if (!/\d/.test(passwords.newPassword) || !/[a-zA-Z]/.test(passwords.newPassword)) {
            newErrors.newPassword = "Password harus mengandung huruf dan angka";
            isValid = false;
        }

        // Validate confirm password
        if (passwords.newPassword !== passwords.confirmPassword) {
            newErrors.confirmPassword = "Password tidak sama";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({ ...errors, general: "" });

        try {
            // Simulasi API call untuk reset password
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Dalam implementasi nyata:
            // await api.post('/auth/reset-password', { 
            //     token, 
            //     newPassword: passwords.newPassword 
            // });

            setIsSubmitted(true);
        } catch (err) {
            setErrors({
                ...errors,
                general: "Gagal mengubah password. Silakan coba lagi."
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!tokenValid) {
        return (
            <div className="flex flex-row w-full h-screen overflow-hidden">
                <section id="form-container" className="flex flex-col justify-center w-full md:w-1/2 py-4 px-12 pb-16">
                    <div className="mb-8">
                        <img src="/images/or14.svg" alt="Logo" />
                    </div>
                    <div className="px-12">
                        <div className="px-6 py-8 bg-white rounded-lg shadow-sm border border-gray-100 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Link Tidak Valid</h2>
                            <p className="text-[#868686] mb-6">
                                Link reset password tidak valid atau sudah kadaluarsa.
                            </p>
                            <a
                                href="/forgot-password"
                                className="inline-block p-3 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-purple-700"
                            >
                                Minta Link Baru
                            </a>
                        </div>
                    </div>
                </section>
                <section className="bg-gradient-to-b from-[#1B054E] to-[#7449B6] md:w-1/2 relative hidden md:block">
                    <img src="/assets/auth/Group184.png" className="w-full h-full object-cover" alt="Decorative" />
                </section>
            </div>
        );
    }

    return (
        <div className="flex flex-row w-full h-screen overflow-hidden">
            <section id="form-container" className="flex flex-col justify-center w-full md:w-1/2 py-4 px-12 pb-16">
                <div className="mb-8">
                    <img src="/images/or14.svg" alt="Logo" />
                </div>
                <div className="px-12">
                    {!isSubmitted ? (
                        <>
                            <h1 className="text-4xl font-bold mb-6">Reset Password</h1>
                            <p className="text-[#868686] mb-8">
                                Buat password baru untuk akun Anda
                            </p>

                            {errors.general && (
                                <div className="bg-red-50 text-red-600 p-3 mb-6 rounded-lg border border-red-200">
                                    {errors.general}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="px-6 py-8 bg-white rounded-lg shadow-sm border border-gray-100">
                                <div className="flex flex-col mb-4">
                                    <label htmlFor="newPassword" className="font-semibold text-2xl mb-2">Password Baru</label>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={handleChange}
                                        className={`border-3 py-3 px-4 border-secondary rounded-lg font-semibold ${errors.newPassword ? "border-red-300" : ""
                                            }`}
                                        placeholder="Minimal 8 karakter"
                                        required
                                    />
                                    {errors.newPassword && (
                                        <p className="text-red-500 mt-1">{errors.newPassword}</p>
                                    )}
                                </div>

                                <div className="flex flex-col mb-6">
                                    <label htmlFor="confirmPassword" className="font-semibold text-2xl mb-2">Konfirmasi Password</label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={passwords.confirmPassword}
                                        onChange={handleChange}
                                        className={`border-3 py-3 px-4 border-secondary rounded-lg font-semibold ${errors.confirmPassword ? "border-red-300" : ""
                                            }`}
                                        placeholder="Ketik ulang password baru Anda"
                                        required
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 mt-1">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full p-4 rounded-lg text-white font-semibold tracking-wide text-xl
                                    ${isLoading ? 'bg-gray-400' : 'bg-primary hover:bg-white hover:text-secondary hover:cursor-pointer border-2 border-primary'}`}
                                >
                                    {isLoading ? 'Memproses...' : 'Reset Password'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="px-6 py-8 bg-white rounded-lg shadow-sm border border-gray-100 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Password Berhasil Diubah!</h2>
                            <p className="text-[#868686] mb-8">
                                Password Anda telah berhasil diubah. Silakan login dengan password baru Anda.
                            </p>
                            <a
                                href="/login"
                                className="inline-block p-3 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-purple-700"
                            >
                                Login Sekarang
                            </a>
                        </div>
                    )}
                </div>
            </section>
            <section className="bg-gradient-to-b from-[#1B054E] to-[#7449B6] md:w-1/2 relative hidden md:block">
                <img src="/assets/auth/Group184.png" className="w-full h-full object-cover" alt="Decorative" />
            </section>

            {/* Background Decoration dengan Animasi */}
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

export default ResetPassword;