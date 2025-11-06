// src/components/LessonCard.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function LessonCard({ lesson }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/lessons/${lesson.id}`);
  };

  return (
    <div
      className="lesson-card"
      onClick={handleClick}
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "10px",
        borderRadius: "10px",
        cursor: "pointer",
      }}
    >
      <h3>{lesson.title}</h3>
      <p>{lesson.description}</p>
      <p><strong>Points:</strong> {lesson.points}</p>
    </div>
  );
}
