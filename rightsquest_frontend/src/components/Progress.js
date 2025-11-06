import React, { useEffect, useState } from "react";

export default function Progress() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/progress/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Progress data received:", data); // 👈 Helps debug

        // ✅ If the backend returns an object, convert it into an array
        if (Array.isArray(data)) {
          setProgress(data);
        } else if (data.results) {
          // In case backend sends paginated response (Django REST Framework)
          setProgress(data.results);
        } else {
          setProgress([]);
          console.warn("Unexpected progress data format:", data);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [token]);

  if (loading) {
    return <p className="p-6">Loading your progress...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📈 Your Learning Progress</h2>

      {progress.length === 0 ? (
        <p>No progress yet. Start learning!</p>
      ) : (
        progress.map((p, i) => (
          <div key={i} className="p-4 mb-3 bg-gray-100 rounded shadow">
            <h3 className="font-semibold">Lesson: {p.lesson_title || "N/A"}</h3>
            <p>Score: {p.score}</p>
            <p>Date: {p.created_at ? new Date(p.created_at).toLocaleDateString() : "N/A"}</p>
          </div>
        ))
      )}
    </div>
  );
}
