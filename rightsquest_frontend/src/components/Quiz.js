import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Quiz() {
  const { id } = useParams(); // lesson id
  const [lesson, setLesson] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [total, setTotal] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/lessons/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setLesson(data))
      .catch((err) => console.error("Error fetching lesson:", err));
  }, [id, token]);

  const handleAnswer = (questionId, answer) => {
    if (!submitted) {
      setUserAnswers({ ...userAnswers, [questionId]: answer });
    }
  };

  const handleSubmit = async () => {
    if (!lesson || !lesson.quizzes.length) return;

    const quizId = lesson.quizzes[0].id;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/quizzes/${quizId}/submit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: userAnswers }),
      });

      const data = await res.json();
      setScore(data.score);
      setTotal(data.total);
      setCorrectAnswers(data.correct_answers);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  if (!lesson) return <p>Loading quiz...</p>;

  const quiz = lesson.quizzes[0];
  if (!quiz) return <p>No quiz available for this lesson.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>

      {quiz.questions.map((q) => (
        <div key={q.id} className="mb-4 p-4 border rounded">
          <p className="font-semibold mb-2">{q.question_text}</p>
          {["A", "B", "C", "D"].map((opt) => {
            const optionText = q[`option_${opt.toLowerCase()}`];
            let optionClass = "block w-full text-left p-2 border rounded mb-1";

            if (submitted) {
              if (correctAnswers[q.id] === opt) optionClass += " bg-green-200";
              else if (userAnswers[q.id] === opt) optionClass += " bg-red-200";
            } else if (userAnswers[q.id] === opt) {
              optionClass += " bg-blue-100";
            }

            return (
              <button
                key={opt}
                className={optionClass}
                onClick={() => handleAnswer(q.id, opt)}
                disabled={submitted}
              >
                {optionText}
                {submitted && correctAnswers[q.id] === opt && " ✅"}
                {submitted &&
                  userAnswers[q.id] === opt &&
                  correctAnswers[q.id] !== opt &&
                  " ❌"}
              </button>
            );
          })}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="mt-4 text-lg font-semibold">
          🎯 Your Score: {score}/{total}
        </div>
      )}
    </div>
  );
}
