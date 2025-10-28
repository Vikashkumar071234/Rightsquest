import React from "react";
import { useNavigate } from "react-router-dom";

export default function LessonCard({ lesson }) {
  const navigate = useNavigate();

  return (
    <div className="lesson-card">
      <h3>{lesson.title}</h3>
      <p>{lesson.content}</p>
      <p>
        <strong>Points:</strong> {lesson.points}
      </p>
      <button onClick={() => navigate(`/lessons/${lesson.id}/quiz`)}>
        Take Quiz
      </button>
    </div>
  );
}
