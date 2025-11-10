import React, { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch lesson details from backend
  useEffect(() => {
    API.get(`/api/lessons/${id}/`)
      .then((res) => setLesson(res.data))
      .catch((err) => console.error("Lesson fetch error:", err));
  }, [id]);

  if (!lesson) return <p className="text-center mt-10">Loading lesson...</p>;

  const quizId = lesson.quizzes?.[0]?.id;

  // ✅ Handle missing quiz
  const handleStartQuiz = () => {
    if (quizId) {
      navigate(`/quiz/${quizId}`);
    } else {
      toast.error("🚫 No quiz available for this lesson yet!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <motion.div
        className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 🔹 Lesson Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 rounded-xl mb-6 shadow-lg">
          <h1 className="text-3xl font-extrabold">{lesson.title}</h1>
          <p className="text-blue-100 mt-2">{lesson.description}</p>
        </div>

        {/* 🔹 Lesson Metadata */}
        <div className="text-sm text-gray-500 mb-4 flex justify-between">
          <span>🎯 Points: {lesson.points}</span>
          <span>
            📅 Added:{" "}
            {new Date(lesson.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {/* 🔹 Lesson Content Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6 shadow-inner">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {lesson.content}
          </p>
        </div>

        {/* 🔹 Start Quiz Button */}
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 20px rgba(37, 99, 235, 0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartQuiz}
          className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition"
        >
          🚀 Start Quiz →
        </motion.button>
      </motion.div>
    </div>
  );
}
