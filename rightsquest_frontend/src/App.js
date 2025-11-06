import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import LessonsList from "./components/LessonsList";
import LessonDetail from "./components/LessonDetail"; // ✅ import new component
import Quiz from "./components/Quiz";
import Navbar from "./components/Navbar";
import Progress from "./components/Progress";


function PrivateRoute({ children }) {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/lessons"
          element={
            <PrivateRoute>
              <LessonsList />
            </PrivateRoute>
          }
        />

        {/* ✅ New Lesson Detail Route */}
        <Route
          path="/lessons/:id"
          element={
            <PrivateRoute>
              <LessonDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/lessons/:id/quiz"
          element={
            <PrivateRoute>
              <Quiz />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />

        <Route
  path="/progress"
  element={
    <PrivateRoute>
      <Progress />
    </PrivateRoute>
  }
/>

      </Routes>
    </Router>
  );
}

export default App;
