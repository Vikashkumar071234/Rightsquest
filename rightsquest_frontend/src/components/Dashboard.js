import React, { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { Trophy, Star, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({ xp: 0, completed: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/api/progress/")
      .then((res) => {
        const totalXP = res.data.reduce((sum, p) => sum + p.xp, 0);
        const completed = res.data.filter((p) => p.completed).length;
        setStats({ xp: totalXP, completed });
      })
      .catch(() => {});
  }, []);

  const level = Math.floor(stats.xp / 50) + 1; // 🎯 Level system (50 XP per level)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <motion.div
        className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-3xl font-extrabold mb-4 text-blue-700">Welcome Back 👋</h1>
        <p className="text-gray-600 mb-6">Keep learning and level up your RightsQuest journey!</p>

        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <motion.div className="p-6 bg-blue-100 rounded-xl shadow-inner">
            <Trophy className="w-10 h-10 mx-auto text-yellow-500 mb-2" />
            <h3 className="text-xl font-bold">{stats.completed}</h3>
            <p className="text-gray-600">Lessons Completed</p>
          </motion.div>

          <motion.div className="p-6 bg-green-100 rounded-xl shadow-inner">
            <Star className="w-10 h-10 mx-auto text-yellow-500 mb-2" />
            <h3 className="text-xl font-bold">{stats.xp} XP</h3>
            <p className="text-gray-600">Total XP Earned</p>
          </motion.div>

          <motion.div className="p-6 bg-purple-100 rounded-xl shadow-inner">
            <BookOpen className="w-10 h-10 mx-auto text-purple-600 mb-2" />
            <h3 className="text-xl font-bold">Level {level}</h3>
            <p className="text-gray-600">Current Rank</p>
          </motion.div>
        </div>

        <button
          onClick={() => navigate("/lessons")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
        >
          Continue Learning →
        </button>
      </motion.div>
    </div>
  );
}
