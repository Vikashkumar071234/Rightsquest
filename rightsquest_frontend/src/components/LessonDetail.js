import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api";

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("access")) { navigate("/login"); return; }
    API.get(`/api/lessons/${id}/`).then(res => setLesson(res.data)).catch(console.error);
  }, [id, navigate]);

  if (!lesson) return <div className="p-6">Loading...</div>;

  const firstQuiz = lesson.quizzes?.[0];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
      <p className="text-gray-600 mb-6">{lesson.description}</p>
      <div className="bg-white p-5 rounded-xl shadow">
        <p className="whitespace-pre-wrap">{lesson.content}</p>
      </div>

      {firstQuiz && (
        <button
          onClick={() => navigate(`/quiz/${firstQuiz.id}`)}
          className="mt-6 px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          Start Quiz
        </button>
      )}

      <div className="mt-6">
        <Link to="/lessons" className="text-blue-600">← Back to lessons</Link>
      </div>
    </div>
  );
}
