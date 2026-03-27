import { createRoot } from "react-dom/client";
import { Router } from "wouter"; // 1. Add this import
import App from "./App";
import "./index.css";

// Hide the pre-load indicator once React starts mounting
const preLoad = document.getElementById("pre-load");
if (preLoad) preLoad.style.display = "none";

// 2. Wrap <App /> in <Router>
createRoot(document.getElementById("root")!).render(
  <Router>
    <App />
  </Router>
);
