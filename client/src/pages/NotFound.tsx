import { useLocation } from "wouter";
import { LogoMark } from "@/components/LogoMark";
import { Home, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#faf9f7", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ height: 64, borderBottom: "1px solid #dcd6ce", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", backgroundColor: "rgba(250,249,247,0.97)" }}>
        <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <LogoMark size={34} />
          <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "#1a1a2e", letterSpacing: "-0.02em" }}>
            <span style={{ color: "#00c6e0" }}>U</span>nkov
          </span>
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div style={{ fontSize: "5rem", fontWeight: 800, color: "#e5e7eb", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "0.5rem" }}>
            404
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1d1d1f", marginBottom: "0.75rem", letterSpacing: "-0.025em" }}>
            Page not found
          </h1>
          <p style={{ fontSize: "1rem", color: "#6b7280", lineHeight: 1.7, marginBottom: "2rem" }}>
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/")}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", backgroundColor: "#00297a", color: "#fff", border: "none", borderRadius: "9999px", cursor: "pointer", fontWeight: 600, fontSize: "0.9375rem", transition: "background .15s" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#001f5c")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#00297a")}
            >
              <Home style={{ width: 15, height: 15 }} /> Go home
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", backgroundColor: "transparent", color: "#0061d4", border: "1.5px solid #c0d7f5", borderRadius: "9999px", cursor: "pointer", fontWeight: 600, fontSize: "0.9375rem", transition: "all .15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#e8f0fe"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
            >
              Sign in <ArrowRight style={{ width: 15, height: 15 }} />
            </button>
          </div>
        </div>
      </div>
    <Footer />
    </div>
  );
}
