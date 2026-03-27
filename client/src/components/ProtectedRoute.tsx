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

  // 🚫 If Supabase not configured
  if (!isSupabaseConfigured) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0f1e",
        color: "#e2e8f0",
      }}>
        <h2 style={{ color: "#f87171" }}>Authentication not configured</h2>
        <button onClick={() => navigate("/")}>Back to home</button>
      </div>
    );
  }

  // ⏳ Still loading session → DO NOTHING
  if (loading) return null;

  // ❌ Not logged in → redirect
  if (!user) {
    return <RedirectTo to="/login" navigate={navigate} />;
  }

  // 🔐 Role check (admin bypass)
  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    return <RedirectTo to={dashboardPath} navigate={navigate} />;
  }

  return <>{children}</>;
}

// ✅ Safe redirect helper
function RedirectTo({ to, navigate }: { to: string; navigate: (path: string) => void }) {
  useEffect(() => {
    navigate(to);
  }, [to, navigate]);

  return null;
}