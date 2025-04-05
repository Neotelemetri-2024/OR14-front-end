import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { ProtectedRoute, GuestRoute } from "./middleware/AuthMiddleware";
import { ProfileCompletedRoute, VerificationApprovedRoute } from "./middleware/ProfileVerificationMiddleware";
import AdminRoute from "./middleware/AdminMiddleware";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import AdminUser from "./pages/admin/AdminUser";
import AdminTimelineManagement from "./pages/admin/AdminTimelineManagement";

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
          limit={1} // Membatasi hanya 1 toast pada satu waktu
        />

        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auto-redirect" element={<RoleBasedRedirect />} />
            <Route element={<GuestRoute />}>
              <Route path="/auth" element={<AuthWrapper />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              {/* Routes that require a complete profile */}
              <Route element={<ProfileCompletedRoute />}>
                <Route path="/verification" element={<Verification />} />
              </Route>
              {/* Routes that require both complete profile and approved verification */}
              <Route element={<VerificationApprovedRoute />}>
                <Route path="/preparation" element={<ExamPreparation />} />
                <Route path="/exam" element={<Exam />} />
                <Route path="/exam-result" element={<ExamResult />} />
              </Route>
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUser />} />
              <Route path="/admin/timeline" element={<AdminTimelineManagement />} />
              {/* Tambahkan route admin lainnya di sini */}
            </Route>
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