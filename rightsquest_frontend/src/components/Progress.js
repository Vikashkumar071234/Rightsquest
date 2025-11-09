import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Progress() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    API.get("/api/progress/").then(res => setItems(res.data)).catch(console.error);
  }, []);

  const totalXP = items.reduce((sum, it) => sum + (it.xp || 0), 0);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Your Progress</h1>
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <p className="text-lg">🎯 Total Points: <strong>{totalXP}</strong></p>
      </div>

      <div className="space-y-4">
        {items.map(it => (
          <div key={it.id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">{it.lesson_title}</span>
              <span>{it.progress_pct}% {it.completed ? '✅' : ''}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="h-3 bg-blue-600 rounded-full" style={{ width: `${it.progress_pct}%` }} />
            </div>
            <div className="text-sm text-gray-600 mt-2">Points: {it.xp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
