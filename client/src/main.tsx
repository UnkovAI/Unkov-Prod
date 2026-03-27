import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Hide the pre-load indicator once React starts mounting
const preLoad = document.getElementById("pre-load");
if (preLoad) preLoad.style.display = "none";

createRoot(document.getElementById("root")!).render(<App />);
