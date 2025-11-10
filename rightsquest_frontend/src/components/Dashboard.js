import React, { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { Trophy, Star, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({ xp: 0, completed: 0 });
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Learner";

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
  const xpProgress = ((stats.xp % 50) / 50) * 100; // percentage for XP bar

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-8 flex items-center justify-center">
      <motion.div
        className="max-w-4xl w-full bg-white p-10 rounded-3xl shadow-2xl text-center hover:shadow-blue-200 transition-all duration-300"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <h1 className="text-4xl font-extrabold mb-3 text-blue-700">
          Welcome Back, {username}! 👋
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Keep learning and level up your{" "}
          <span className="font-semibold text-blue-600">RightsQuest</span>{" "}
          journey!
        </p>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Lessons Completed */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl shadow-inner hover:shadow-lg hover:shadow-blue-200 transition"
          >
            <Trophy className="w-10 h-10 mx-auto text-yellow-500 mb-3" />
            <h3 className="text-3xl font-bold text-blue-700">
              {stats.completed}
            </h3>
            <p className="text-gray-600 font-medium mt-1">
              Lessons Completed
            </p>
          </motion.div>

          {/* Total XP Earned */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl shadow-inner hover:shadow-lg hover:shadow-green-200 transition"
          >
            <Star className="w-10 h-10 mx-auto text-yellow-500 mb-3" />
            <h3 className="text-3xl font-bold text-green-700">{stats.xp} XP</h3>
            <p className="text-gray-600 font-medium mt-1">Total XP Earned</p>
          </motion.div>

          {/* Level */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl shadow-inner hover:shadow-lg hover:shadow-purple-200 transition"
          >
            <BookOpen className="w-10 h-10 mx-auto text-purple-600 mb-3" />
            <h3 className="text-3xl font-bold text-purple-700">
              Level {level}
            </h3>
            <p className="text-gray-600 font-medium mt-1">Current Rank</p>
          </motion.div>
        </div>

        {/* XP Progress Bar */}
        <div className="max-w-lg mx-auto mt-4 text-left">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1 }}
            ></motion.div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Progress to next level: {Math.round(xpProgress)}%
          </p>
        </div>

        {/* Continue Learning Button */}
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 20px rgba(37, 99, 235, 0.4)",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/lessons")}
          className="mt-8 bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 text-lg"
        >
          Continue Learning →
        </motion.button>
      </motion.div>
    </div>
  );
}
