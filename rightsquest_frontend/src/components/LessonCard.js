import React from "react";
import { Link } from "react-router-dom";

export default function LessonCard({ lesson }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">{lesson.title}</h2>
      <p className="text-gray-600 mt-2">{lesson.description}</p>
      <Link
        to={`/lessons/${lesson.id}`}
        className="text-blue-600 font-medium mt-3 inline-block"
      >
        Start Lesson →
      </Link>
    </div>
  );
}
