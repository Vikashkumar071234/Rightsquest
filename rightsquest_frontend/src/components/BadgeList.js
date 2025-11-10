import React, { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

export default function BadgeList() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    API.get("/api/badges/")
      .then((res) => setBadges(res.data))
      .catch((err) => console.error("Badge fetch error:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl"
      >
        <h1 className="text-3xl font-extrabold text-center mb-8 text-yellow-600 flex items-center justify-center gap-2">
          <Award className="w-8 h-8 text-yellow-500" /> Your Badges
        </h1>

        {badges.length === 0 ? (
          <p className="text-center text-gray-600">
            You haven't earned any badges yet. Complete lessons to unlock achievements! 🏆
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {badges.map((b, index) => (
              <motion.div
                key={b.id || index}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl bg-yellow-50 border-l-4 border-yellow-500 shadow-md"
              >
                <h3 className="text-xl font-semibold text-yellow-700">{b.name}</h3>
                <p className="text-gray-600 mt-2 text-sm">{b.description}</p>
                <p className="mt-3 text-sm text-yellow-600 font-medium">🏅 Code: {b.code}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
