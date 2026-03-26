import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  children: React.ReactNode;
  requiredRole?: "pilot_customer" | "paying_customer" | "admin";
  // If requiredRole is set, only that exact role (or admin) can access.
  // If not set, any authenticated user can access.
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, loading, dashboardPath } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0a0f1e" }}>
        <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#0061d4", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // Not logged in → send to /login
  if (!user) {
    navigate("/login");
    return null;
  }

  // Role guard: admin always passes. Otherwise must match requiredRole.
  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    // Wrong dashboard for this role — redirect to the correct one
    navigate(dashboardPath);
    return null;
  }

  return <>{children}</>;
}
