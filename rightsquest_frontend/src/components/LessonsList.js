import React, { useEffect, useState } from "react";
import API from "../api/api";
import LessonCard from "./LessonCard";
import { useNavigate } from "react-router-dom";

export default function LessonsList() {
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // If user not logged in → redirect to login
    if (!localStorage.getItem("access")) {
      navigate("/login");
      return;
    }

    const fetchLessons = async () => {
      try {
        const response = await API.get("/api/lessons/");
        setLessons(response.data);
      } catch (error) {
        console.log("Error loading lessons:", error);
      }
    };

    fetchLessons();
  }, [navigate]);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">📚 Lessons</h1>

      <div className="grid gap-4">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
