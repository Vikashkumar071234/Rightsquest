import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/api/leaderboard/")
      .then((res) => setRows(res.data))
      .catch(() => setError("Leaderboard not available yet."));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-4">🏆 Leaderboard</h1>
        {error ? (
          <p className="text-gray-600">{error}</p>
        ) : rows.length === 0 ? (
          <p className="text-gray-600">No data yet. Keep earning XP!</p>
        ) : (
          <ol className="space-y-3">
            {rows.map((r, i) => (
              <li key={i} className="flex justify-between border-b pb-2">
                <span className="font-medium">
                  #{i + 1} {r.user__username}
                </span>
                <span className="text-blue-700 font-semibold">{r.total_xp} XP</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
