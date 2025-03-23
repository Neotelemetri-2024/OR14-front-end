import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Auth = ({ isLogin }) => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoginPage, setIsLoginPage] = useState(isLogin);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({
        show: false,
        message: "",
        type: "" // "success" or "error"
    });

    // State untuk tampilkan/sembunyikan password
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Perbarui state ketika prop isLogin berubah
    useEffect(() => {
        setIsLoginPage(isLogin);
    }, [isLogin]);

    const handleIsLoginPage = () => {
        setIsLoginPage(!isLoginPage);
        // Reset form and notifications
        setFormData({
            name: "",
            email: "",
            password: "",
            password_confirmation: ""
        });
        setErrors({});
        setNotification({ show: false, message: "", type: "" });
        // Reset password visibility
        setShowPassword(false);
        setShowConfirmPassword(false);
    }

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));

        // Clear error for this field
        if (errors[id]) {
            setErrors(prev => ({
                ...prev,
                [id]: ""
            }));
        }
    }

    const validateForm = () => {
        const newErrors = {};

        // Validate email
        if (!formData.email) {
            newErrors.email = "Email wajib diisi";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Format email tidak valid";
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = "Password wajib diisi";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password minimal 6 karakter";
        }

        // For registration, validate additional fields
        if (!isLoginPage) {
            if (!formData.name) {
                newErrors.name = "Nama lengkap wajib diisi";
            }

            if (formData.password !== formData.password_confirmation) {
                newErrors.password_confirmation = "Konfirmasi password tidak cocok";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            if (isLoginPage) {
                // Login logic
                const result = await login(formData.email, formData.password);

                if (result.success) {
                    toast.success("Login berhasil! Selamat datang di dashboard!", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });

                    // Clear form
                    setFormData({
                        name: "",
                        email: "",
                        password: "",
                        password_confirmation: ""
                    });

                    // Tambahkan timeout kecil untuk memastikan token tersimpan dan AuthContext terupdate
                    setTimeout(() => {
                        navigate("/dashboard", { replace: true });
                    }, 2000);
                } else {
                    // Show toast for error
                    toast.error(result.message || "Login gagal. Silakan periksa kredensial Anda.", {
                        position: "top-right",
                        autoClose: 4000,
                    });

                    setNotification({
                        show: true,
                        message: result.message,
                        type: "error"
                    });
                }
            } else {
                // Register implementation
                const result = await authService.register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation
                });

                if (result.success) {
                    // Show toast for successful registration
                    toast.success("Registrasi berhasil! Silakan cek email untuk verifikasi.", {
                        position: "top-right",
                        autoClose: 4000,
                    });

                    // Reset form
                    setFormData({
                        name: "",
                        email: "",
                        password: "",
                        password_confirmation: ""
                    });

                    // Show success notification
                    setNotification({
                        show: true,
                        message: "Registrasi berhasil! Silakan cek email untuk verifikasi.",
                        type: "success"
                    });

                    // Switch to login page after successful registration
                    setIsLoginPage(true);
                } else {
                    // Show toast for error
                    toast.error(result.message || "Registrasi gagal. Silakan coba lagi.", {
                        position: "top-right",
                        autoClose: 4000,
                    });

                    setNotification({
                        show: true,
                        message: result.message,
                        type: "error"
                    });
                }
            }
        } catch (error) {
            console.error("Error:", error);

            // Show toast for unexpected error
            toast.error("Terjadi kesalahan. Silakan coba lagi.", {
                position: "top-right",
                autoClose: 4000,
            });

            setNotification({
                show: true,
                message: "Terjadi kesalahan. Silakan coba lagi.",
                type: "error"
            });
        } finally {
            setIsLoading(false);
        }
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="flex flex-row w-full h-screen overflow-hidden">

            {/* Form Section - Full width on mobile, half width on larger screens */}
            <section id="forms" className="flex flex-col justify-evenly w-full md:w-1/2 py-4 px-4 sm:px-8 md:px-12 pb-16 overflow-y-auto">
                <button className="flex justify-center md:justify-start mb-4 hover:cursor-pointer" onClick={() => navigate("/")}>
                    <img src="/images/or14.svg" className="max-w-full h-10 md:h-20" alt="Logo" />
                </button>
                <div className="px-2 sm:px-6 md:px-8 max-w-lg mx-auto w-full">
                    {isLoginPage ?
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center md:text-left mb-6">Masuk</h1> :
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center md:text-left mb-6">Daftar</h1>
                    }

                    {/* Notification display */}
                    {notification.show && (
                        <div className={`mb-4 p-3 rounded-md ${notification.type === "success"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                            }`}>
                            {notification.message}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {!isLoginPage && (
                            <div className="flex flex-col">
                                <label htmlFor="name" className="font-semibold text-base md:text-lg mb-1">Nama Lengkap</label>
                                <input
                                    id="name"
                                    type="text"
                                    className={`border py-2 px-3 rounded-lg ${errors.name ? "border-red-500" : "border-secondary"}`}
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Masukkan nama lengkap"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col">
                            <label htmlFor="email" className="font-semibold text-base md:text-lg mb-1">Email</label>
                            <input
                                id="email"
                                type="email"
                                className={`border py-2 px-3 rounded-lg ${errors.email ? "border-red-500" : "border-secondary"}`}
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="neotelemetri@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="password" className="font-semibold text-base md:text-lg mb-1">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className={`border py-2 px-3 rounded-lg w-full pr-10 ${errors.password ? "border-red-500" : "border-secondary"}`}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder=""
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={toggleShowPassword}
                                >
                                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        {!isLoginPage && (
                            <div className="flex flex-col">
                                <label htmlFor="password_confirmation" className="font-semibold text-base md:text-lg mb-1">Konfirmasi Password</label>
                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={`border py-2 px-3 rounded-lg w-full pr-10 ${errors.password_confirmation ? "border-red-500" : "border-secondary"}`}
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        placeholder="Masukkan ulang password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        onClick={toggleShowConfirmPassword}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                                )}
                            </div>
                        )}

                        {isLoginPage && (
                            <div className="flex justify-end">
                                <a className="text-[#868686] text-sm font-medium hover:text-black transition-colors" href="/forgot-password">
                                    Lupa Kata Sandi?
                                </a>
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full py-2.5 md:py-3 bg-primary rounded-lg text-white font-semibold tracking-wide text-base md:text-lg border-2 border-primary hover:bg-white hover:text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                disabled={isLoading}
                            >
                                {isLoading ?
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </span>
                                    :
                                    (isLoginPage ? "Masuk" : "Daftar")
                                }
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        {isLoginPage ? (
                            <p className="text-sm md:text-base text-[#868686]">
                                Belum memiliki akun?
                                <button
                                    className="ml-1 text-primary font-semibold hover:underline focus:outline-none"
                                    onClick={handleIsLoginPage}
                                >
                                    Daftar
                                </button>
                            </p>
                        ) : (
                            <p className="text-sm md:text-base text-[#868686]">
                                Sudah memiliki akun?
                                <button
                                    className="ml-1 text-primary font-semibold hover:underline focus:outline-none"
                                    onClick={handleIsLoginPage}
                                >
                                    Login
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Background Image Section - Hidden on mobile, visible on larger screens */}
            <section className="hidden md:block bg-gradient-to-b from-[#1B054E] to-[#7449B6] md:w-1/2 relative">
                <img src="/assets/auth/Group184.png" className="w-full h-full object-cover" alt="Auth background" />
            </section>

            {/* Background Decoration - Hidden on small screens */}
            <img
                src="/assets/bg/Ellipse28.svg"
                className="decoration-1 absolute bottom-[55%] left-[20%] -z-10 hidden lg:block"
                style={{ opacity: 0.5 }}
                alt="Decoration 1"
            />
            <img
                src="/assets/bg/Ellipse29.svg"
                className="decoration-2 absolute top-[33%] right-[75%] -z-10 hidden lg:block"
                style={{ opacity: 0.5 }}
                alt="Decoration 2"
            />
        </div>
    );
};

Auth.propTypes = {
    isLogin: PropTypes.bool.isRequired,
};

export default Auth;