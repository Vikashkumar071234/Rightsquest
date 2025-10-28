import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Quiz() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const token = localStorage.getItem("access");

  // Fetch quiz questions
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/quizzes/${id}/questions/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, [id, token]);

  // Handle option selection
  const handleChange = (qid, option) => {
    setAnswers({ ...answers, [qid]: option });
  };

  // Submit quiz answers
  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/quizzes/${id}/submit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  // Show result after submission
  if (result) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Quiz Result</h2>
        <p>Score: {result.score}</p>
        <p>Badge: 🏅 {result.badge}</p>
      </div>
    );
  }

  // Render questions
  return (
    <div style={{ padding: "20px" }}>
      <h2>Quiz</h2>
      {questions.map((q) => (
        <div key={q.id} style={{ marginBottom: "20px" }}>
          <h4>{q.text}</h4>
          {["A", "B", "C", "D"].map((opt) => (
            <label key={opt} style={{ display: "block" }}>
              <input
                type="radio"
                name={q.id}
                onChange={() => handleChange(q.id, opt)}
                checked={answers[q.id] === opt}
              />
              {opt}: {q[`option_${opt.toLowerCase()}`]}
            </label>
          ))}
        </div>
      ))}

      {questions.length > 0 && (
        <button onClick={handleSubmit}>Submit Quiz</button>
      )}
    </div>
  );
}
