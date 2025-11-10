import React, { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";
import mascotImg from "../assets/mascot.png"; // 🧸 add your mascot image here

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      toast.error("⚠️ Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      await API.post("/api/register/", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      toast.success("✅ Account created! Please log in.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.error ||
          "❌ Registration failed. Try a different username."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 text-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-4xl flex flex-col md:flex-row items-center gap-8 overflow-hidden"
      >
        {/* 🧸 Mascot Section */}
        <div className="hidden md:flex justify-center items-center w-1/2">
          <motion.img
            src={mascotImg}
            alt="Mascot"
            className="w-64 drop-shadow-lg"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        </div>

        {/* 📝 Signup Form Section */}
        <div className="w-full md:w-1/2">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <UserPlus className="text-blue-600 w-10 h-10" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
              Join RightsQuest 🎓
            </h1>
            <p className="text-gray-500">
              Create your account to start learning and earning XP 💪
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-700"
            />

            <input
              type="email"
              name="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-700"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-700"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-700"
            />

            {/* Button with Hover Animation */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 20px rgba(37, 99, 235, 0.4)",
              }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login here →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
