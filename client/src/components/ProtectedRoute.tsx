import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { LogoMark } from "@/components/LogoMark";
import { isSupabaseConfigured } from "@/lib/supabase";

interface Props {
  children: React.ReactNode;
  requiredRole?: "pilot_customer" | "paying_customer" | "admin";
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, loading, dashboardPath } = useAuth();
  const [, navigate] = useLocation();

  // ── Supabase env vars missing → explain clearly instead of blank/redirect loop ──
  if (!isSupabaseConfigured) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        backgroundColor: "#0a0f1e", color: "#e2e8f0",
        fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center",
      }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <LogoMark size={44} bgColor="#0a0f1e" />
        </div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem", color: "#f87171" }}>
          Authentication not configured
        </h2>
        <p style={{ color: "#94a3b8", maxWidth: 480, lineHeight: 1.7, marginBottom: "1rem", fontSize: "0.9rem" }}>
          This page requires authentication, but the Supabase environment variables are missing from the deployment.
        </p>
        <div style={{
          backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10, padding: "1rem 1.5rem", marginBottom: "1.5rem",
          textAlign: "left", lineHeight: 2.2,
          fontFamily: "'Courier New', monospace", fontSize: "0.8rem", color: "#60a5fa",
        }}>
          VITE_SUPABASE_URL=https://xxxx.supabase.co<br />
          VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
        </div>
        <p style={{ color: "#475569", fontSize: "0.82rem", marginBottom: "1.5rem", maxWidth: 400 }}>
          Add these in <strong style={{ color: "#94a3b8" }}>Vercel → Project → Settings → Environment Variables</strong>, then trigger a new deployment.
        </p>
        <button
          onClick={() => navigate("/")}
          style={{ padding: "0.625rem 1.5rem", backgroundColor: "#0061d4", color: "#fff", border: "none", borderRadius: "9999px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600 }}>
          ← Back to home
        </button>
      </div>
    );
  }

  // ── Session still resolving — show spinner, never redirect yet ──
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#0a0f1e", gap: "1rem" }}>
        <LogoMark size={36} bgColor="#0a0f1e" />
        <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.08)", borderTopColor: "#0061d4", borderRadius: "50%", animation: "spin .75s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── Not authenticated → redirect to login ──
  if (!user) return <SafeRedirect to="/login" navigate={navigate} />;

  // ── Wrong role → redirect to their correct dashboard ──
  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    console.warn(`[Unkov] Role mismatch: user has role "${user.role}", page requires "${requiredRole}". Redirecting to ${dashboardPath}.`);
    return <SafeRedirect to={dashboardPath} navigate={navigate} />;
  }

  return <>{children}</>;
}

// Redirects inside useEffect to avoid React render-phase navigation warnings
function SafeRedirect({ to, navigate }: { to: string; navigate: (p: string) => void }) {
  useEffect(() => { navigate(to); }, [to]);
  return null;
}
