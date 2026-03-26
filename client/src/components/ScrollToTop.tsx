import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowUp } from "lucide-react";

// Scrolls to top on every route change
export function ScrollRestorer() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

// Floating back-to-top button — appears after scrolling 400px
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 900,
        width: 44,
        height: 44,
        borderRadius: "50%",
        backgroundColor: "#00297a",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 16px rgba(0,41,122,0.35)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.85)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.22s ease, transform 0.22s ease, background-color 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#0041a8")}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#00297a")}
    >
      <ArrowUp style={{ width: 18, height: 18 }} />
    </button>
  );
}
