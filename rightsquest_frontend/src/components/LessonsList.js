import React, { useEffect, useState } from "react";
import LessonCard from "./LessonCard";

export default function LessonsList() {
  const [lessons, setLessons] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/lessons/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setLessons(data))
      .catch((err) => console.error("Error fetching lessons:", err));
  }, [token]);

  return (
    <div>
      <h2>Lessons</h2>
      {lessons.length === 0 ? (
        <p>No lessons available.</p>
      ) : (
        <div className="lessons-container">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
}
