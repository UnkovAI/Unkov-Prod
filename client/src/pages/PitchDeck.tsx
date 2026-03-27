import { useEffect } from "react";
import { useLocation } from "wouter";

const SESSION_KEY = "unkov_investor_auth";
const FILE = "/Unkov_Architecting_the_Agentic_Enterprise.pptx";

// Gated pitch deck download — checks investor session, then auto-downloads
// If not authenticated, sends to the gate with a return param
export default function PitchDeck() {
  const [, navigate] = useLocation();

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      // Authenticated — consume the session token and trigger download
      sessionStorage.removeItem(SESSION_KEY);
      const a = document.createElement("a");
      a.href = FILE;
      a.download = "Unkov_Pitch_Deck.pptx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Navigate back to investor page after a short delay
      setTimeout(() => navigate("/for-investors"), 800);
    } else {
      // Not authenticated — store intent and send to gate
      sessionStorage.setItem("unkov_post_auth_redirect", "/pitch-deck");
      navigate("/investor-gate");
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#0a0f1e",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
      flexDirection: "column", gap: "1rem",
    }}>
      <div style={{ width: 40, height: 40, border: "3px solid #00e5ff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Preparing download…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
useEffect(() => {
  const hasAccess = sessionStorage.getItem("investor_access");
  if (!hasAccess) navigate("/investor-gate");
}, []);
