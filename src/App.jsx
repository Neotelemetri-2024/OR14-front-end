import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { ProtectedRoute, GuestRoute } from "./middleware/AuthMiddleware";
import AdminRoute from "./middleware/AdminMiddleware";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Landing from "./pages/Landing";
// import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard";
import Verification from "./pages/Auth/Verification";
import ExamPreparation from "./pages/exam/ExamPreparation";
import Exam from "./pages/exam/Exam";
import ExamResult from "./pages/exam/ExamResult";
import Profile from "./pages/profile/Profile";
import ResetPassword from "./pages/Auth/ResetPassword";
// import ForgotPassword from "./pages/Auth/ForgetPassword";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

// Utilities
import AuthWrapper from "./components/AuthWrapper";
import RoleBasedRedirect from "./components/RoleBasedRedirect";

const App = () => {

  return (
    <AuthProvider>
      <ProfileProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />

            {/* Role-based redirect - otomatis pilih dashboard berdasarkan role */}
            <Route path="/auto-redirect" element={<RoleBasedRedirect />} />

            {/* Guest routes (only for non-authenticated users) */}
            <Route element={<GuestRoute />}>
              <Route path="/auth" element={<AuthWrapper />} />
              {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* Protected routes (only for authenticated users) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/preparation" element={<ExamPreparation />} />
              <Route path="/exam" element={<Exam />} />
              <Route path="/exam-result" element={<ExamResult />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/verification" element={<Verification />} />
            </Route>

            {/* Admin routes (only for authenticated users with admin role) */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* Tambahkan route admin lainnya di sini */}
            </Route>

            {/* Fallback for undefined routes */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="text-xl">Halaman tidak ditemukan</p>
                <a href="/" className="mt-4 px-4 py-2 bg-primary text-white rounded-lg">
                  Kembali ke Beranda
                </a>
              </div>
            } />
          </Routes>
        </Router>
      </ProfileProvider>
    </AuthProvider>
  );
};

export default App;