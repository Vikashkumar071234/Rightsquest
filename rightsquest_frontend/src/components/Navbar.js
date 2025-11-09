import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">RightsQuest</h1>
      <div className="flex items-center space-x-6">
        <Link to="/lessons" className="hover:underline">Lessons</Link>
        <Link to="/progress" className="hover:underline">Progress</Link>
        <button
          onClick={handleLogout}
          className="hover:underline text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
