import React, { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // Fetch lesson details
  useEffect(() => {
    API.get(`/api/lessons/${id}/`)
      .then((res) => setLesson(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // Fetch questions when quiz starts
  const startQuiz = () => {
    setStarted(true);
    API.get(`/api/quizzes/${lesson.quizzes[0].id}/questions/`)
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error(err));
  };

  const handleAnswer = (qId, ans) => {
    setAnswers({ ...answers, [qId]: ans });
  };

  const submitQuiz = async () => {
    const payload = {
      answers: Object.entries(answers).map(([question_id, answer]) => ({
        question_id,
        answer,
      })),
    };

    try {
      const res = await API.post(
        `/api/quizzes/${lesson.quizzes[0].id}/submit/`,
        payload
      );
      setResult(res.data);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error submitting quiz.");
    }
  };

  if (!lesson) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <motion.div
        className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          {lesson.title}
        </h1>
        <p className="text-gray-600 mb-6">{lesson.description}</p>

        {!started && !result && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
            onClick={startQuiz}
          >
            🚀 Start Quiz
          </motion.button>
        )}

        {started && !result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {questions.map((q, index) => (
              <div key={q.id} className="mb-6">
                <h3 className="font-semibold text-gray-800">
                  {index + 1}. {q.question_text}
                </h3>
                {["A", "B", "C", "D"].map((opt) => (
                  <label key={opt} className="block mt-1">
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      value={opt}
                      onChange={() => handleAnswer(q.id, opt)}
                      checked={answers[q.id] === opt}
                    />
                    <span className="ml-2 text-gray-700">
                      {q[`option_${opt.toLowerCase()}`]}
                    </span>
                  </label>
                ))}
              </div>
            ))}

            <motion.button
              onClick={submitQuiz}
              whileHover={{ scale: 1.05 }}
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700"
            >
              ✅ Submit Quiz
            </motion.button>
          </motion.div>
        )}

        {result && (
          <motion.div
            className="text-center mt-8 bg-blue-50 p-6 rounded-xl shadow-inner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              🎉 Quiz Completed!
            </h2>
            <p className="text-gray-700">
              You scored <strong>{result.score}</strong> out of{" "}
              <strong>{result.total}</strong> ({result.percent}%)
            </p>
            <p className="text-gray-600 mt-2">
              🎯 Points earned: <strong>{result.points_earned}</strong>
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Total XP: {result.new_xp_total}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
