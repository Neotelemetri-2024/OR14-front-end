import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

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
                    // Periksa role user untuk menentukan pesan sukses
                    const isAdmin = result.data && result.data.user && result.data.user.role === 'admin';

                    toast.success(`Login berhasil! ${isAdmin ? 'Mengarahkan ke panel admin' : 'Selamat datang di dashboard!'}`, {
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

                    // Arahkan langsung ke auto-redirect tanpa delay
                    // Tampilkan toast tapi langsung redirect tanpa menunggu
                    navigate("/auto-redirect", { replace: true });
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

    // Framer Motion Variants
    const pageTransition = {
        initial: { opacity: 0, x: isLoginPage ? -100 : 100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: isLoginPage ? 100 : -100 },
        transition: { type: "tween", ease: "easeInOut", duration: 0.5 }
    };

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const buttonVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.95 }
    };

    // Animasi cahaya
    const glowVariants = {
        initial: {
            opacity: 0.3,
            boxShadow: "0px 0px 15px 5px rgba(116, 73, 182, 0.3)"
        },
        animate: {
            opacity: [0.3, 0.7, 0.3],
            boxShadow: [
                "0px 0px 15px 5px rgba(116, 73, 182, 0.3)",
                "0px 0px 30px 10px rgba(116, 73, 182, 0.7)",
                "0px 0px 15px 5px rgba(116, 73, 182, 0.3)"
            ],
            transition: {
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
            }
        }
    };

    return (
        <div className="flex flex-row w-full h-screen overflow-hidden">

            {/* Form Section - Full width on mobile, half width on larger screens */}
            <motion.section
                id="forms"
                className="flex flex-col justify-evenly w-full md:w-1/2 py-4 px-4 sm:px-8 md:px-12 pb-16 overflow-y-auto"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.button
                    className="flex justify-center md:justify-start mb-4 hover:cursor-pointer"
                    onClick={() => navigate("/")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <img src="/images/or14.svg" className="max-w-full h-10 md:h-20" alt="Logo" />
                </motion.button>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={isLoginPage ? "login" : "register"}
                        className="px-2 sm:px-6 md:px-8 max-w-lg mx-auto w-full"
                        initial={pageTransition.initial}
                        animate={pageTransition.animate}
                        exit={pageTransition.exit}
                        transition={pageTransition.transition}
                    >
                        <motion.h1
                            className="text-xl sm:text-2xl md:text-3xl font-bold text-center md:text-left mb-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {isLoginPage ? "Masuk" : "Daftar"}
                        </motion.h1>

                        {/* Notification display */}
                        <AnimatePresence>
                            {notification.show && (
                                <motion.div
                                    className={`mb-4 p-3 rounded-md ${notification.type === "success"
                                        ? "bg-green-100 text-green-800 border border-green-200"
                                        : "bg-red-100 text-red-800 border border-red-200"
                                        }`}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    {notification.message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.form
                            className="space-y-4"
                            onSubmit={handleSubmit}
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <AnimatePresence>
                                {!isLoginPage && (
                                    <motion.div
                                        className="flex flex-col"
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <label htmlFor="name" className="font-semibold text-base md:text-lg mb-1">Nama Lengkap</label>
                                        <motion.input
                                            id="name"
                                            type="text"
                                            className={`border py-2 px-3 rounded-lg ${errors.name ? "border-red-500" : "border-secondary"}`}
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Masukkan nama lengkap"
                                            whileFocus={{ boxShadow: "0 0 0 2px rgba(116, 73, 182, 0.3)" }}
                                        />
                                        <AnimatePresence>
                                            {errors.name && (
                                                <motion.p
                                                    className="text-red-500 text-sm mt-1"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                >
                                                    {errors.name}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div
                                className="flex flex-col"
                                variants={itemVariants}
                            >
                                <label htmlFor="email" className="font-semibold text-base md:text-lg mb-1">Email</label>
                                <motion.input
                                    id="email"
                                    type="email"
                                    className={`border py-2 px-3 rounded-lg ${errors.email ? "border-red-500" : "border-secondary"}`}
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="neotelemetri@example.com"
                                    whileFocus={{ boxShadow: "0 0 0 2px rgba(116, 73, 182, 0.3)" }}
                                />
                                <AnimatePresence>
                                    {errors.email && (
                                        <motion.p
                                            className="text-red-500 text-sm mt-1"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            {errors.email}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            <motion.div
                                className="flex flex-col"
                                variants={itemVariants}
                            >
                                <label htmlFor="password" className="font-semibold text-base md:text-lg mb-1">Password</label>
                                <div className="relative">
                                    <motion.input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className={`border py-2 px-3 rounded-lg w-full pr-10 ${errors.password ? "border-red-500" : "border-secondary"}`}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Masukkan password"
                                        whileFocus={{ boxShadow: "0 0 0 2px rgba(116, 73, 182, 0.3)" }}
                                    />
                                    <motion.button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        onClick={toggleShowPassword}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </motion.button>
                                </div>
                                <AnimatePresence>
                                    {errors.password && (
                                        <motion.p
                                            className="text-red-500 text-sm mt-1"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            {errors.password}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            <AnimatePresence>
                                {!isLoginPage && (
                                    <motion.div
                                        className="flex flex-col"
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <label htmlFor="password_confirmation" className="font-semibold text-base md:text-lg mb-1">Konfirmasi Password</label>
                                        <div className="relative">
                                            <motion.input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? "text" : "password"}
                                                className={`border py-2 px-3 rounded-lg w-full pr-10 ${errors.password_confirmation ? "border-red-500" : "border-secondary"}`}
                                                value={formData.password_confirmation}
                                                onChange={handleChange}
                                                placeholder="Masukkan ulang password"
                                                whileFocus={{ boxShadow: "0 0 0 2px rgba(116, 73, 182, 0.3)" }}
                                            />
                                            <motion.button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                onClick={toggleShowConfirmPassword}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                            </motion.button>
                                        </div>
                                        <AnimatePresence>
                                            {errors.password_confirmation && (
                                                <motion.p
                                                    className="text-red-500 text-sm mt-1"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                >
                                                    {errors.password_confirmation}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {isLoginPage && (
                                    <motion.div
                                        className="flex justify-end"
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <motion.a
                                            className="text-[#868686] text-sm font-medium hover:text-black transition-colors"
                                            href="/forgot-password"
                                            whileHover={{ color: "#000" }}
                                        >
                                            Lupa Kata Sandi?
                                        </motion.a>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div
                                className="pt-4"
                                variants={itemVariants}
                            >
                                <motion.button
                                    type="submit"
                                    className="w-full py-2.5 md:py-3 bg-primary rounded-lg text-white font-semibold tracking-wide text-base md:text-lg border-2 border-primary hover:bg-white hover:text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    disabled={isLoading}
                                    variants={buttonVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
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
                                </motion.button>
                            </motion.div>
                        </motion.form>

                        <motion.div
                            className="mt-6 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {isLoginPage ? (
                                <p className="text-sm md:text-base text-[#868686]">
                                    Belum memiliki akun?
                                    <motion.button
                                        className="ml-1 text-primary font-semibold hover:underline focus:outline-none"
                                        onClick={handleIsLoginPage}
                                        whileHover={{ scale: 1.05, textDecoration: "underline" }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Daftar
                                    </motion.button>
                                </p>
                            ) : (
                                <p className="text-sm md:text-base text-[#868686]">
                                    Sudah memiliki akun?
                                    <motion.button
                                        className="ml-1 text-primary font-semibold hover:underline focus:outline-none"
                                        onClick={handleIsLoginPage}
                                        whileHover={{ scale: 1.05, textDecoration: "underline" }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Login
                                    </motion.button>
                                </p>
                            )}
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </motion.section>

            {/* Background Image Section - Hidden on mobile, visible on larger screens */}
            <motion.section
                className="hidden md:block bg-gradient-to-b from-[#1B054E] to-[#7449B6] md:w-1/2 relative overflow-hidden"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {/* Efek bercahaya/glow pada background */}
                <motion.div
                    className="absolute inset-0 rounded-l-3xl overflow-hidden"
                    variants={glowVariants}
                    initial="initial"
                    animate="animate"
                />

                {/* Pulsating light effect on top of the image */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white"
                    initial={{ opacity: 0.1 }}
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    style={{ filter: "blur(40px)" }}
                />

                <motion.div
                    className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-purple-300"
                    initial={{ opacity: 0.1 }}
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 4,
                        delay: 1,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    style={{ filter: "blur(30px)" }}
                />

                <motion.img
                    src="/assets/auth/Group184.png"
                    className="w-full h-full object-cover relative z-10"
                    alt="Auth background"
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.7 }}
                />
            </motion.section>

            {/* Background Decoration - Hidden on small screens */}
            <motion.img
                src="/assets/bg/Ellipse28.svg"
                className="decoration-1 absolute bottom-[55%] left-[20%] -z-10 hidden lg:block"
                style={{ opacity: 0.5 }}
                alt="Decoration 1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.5, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.img
                src="/assets/bg/Ellipse29.svg"
                className="decoration-2 absolute top-[33%] right-[75%] -z-10 hidden lg:block"
                style={{ opacity: 0.5 }}
                alt="Decoration 2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 0.5, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
            />
        </div>
    );
};

Auth.propTypes = {
    isLogin: PropTypes.bool.isRequired,
};

export default Auth;