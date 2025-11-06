import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-blue-600 text-white">
      <h1 className="text-xl font-bold">RightsQuest</h1>
      <div className="flex gap-4">
        <Link to="/lessons" className="hover:underline">Lessons</Link>
        <Link to="/progress">Progress</Link>
        <button onClick={handleLogout} className="hover:underline">
          Logout
        </button>
      </div>
    </nav>
  );
}
