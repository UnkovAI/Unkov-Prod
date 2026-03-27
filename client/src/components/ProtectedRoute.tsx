import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabase";

interface Props {
  children: React.ReactNode;
  requiredRole?: "pilot_customer" | "paying_customer" | "admin";
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, loading, dashboardPath } = useAuth();
  const [, navigate] = useLocation();

  if (!loading && !user) {
    navigate('/login');
    return null;
  }

  // If Supabase isn't wired up at all, show a clear config error instead of a blank page
  if (!isSupabaseConfigured) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        backgroundColor: "#0a0f1e", color: "#e2e8f0",
        fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center",
      }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem", color: "#f87171" }}>
          Authentication not configured
        </h2>
        <p style={{ color: "#94a3b8", maxWidth: 480, lineHeight: 1.7, marginBottom: "1.5rem" }}>
          The Supabase environment variables are missing. Add{" "}
          <code style={{ backgroundColor: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: 4, fontSize: "0.85em" }}>
            VITE_SUPABASE_URL
          </code>{" "}and{" "}
          <code style={{ backgroundColor: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: 4, fontSize: "0.85em" }}>
            VITE_SUPABASE_PUBLISHABLE_KEY
          </code>{" "}
          to your Vercel project environment variables, then redeploy.
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.625rem 1.5rem", backgroundColor: "#0061d4", color: "#fff",
            border: "none", borderRadius: "9999px", cursor: "pointer",
            fontSize: "0.9rem", fontWeight: 600,
          }}
        >
          ← Back to home
        </button>
      </div>
    );
  }

  // Still resolving session from Supabase — show spinner, never redirect yet
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", backgroundColor: "#0a0f1e",
      }}>
        <div style={{
          width: 32, height: 32,
          border: "3px solid rgba(255,255,255,0.1)",
          borderTopColor: "#0061d4", borderRadius: "50%",
          animation: "spin .7s linear infinite",
        }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // Not logged in — redirect to login
  // Use useEffect to avoid "navigate during render" React warnings
  if (!user) {
    return <RedirectTo to="/login" navigate={navigate} />;
  }

  // Role guard: admin always passes; otherwise must match requiredRole
  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    return <RedirectTo to={dashboardPath} navigate={navigate} />;
  }

  return <>{children}</>;
}

// Tiny helper that navigates in an effect, returning null meanwhile
function RedirectTo({ to, navigate }: { to: string; navigate: (path: string) => void }) {
  useEffect(() => { navigate(to); }, [to, navigate]);
  return null;
}
