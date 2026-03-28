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

  // ── Supabase not configured → redirect to login (which shows setup warning) ──
  if (!isSupabaseConfigured) return <SafeRedirect to="/login" navigate={navigate} />;

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
    return <SafeRedirect to={dashboardPath} navigate={navigate} />;
  }

  return <>{children}</>;
}

// Redirects inside useEffect to avoid React render-phase navigation warnings
function SafeRedirect({ to, navigate }: { to: string; navigate: (p: string) => void }) {
  useEffect(() => { navigate(to); }, [to]);
  return null;
}
