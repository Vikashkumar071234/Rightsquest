import React, { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { Trophy, BookOpen } from "lucide-react";

export default function Progress() {
  const [items, setItems] = useState([]);
  const username = localStorage.getItem("username") || "Learner";

  useEffect(() => {
    API.get("/api/progress/")
      .then((res) => setItems(res.data))
      .catch(console.error);
  }, []);

  const totalXP = items.reduce((sum, it) => sum + (it.xp || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-6 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl w-full bg-white shadow-2xl rounded-3xl p-10 hover:shadow-blue-200 transition-all duration-300"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-3">
            <Trophy className="text-yellow-500 w-8 h-8" />
            <h1 className="text-3xl font-extrabold text-blue-700">
              {username}’s Progress
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Keep learning — every step earns XP and brings you closer to mastery!
          </p>
        </div>

        {/* Total XP Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 text-center shadow-inner"
        >
          <p className="text-lg text-gray-700 font-medium flex justify-center items-center gap-2">
            🎯 Total Points:{" "}
            <span className="text-blue-700 font-bold text-lg">{totalXP}</span>
          </p>
        </motion.div>

        {/* Lessons Progress Section */}
        <div className="space-y-6">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              No lessons completed yet — start learning to earn XP!
            </p>
          ) : (
            items.map((p, index) => (
              <motion.div
                key={p.id || index}
                className="bg-gradient-to-br from-white to-blue-50 border-l-4 border-blue-600 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Lesson Header */}
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800 flex items-center gap-2">
                    <BookOpen className="text-blue-500" /> {p.lesson_title}
                  </span>
                  <span className="text-gray-700 font-medium">
                    {p.completed ? "✅ Completed" : `${p.progress_pct}%`}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-200 rounded-full h-3 mt-2 w-full">
                  <motion.div
                    className="bg-green-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${p.progress_pct}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>

                {/* Stats */}
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{p.progress_pct}% completed</span>
                  <span>Points: {p.xp}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
