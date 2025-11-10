import React, { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { BookOpen, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LessonsList() {
  const [lessons, setLessons] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch lessons + progress
  useEffect(() => {
    // Fetch all lessons
    API.get("/api/lessons/")
      .then((res) => setLessons(res.data))
      .catch((err) => console.error("Lesson fetch error:", err));

    // Fetch user progress only if logged in
    const token = localStorage.getItem("access");
    if (token) {
      API.get("/api/progress/")
        .then((res) => setProgressData(res.data))
        .catch(() => console.warn("No progress found yet."));
    }
  }, []);

  // ✅ Helper: find progress for each lesson by title
  const getProgress = (lessonTitle) => {
    const item = progressData.find((p) => p.lesson_title === lessonTitle);
    return item ? item.progress_pct : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        <BookOpen className="text-blue-600" /> 📚 Lessons
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson, i) => {
          const progress = getProgress(lesson.title);

          return (
            <motion.div
              key={lesson.id}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl border-l-4 border-blue-600 cursor-pointer"
              onClick={() => navigate(`/lessons/${lesson.id}`)}
            >
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Star className="text-yellow-500" /> {lesson.title}
              </h2>

              <p className="text-gray-600 mt-2">{lesson.description}</p>

              <p className="text-sm text-gray-500 mt-4">
                🎯 Points: {lesson.points}
              </p>

              {/* 🎨 Animated Progress Bar */}
              <div className="bg-gray-200 h-2 rounded mt-3 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-green-400 h-2 rounded"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${progress}%`,
                    scale: progress === 100 ? [1, 1.05, 1] : 1, // bounce when 100%
                  }}
                  transition={{
                    duration: 1,
                    repeat: progress === 100 ? 2 : 0, // bounce twice on completion
                  }}
                />
              </div>

              <p className="text-xs text-gray-600 mt-1 text-right">
                {progress}% completed
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
