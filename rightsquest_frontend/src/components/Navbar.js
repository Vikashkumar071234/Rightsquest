import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
const username = localStorage.getItem("username");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-10 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      {/* Logo / Brand */}
      <Link
        to="/"
        className="text-2xl font-extrabold tracking-tight hover:text-blue-100 transition duration-200"
      >
        RightsQuest
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-8 text-sm font-medium">
        <Link
          to="/dashboard"
          className="hover:text-blue-100 hover:underline transition duration-200"
        >
          Dashboard
        </Link>
        <Link
          to="/lessons"
          className="hover:text-blue-100 hover:underline transition duration-200"
        >
          Lessons
        </Link>
        <Link
          to="/progress"
          className="hover:text-blue-100 hover:underline transition duration-200"
        >
          Progress
        </Link>
        <Link
          to="/badges"
          className="hover:text-blue-100 hover:underline transition duration-200"
        >
          Badges
        </Link>

        {/* Optional User Info */}
        <div className="flex items-center gap-3 border-l border-blue-400 pl-4">
          <img
            src="https://www.svgrepo.com/show/382106/user.svg"
            alt="User Avatar"
            className="w-8 h-8 rounded-full bg-white p-1 shadow-sm"
          />
          <span className="font-medium">Hi, {username || "User"}!</span>

        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-1 rounded-lg hover:bg-blue-100 transition duration-200 font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
