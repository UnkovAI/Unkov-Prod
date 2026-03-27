import { useEffect } from "react";
import { useLocation } from "wouter";

// This MUST match the key used in InvestorGate.tsx
const SESSION_KEY = "unkov_investor_auth";
const FILE = "/Unkov_Architecting_the_Agentic_Enterprise.pptx";

export default function PitchDeck() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const hasAccess = sessionStorage.getItem(SESSION_KEY) === "true";

    if (hasAccess) {
      // 1. Authenticated — trigger the download
      const a = document.createElement("a");
      a.href = FILE;
      a.download = "Unkov_Pitch_Deck.pptx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // 2. Consume the session (for security so they can't just refresh to download again)
      sessionStorage.removeItem(SESSION_KEY);

      // 3. Send them back to the resources page after the download starts
      const timer = setTimeout(() => navigate("/for-investors"), 1500);
      return () => clearTimeout(timer);
    } else {
      // 4. Not authenticated — save where they wanted to go and send to gate
      sessionStorage.setItem("unkov_post_auth_redirect", "/pitch-deck");
      navigate("/investor-gate");
    }
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100vh", 
      backgroundColor: "#0a0f1e",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
      flexDirection: "column", 
      gap: "1rem",
    }}>
      {/* Loading Spinner */}
      <div style={{ 
        width: 40, 
        height: 40, 
        border: "3px solid #00e5ff", 
        borderTopColor: "transparent", 
        borderRadius: "50%", 
        animation: "spin 0.8s linear infinite" 
      }} />
      <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Verifying access & preparing download…</p>
      
      <style>{`
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
}
// ❌ Duplicate useEffect was deleted from here to fix the "null" error
