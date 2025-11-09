import React, { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { Trophy, BookOpen } from "lucide-react";

export default function Progress() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    API.get("/api/progress/")
      .then((res) => setItems(res.data))
      .catch(console.error);
  }, []);

  const totalXP = items.reduce((sum, it) => sum + (it.xp || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-blue-700">
          <Trophy className="text-yellow-500" /> Your Progress
        </h1>

        <div className="bg-blue-50 p-4 rounded-xl mb-8 shadow-inner">
          <p className="text-lg text-gray-700">
            🎯 Total Points: <strong className="text-blue-700">{totalXP}</strong>
          </p>
        </div>

        <div className="space-y-6">
          {items.map((p, index) => (
            <motion.div
              key={p.id}
              className="bg-white border-l-4 border-blue-600 p-5 rounded-xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800 flex items-center gap-2">
                  <BookOpen className="text-blue-500" /> {p.lesson_title}
                </span>
                <span className="text-gray-700 font-medium">
                  {p.completed ? "✅ Completed" : `${p.progress_pct}%`}
                </span>
              </div>

              {/* Animated Progress Bar */}
              <div className="bg-gray-200 rounded-full h-4 mt-2 w-full">
                <motion.div
                  className="bg-green-500 h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${p.progress_pct}%` }}
                  transition={{ duration: 1 }}
                />
              </div>

              <p className="text-sm text-gray-600 mt-1">
                {p.progress_pct}% completed
              </p>
              <p className="text-sm text-gray-600 mt-1">Points: {p.xp}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
