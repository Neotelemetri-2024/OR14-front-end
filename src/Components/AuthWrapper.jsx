import { useLocation } from "react-router-dom";
import Auth from "../pages/Auth/Auth";

/**
 * Komponen wrapper untuk halaman Auth yang menentukan mode login/register
 * berdasarkan query parameter
 */
const AuthWrapper = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get("mode");

    // Periksa jika mode adalah "register", jika tidak defaultnya adalah login
    return <Auth isLogin={mode !== "register"} />;
};

export default AuthWrapper;