import React, { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff } from "lucide-react";
import mascotImg from "../assets/mascot.png"; // 🧸 Mascot image

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  // 🧠 Handle input change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 🔑 Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/api/token/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
localStorage.setItem("username", form.username);

      if (remember) {
        localStorage.setItem("rememberUser", form.username);
      } else {
        localStorage.removeItem("rememberUser");
      }

      toast.success(`🎉 Welcome back, ${form.username}!`);
      navigate("/lessons");
    } catch (err) {
      toast.error("❌ Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Auto-fill remembered username
  useEffect(() => {
    const remembered = localStorage.getItem("rememberUser");
    if (remembered) {
      setForm((f) => ({ ...f, username: remembered }));
      setRemember(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 text-gray-900">
      {/* LOGIN BOX */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-4xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
      >
        {/* 🧸 Mascot / Illustration */}
        <div className="hidden md:flex justify-center items-center w-1/2">
          <motion.img
            src={mascotImg}
            alt="Mascot"
            className="w-64 drop-shadow-lg"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        </div>

        {/* 🔐 Login Section */}
        <div className="w-full md:w-1/2">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <Lock className="text-blue-600 w-10 h-10" />
            </div>
            <h1 className="text-3xl font-extrabold mb-2">Welcome Back 👋</h1>
            <p className="text-gray-600">Log in to continue your learning journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="text-sm font-medium">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-transparent"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="text-sm font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                Remember me
              </label>
              <Link to="#" className="text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
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
              {loading ? "Logging in..." : "Login"}
            </motion.button>

            {/* OR Divider */}
            <div className="flex items-center gap-3 mt-6">
              <hr className="flex-grow border-gray-300" />
              <span className="text-gray-500">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* OAuth Buttons */}
            <div className="flex flex-col gap-3 mt-4">
              <button
                type="button"
                className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition flex justify-center items-center gap-2"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </button>

              <button
                type="button"
                className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition flex justify-center items-center gap-2"
              >
                <img
                  src="https://www.svgrepo.com/show/512317/github-142.svg"
                  alt="GitHub"
                  className="w-5 h-5"
                />
                Continue with GitHub
              </button>
            </div>
          </form>

          {/* Signup Link */}
          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
