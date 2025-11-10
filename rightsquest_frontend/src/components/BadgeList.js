import React, { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { Award, Lock } from "lucide-react";

export default function BadgeList() {
  const [badges, setBadges] = useState([]);
  const username = localStorage.getItem("username") || "Learner";

  useEffect(() => {
    API.get("/api/badges/")
      .then((res) => setBadges(res.data))
      .catch(() => setBadges([]));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-100 flex justify-center items-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-10 text-center hover:shadow-amber-200 transition-all"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-2 mb-3">
            <Award className="text-yellow-500 w-8 h-8" />
            <h1 className="text-3xl font-extrabold text-yellow-600">
              {username}’s Badges
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Earn badges by completing lessons and leveling up your RightsQuest journey!
          </p>
        </div>

        {/* Badge Display */}
        {badges.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="bg-yellow-50 border border-yellow-100 rounded-2xl p-8 text-gray-700 shadow-inner"
          >
            <Lock className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
            <p className="font-medium">
              You haven’t earned any badges yet. Complete lessons to unlock achievements! 🏆
            </p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id || index}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-white to-yellow-50 p-6 rounded-2xl shadow-md hover:shadow-lg border border-yellow-200 transition-all"
              >
                <Award className="text-yellow-500 w-10 h-10 mx-auto mb-3" />
                <h3 className="font-semibold text-yellow-700 text-lg mb-1">
                  {badge.name}
                </h3>
                <p className="text-gray-600 text-sm">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
