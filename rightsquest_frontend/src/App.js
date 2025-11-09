import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import LessonsList from "./components/LessonsList";
import LessonDetail from "./components/LessonDetail";
import Quiz from "./components/Quiz";
import Progress from "./components/Progress";

function Layout() {
  const location = useLocation();

  // Hide Navbar only on login & signup pages
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/lessons" element={<LessonsList />} />
        <Route path="/lessons/:id" element={<LessonDetail />} />
        <Route path="/quiz/:quizId" element={<Quiz />} />
        <Route path="/progress" element={<Progress />} />
        {/* Default route: open login */}
        <Route path="*" element={<Login />} />
      </Routes>
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
