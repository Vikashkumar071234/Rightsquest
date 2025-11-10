import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/api/progress/").then(res => setItems(res.data)).catch(() => {});
  }, []);

  const totalXP = items.reduce((sum, it) => sum + (it.xp || 0), 0);
  const completed = items.filter(i => i.completed).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back 👋</h1>
          <p className="text-gray-600">Keep learning children’s rights and earn badges.</p>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{totalXP}</div>
            <div className="text-sm text-gray-500">Total XP</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{completed}</div>
            <div className="text-sm text-gray-500">Lessons Done</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate("/lessons")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Continue Learning →
        </button>
      </div>
    </div>
  );
}
