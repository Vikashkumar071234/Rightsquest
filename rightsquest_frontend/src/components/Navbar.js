import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", background: "#007BFF", color: "white" }}>
      <Link to="/lessons" style={{ color: "white", marginRight: "15px" }}>
        Lessons
      </Link>
      {!token ? (
        <>
          <Link to="/login" style={{ color: "white", marginRight: "15px" }}>
            Login
          </Link>
          <Link to="/signup" style={{ color: "white" }}>
            Signup
          </Link>
        </>
      ) : (
        <button onClick={handleLogout} style={{ color: "#007BFF", background: "white", border: "none", padding: "5px 10px", borderRadius: "5px" }}>
          Logout
        </button>
      )}
    </nav>
  );
}
