import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import LessonsList from "./components/LessonsList";
import Quiz from "./components/Quiz";
import Navbar from "./components/Navbar";

// -------------------------------
// Private Route Wrapper
// -------------------------------
function PrivateRoute({ children }) {
  const token = localStorage.getItem("access"); // JWT access token
  return token ? children : <Navigate to="/login" />;
}

// -------------------------------
// App Component
// -------------------------------
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/lessons"
          element={
            <PrivateRoute>
              <LessonsList />
            </PrivateRoute>
          }
        />

        {/* New Quiz Route */}
        <Route
          path="/lessons/:id/quiz"
          element={
            <PrivateRoute>
              <Quiz />
            </PrivateRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
