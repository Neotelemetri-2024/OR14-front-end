import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard";
import Verification from "./pages/Auth/Verification";
import ExamPreparation from "./pages/Exam/ExamPreparation";
import Exam from "./pages/Exam/Exam";
import Result from "./pages/Exam/Result";

const AuthWrapper = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");

  return <Auth isLogin={mode !== "register"} />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthWrapper />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/preparation" element={<ExamPreparation />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  )
}

export default App;