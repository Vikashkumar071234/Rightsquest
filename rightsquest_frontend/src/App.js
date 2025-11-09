import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import LessonsList from "./components/LessonsList";
import LessonDetail from "./components/LessonDetail";
import Quiz from "./components/Quiz";
import Progress from "./components/Progress";
import Signup from "./components/Signup"; // if you have it

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/lessons" element={<LessonsList />} />
        <Route path="/lessons/:id" element={<LessonDetail />} />
        <Route path="/quiz/:quizId" element={<Quiz />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="*" element={<LessonsList />} />
      </Routes>
    </BrowserRouter>
  );
}
