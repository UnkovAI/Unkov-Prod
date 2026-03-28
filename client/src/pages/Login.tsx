import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { LogoMark } from "@/components/LogoMark";
import { Eye, EyeOff, ArrowRight, AlertCircle, Zap, Shield } from "lucide-react";

// ── Shared input style ────────────────────────────────────────────
const inp = (focused: boolean): React.CSSProperties => ({
  width: "100%", padding: "0.75rem 1rem", fontSize: "0.9375rem",
  border: `1px solid ${focused ? "#0061d4" : "#dcd6ce"}`, borderRadius: "0.75rem",
  backgroundColor: "#fafafa", color: "#1d1d1f", outline: "none",
  transition: "border-color .15s", boxSizing: "border-box",
});

// ── Login form (shared between both panels) ───────────────────────
function LoginForm({ mode }: { mode: "pilot" | "production" }) {
  const { login, user, dashboardPath, loading } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [focusedField, setFocused] = useState<"email" | "pw" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState("");

  const nextPath =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("next") || dashboardPath
      : dashboardPath;

  useEffect(() => {
    if (!loading && user) navigate(nextPath);
  }, [user, loading, nextPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.ok) setError(result.error || "Login failed.");
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) { setError("Enter your email address first."); return; }
    const { supabase } = await import("@/lib/supabase");
    if (!supabase) { setError("Auth service unavailable."); return; }
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });
    setError("");
    alert(`Password reset email sent to ${email}. Check your inbox.`);
  };

  const accent = mode === "pilot" ? "#0061d4" : "#00297a";

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.375rem" }}>
          Email address
        </label>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="you@yourcompany.com" autoComplete="email" required
          style={inp(focusedField === "email")}
          onFocus={() => setFocused("email")}
          onBlur={() => setFocused(null)}
        />
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
          <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>Password</label>
          <button type="button" onClick={handleForgotPassword}
            style={{ fontSize: "0.8125rem", color: accent, background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
            Forgot password?
          </button>
        </div>
        <div style={{ position: "relative" }}>
          <input
            type={showPw ? "text" : "password"} value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" autoComplete="current-password" required
            style={{ ...inp(focusedField === "pw"), paddingRight: "2.75rem" }}
            onFocus={() => setFocused("pw")}
            onBlur={() => setFocused(null)}
          />
          <button type="button" onClick={() => setShowPw(v => !v)}
            style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}>
            {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "0.75rem" }}>
          <AlertCircle style={{ width: 15, height: 15, color: "#ef4444", flexShrink: 0 }} />
          <span style={{ fontSize: "0.875rem", color: "#b91c1c" }}>{error}</span>
        </div>
      )}

      <button type="submit" disabled={submitting || !email || !password}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
          padding: "0.8125rem", marginTop: "0.25rem", borderRadius: "0.75rem", border: "none",
          backgroundColor: (submitting || !email || !password) ? "#9ca3af" : accent,
          color: "#fff", fontWeight: 700, fontSize: "1rem",
          cursor: (submitting || !email || !password) ? "not-allowed" : "pointer",
          transition: "background .15s",
        }}
        onMouseEnter={e => { if (!submitting && email && password) (e.currentTarget as HTMLElement).style.backgroundColor = "#00195a"; }}
        onMouseLeave={e => { if (!submitting && email && password) (e.currentTarget as HTMLElement).style.backgroundColor = accent; }}>
        {submitting ? (
          <>
            <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" }} />
            Signing in…
          </>
        ) : (
          <>Sign in <ArrowRight style={{ width: 16, height: 16 }} /></>
        )}
      </button>
    </form>
  );
}

// ── Main login page ────────────────────────────────────────────────
export default function Login() {
  const { loading } = useAuth();
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<"pilot" | "production">("pilot");

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#faf9f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #dcd6ce", borderTopColor: "#0061d4", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

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
        <button onClick={() => navigate("/")}
          style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>
          ← Back to home
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div style={{ width: "100%", maxWidth: 460 }}>

          {/* Mode toggle */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.75rem" }}>
            {([
              { id: "pilot",      label: "Pilot access",      icon: Zap,    desc: "30-day structured pilot" },
              { id: "production", label: "Production access",  icon: Shield, desc: "Full platform account" },
            ] as const).map(({ id, label, icon: Icon, desc }) => {
              const active = mode === id;
              return (
                <button key={id} onClick={() => setMode(id)}
                  style={{
                    flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start",
                    gap: "0.25rem", padding: "1rem 1.125rem", borderRadius: "0.875rem",
                    border: `1.5px solid ${active ? (id === "pilot" ? "#0061d4" : "#00297a") : "#dcd6ce"}`,
                    backgroundColor: active ? (id === "pilot" ? "#eff6ff" : "#f0f4ff") : "#fff",
                    cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <Icon style={{ width: 14, height: 14, color: active ? (id === "pilot" ? "#0061d4" : "#00297a") : "#9ca3af" }} />
                    <span style={{ fontSize: "0.875rem", fontWeight: 700, color: active ? (id === "pilot" ? "#0061d4" : "#00297a") : "#374151" }}>
                      {label}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: active ? (id === "pilot" ? "#3b82f6" : "#4b5dc8") : "#9ca3af" }}>
                    {desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Card */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #dcd6ce", borderRadius: 16, padding: "2.5rem 2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ marginBottom: "1.75rem" }}>
              <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>
                {mode === "pilot" ? "Sign in to your pilot" : "Sign in to your account"}
              </h1>
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                {mode === "pilot"
                  ? "Access your 30-day structured pilot dashboard."
                  : "Access your full Unkov production environment."}
              </p>
            </div>

            <LoginForm mode={mode} />

            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid #f3f4f6" }}>
              {mode === "pilot" ? (
                <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#6b7280" }}>
                  Not in the pilot yet?{" "}
                  <button onClick={() => navigate("/early-access")}
                    style={{ color: "#0061d4", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                    Apply for access →
                  </button>
                </p>
              ) : (
                <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#6b7280" }}>
                  Need help?{" "}
                  <button onClick={() => navigate("/contact")}
                    style={{ color: "#00297a", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                    Contact support →
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
