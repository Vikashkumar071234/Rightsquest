import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { motion } from "framer-motion";
import { Smile, Frown, Trophy, Target, Repeat } from "lucide-react";

export default function Quiz() {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("access")) {
      navigate("/login");
      return;
    }
    API.get(`/api/quizzes/${quizId}/questions/`)
      .then((res) => setQuestions(res.data))
      .catch(console.error);
  }, [quizId, navigate]);

  const handleChoose = (qid, choice) =>
    setAnswers((prev) => ({ ...prev, [qid]: choice }));

  const handleSubmit = async () => {
    const payload = {
      answers: Object.entries(answers).map(([qid, choice]) => ({
        question_id: Number(qid),
        answer: choice,
      })),
    };
    const res = await API.post(`/api/quizzes/${quizId}/submit/`, payload);
    setResult(res.data);
  };

  // --------------------------
  // ✅ Show Result Screen
  // --------------------------
  if (result) {
    const percentage = result.percent || 0;
    const passed = percentage >= 60;
    const resultIcon = passed ? (
      <Smile className="text-green-500 w-12 h-12" />
    ) : (
      <Frown className="text-red-500 w-12 h-12" />
    );
    const bgColor = passed ? "bg-green-50" : "bg-red-50";
    const message = passed
      ? "Great job! You’re making amazing progress 🎉"
      : "Keep going! Every attempt makes you stronger 💪";

    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center p-8`}>
        <motion.div
          className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">{resultIcon}</div>
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Quiz Result</h2>
          <p className="text-gray-600 mb-4">{message}</p>

          <motion.div
            className="text-2xl font-bold text-gray-800"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            🧮 Score: {result.score}/{result.total} ({percentage}%)
          </motion.div>

          <div className="mt-4 text-lg text-gray-700">
            <Target className="inline-block mr-2 text-blue-600" />
            Points earned:{" "}
            <span className="font-semibold text-blue-600">
              {result.points_earned}
            </span>
          </div>

          <p className="text-sm text-gray-600 mt-1">
            Total points for this lesson: {result.new_xp_total}
          </p>

          {/* Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <motion.button
              onClick={() => navigate("/progress")}
              whileHover={{ scale: 1.05 }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              View Progress
            </motion.button>

            <motion.button
              onClick={() => setResult(null)}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
            >
              <Repeat className="w-4 h-4" /> Retry Quiz
            </motion.button>
          </div>

          <div className="mt-8 text-sm text-gray-500 italic">
            Keep learning, one quiz at a time! 🚀
          </div>
        </motion.div>
      </div>
    );
  }

  // --------------------------
  // 🧩 Quiz Questions Screen
  // --------------------------
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
        <Trophy className="text-yellow-500" /> Quiz
      </h1>
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <motion.div
            key={q.id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <p className="font-semibold mb-3 text-gray-800">
              {idx + 1}. {q.question_text}
            </p>
            {["A", "B", "C", "D"].map((opt) => (
              <label
                key={opt}
                className={`block mb-2 cursor-pointer ${
                  answers[q.id] === opt ? "text-blue-700 font-medium" : ""
                }`}
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={answers[q.id] === opt}
                  onChange={() => handleChoose(q.id, opt)}
                  className="mr-2 accent-blue-600"
                />
                {q[`option_${opt.toLowerCase()}`]}
              </label>
            ))}
          </motion.div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
      >
        Submit Quiz
      </button>
    </div>
  );
}
