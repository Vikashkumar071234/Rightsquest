import React from "react";

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white text-center py-3 mt-8 shadow-inner">
      © {new Date().getFullYear()} RightsQuest.
    </footer>
  );
}
