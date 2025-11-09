import React, { useEffect, useState } from "react";
import API from "../api/api"; // ✅ make sure this path matches your api.js
import { motion } from "framer-motion";
import { BookOpen, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LessonsList() {
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/api/lessons/")
      .then((res) => setLessons(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        <BookOpen className="text-blue-600" /> 📚 Lessons
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson, i) => (
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
            <p className="text-sm text-gray-500 mt-4">🎯 Points: {lesson.points}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
