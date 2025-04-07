import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { authService } from "../../services/api";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({
        show: false,
        message: "",
        type: "" // "success" or "error"
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Validate email
    const validateForm = () => {
        const newErrors = {};

        // Validate email
        if (!email) {
            newErrors.email = "Email wajib diisi";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Format email tidak valid";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await authService.forgotPassword(email);

            if (result.success) {
                setIsSubmitted(true);
                toast.success("Link reset password telah dikirim ke email Anda.", {
                    position: "top-right",
                    autoClose: 3000,
                });

                setNotification({
                    show: true,
                    message: "Link reset password telah dikirim ke email Anda.",
                    type: "success"
                });
            } else {
                toast.error(result.message || "Gagal mengirim link reset password.", {
                    position: "top-right",
                    autoClose: 4000,
                });

                setNotification({
                    show: true,
                    message: result.message,
                    type: "error"
                });
            }
        } catch (error) {
            console.error("Error:", error);

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
    };

    // Framer Motion Variants
    const pageTransition = {
        initial: { opacity: 0, x: -100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 100 },
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
                        key="forgot-password"
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
                            Lupa Kata Sandi
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

                        {!isSubmitted ? (
                            <motion.form
                                className="space-y-4"
                                onSubmit={handleSubmit}
                                variants={formVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.div
                                    className="flex flex-col"
                                    variants={itemVariants}
                                >
                                    <label htmlFor="email" className="font-semibold text-base md:text-lg mb-1">Email</label>
                                    <motion.input
                                        id="email"
                                        type="email"
                                        className={`border py-2 px-3 rounded-lg ${errors.email ? "border-red-500" : "border-secondary"}`}
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (errors.email) {
                                                setErrors({ ...errors, email: "" });
                                            }
                                        }}
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
                                            "Kirim Link Reset"
                                        }
                                    </motion.button>
                                </motion.div>
                            </motion.form>
                        ) : (
                            <motion.div
                                className="text-center py-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <h2 className="text-xl font-bold mb-2">Email Terkirim!</h2>
                                <p className="text-gray-600 mb-6">Silakan periksa email Anda untuk instruksi reset password.</p>
                                <motion.button
                                    onClick={() => navigate("/auth")}
                                    className="px-6 py-2 bg-primary rounded-lg text-white font-semibold tracking-wide border-2 border-primary hover:bg-white hover:text-primary transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Kembali ke Halaman Login
                                </motion.button>
                            </motion.div>
                        )}

                        <motion.div
                            className="mt-6 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <p className="text-sm md:text-base text-[#868686]">
                                Ingat kata sandi?
                                <motion.button
                                    className="ml-1 text-primary font-semibold hover:underline focus:outline-none"
                                    onClick={() => navigate("/auth")}
                                    whileHover={{ scale: 1.05, textDecoration: "underline" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Login
                                </motion.button>
                            </p>
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

export default ForgotPassword;