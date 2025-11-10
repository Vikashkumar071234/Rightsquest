import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        // Default styling for all toasts
        style: {
          background: "#333", // dark background
          color: "#fff",      // white text
          borderRadius: "10px",
          padding: "12px 16px",
          fontSize: "15px",
        },
        // Specific styling for success and error
        success: {
          iconTheme: {
            primary: "#4ade80", // green
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#f87171", // red
            secondary: "#fff",
          },
        },
      }}
    />
  </>
);
