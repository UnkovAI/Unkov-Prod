import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { LogoMark } from "@/components/LogoMark";
import { Eye, EyeOff, ArrowRight, AlertCircle, Lock } from "lucide-react";


export default function Login() {
  const { login, user, dashboardPath, loading } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Parse optional ?next= so we land on the right page after login
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
    if (!email.trim()) {
      setError("Enter your email address above, then click Forgot password.");
      return;
    }
    const { supabase } = await import("@/lib/supabase");
    if (!supabase) { setError("Auth service unavailable."); return; }
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });
    setError("");
    alert(`Password reset email sent to ${email}. Check your inbox.`);
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem", fontSize: "0.9375rem",
    border: "1px solid #dcd6ce", borderRadius: "0.75rem",
    backgroundColor: "#fafafa", color: "#1d1d1f", outline: "none",
    transition: "border-color .15s",
  };

  // Show spinner while session resolves — never a blank page
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
          style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#6b7280", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.375rem" }}>
          ← Back to home
        </button>
      </div>



      {/* Main */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Card */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #dcd6ce", borderRadius: 16, padding: "2.5rem 2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "#e8f0fe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                <Lock style={{ width: 22, height: 22, color: "#0061d4" }} />
              </div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em", marginBottom: "0.375rem" }}>
                Sign in to Unkov
              </h1>
              <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.375rem" }}>
                  Email address
                </label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@yourcompany.com" autoComplete="email" required
                  style={inp}
                  onFocus={e => (e.currentTarget.style.borderColor = "#0061d4")}
                  onBlur={e  => (e.currentTarget.style.borderColor = "#dcd6ce")}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                  <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>Password</label>
                  <button type="button" onClick={handleForgotPassword}
                    style={{ fontSize: "0.8125rem", color: "#0061d4", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" autoComplete="current-password" required
                    style={{ ...inp, paddingRight: "2.75rem" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#0061d4")}
                    onBlur={e  => (e.currentTarget.style.borderColor = "#dcd6ce")}
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
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.8125rem",
                  backgroundColor: (submitting || !email || !password) ? "#9ca3af" : "#0061d4",
                  color: "#fff", fontWeight: 700, fontSize: "1rem", borderRadius: "0.75rem", border: "none",
                  cursor: (submitting || !email || !password) ? "not-allowed" : "pointer",
                  transition: "background .15s", marginTop: "0.5rem" }}
                onMouseEnter={e => { if (!submitting && email && password) (e.currentTarget as HTMLElement).style.backgroundColor = "#00297a"; }}
                onMouseLeave={e => { if (!submitting && email && password) (e.currentTarget as HTMLElement).style.backgroundColor = "#0061d4"; }}>
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

            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid #f3f4f6" }}>
              <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#6b7280" }}>
                Don't have an account?{" "}
                <button onClick={() => navigate("/signup")}
                  style={{ color: "#0061d4", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                  Create account →
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
