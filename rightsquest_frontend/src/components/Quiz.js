import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Quiz() {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("access")) { navigate("/login"); return; }
    API.get(`/api/quizzes/${quizId}/questions/`)
      .then(res => setQuestions(res.data))
      .catch(console.error);
  }, [quizId, navigate]);

  const handleChoose = (qid, choice) => setAnswers(prev => ({ ...prev, [qid]: choice }));

  const handleSubmit = async () => {
    const payload = {
      answers: Object.entries(answers).map(([qid, choice]) => ({
        question_id: Number(qid),
        answer: choice
      }))
    };
    const res = await API.post(`/api/quizzes/${quizId}/submit/`, payload);
    setResult(res.data);
  };

  if (result) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-2">Quiz Result</h2>
          <p className="mb-1">Score: {result.score}/{result.total} ({result.percent}%)</p>
          <p className="mb-1">🎯 Points earned: <strong>{result.points_earned}</strong></p>
          <p className="mb-4">Your total points for this lesson: {result.new_xp_total}</p>
          <button onClick={() => navigate("/progress")} className="px-4 py-2 bg-blue-600 text-white rounded-lg">View Progress</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quiz</h1>
      <div className="space-y-5">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-5 rounded-xl shadow">
            <p className="font-semibold mb-3">{idx + 1}. {q.question_text}</p>
            {['A','B','C','D'].map(opt => (
              <label key={opt} className="block mb-2">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={answers[q.id] === opt}
                  onChange={() => handleChoose(q.id, opt)}
                  className="mr-2"
                />
                {q[`option_${opt.toLowerCase()}`]}
              </label>
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 px-5 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
      >
        Submit Quiz
      </button>
    </div>
  );
}
