// src/components/LessonDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/lessons/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          alert("Unauthorized. Please log in again.");
          navigate("/login");
        }
        return res.json();
      })
      .then((data) => setLesson(data))
      .catch((err) => console.error("Error fetching lesson:", err));
  }, [id, token, navigate]);

  if (!lesson) return <p>Loading lesson...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{lesson.title}</h2>
      <p><strong>Description:</strong> {lesson.description}</p>
      <p><strong>Content:</strong> {lesson.content}</p>
      <p><strong>Points:</strong> {lesson.points}</p>

      {lesson.quizzes && lesson.quizzes.length > 0 ? (
        <button
          onClick={() => navigate(`/lessons/${lesson.id}/quiz`)}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "8px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Start Quiz
        </button>
      ) : (
        <p>No quizzes available for this lesson yet.</p>
      )}
    </div>
  );
}
