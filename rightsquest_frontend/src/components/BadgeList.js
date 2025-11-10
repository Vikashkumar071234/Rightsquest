import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function BadgeList() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    API.get("/api/badges/")
      .then((res) => setBadges(res.data))
      .catch(() => setBadges([]));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🏅 Your Badges</h1>
        {badges.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow">No badges yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {badges.map((b) => (
              <div key={b.id || b.code} className="bg-white p-5 rounded-2xl shadow border-l-4 border-blue-600">
                <div className="text-2xl mb-2">{b.icon || "🏅"}</div>
                <div className="font-semibold">{b.name}</div>
                <div className="text-gray-600 text-sm">{b.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
