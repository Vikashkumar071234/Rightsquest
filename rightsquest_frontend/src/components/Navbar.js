import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold">RightsQuest</Link>
      <div className="flex items-center gap-6">
        <Link to="/lessons" className="hover:underline">Lessons</Link>
        <Link to="/progress" className="hover:underline">Progress</Link>
        <Link to="/badges" className="hover:underline">Badges</Link>

        <button onClick={handleLogout} className="hover:underline">Logout</button>
      </div>
    </nav>
  );
}
