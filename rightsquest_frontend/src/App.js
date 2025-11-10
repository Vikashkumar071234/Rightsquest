import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import LessonsList from "./components/LessonsList";
import LessonDetail from "./components/LessonDetail";
import Quiz from "./components/Quiz";
import Progress from "./components/Progress";
import Dashboard from "./components/Dashboard";
import { isLoggedIn } from "./utils/auth";
import BadgeList from "./components/BadgeList";
import Footer from "./components/Footer";

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function Layout() {
  const location = useLocation();

  // Hide Navbar and Footer on login/signup pages
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";
  const hideFooter = hideNavbar;

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* private */}
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/lessons" element={<PrivateRoute><LessonsList /></PrivateRoute>} />
        <Route path="/lessons/:id" element={<PrivateRoute><LessonDetail /></PrivateRoute>} />
        <Route path="/quiz/:quizId" element={<PrivateRoute><Quiz /></PrivateRoute>} />
        <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
        <Route path="/badges" element={<PrivateRoute><BadgeList /></PrivateRoute>} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* ✅ Footer is now shown only on authenticated pages */}
      {!hideFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
      
    </BrowserRouter>
  );
}
