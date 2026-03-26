import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { LogoMark } from "@/components/LogoMark";
import { Eye, EyeOff, ArrowRight, AlertCircle, Lock } from "lucide-react";

export default function Login() {
  const { login, user, dashboardPath, loading, usingTestAccounts } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Already logged in — redirect to correct dashboard
  useEffect(() => {
    if (!loading && user) navigate(dashboardPath);
  }, [user, loading, dashboardPath, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.ok) {
      // dashboardPath will update via context, useEffect will redirect
    } else {
      setError(result.error || "Login failed.");
    }
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem", fontSize: "0.9375rem",
    border: "1px solid #dcd6ce", borderRadius: "0.75rem",
    backgroundColor: "#fafafa", color: "#1d1d1f", outline: "none",
    transition: "border-color .15s",
  };

  if (loading) return null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#faf9f7", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ height: 64, borderBottom: "1px solid #dcd6ce", display: "flex", alignItems: "center", padding: "0 2rem", backgroundColor: "rgba(250,249,247,0.97)" }}>
        <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <LogoMark size={28} />
          <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#1a1a2e", letterSpacing: "-0.02em" }}>
            <span style={{ color: "#00c6e0" }}>U</span>nkov
          </span>
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
                Pilot and production customers
              </p>
              {usingTestAccounts && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", marginTop: "0.625rem", padding: "0.25rem 0.75rem", backgroundColor: "#fef3c7", border: "1px solid #fde68a", borderRadius: 9999, fontSize: "0.75rem", fontWeight: 600, color: "#92400e" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#f59e0b", display: "inline-block" }} />
                  Test mode — using local accounts
                </div>
              )}
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
                  <button type="button" onClick={() => {}} style={{ fontSize: "0.8125rem", color: "#0061d4", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
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
                    {showPw
                      ? <EyeOff style={{ width: 16, height: 16 }} />
                      : <Eye    style={{ width: 16, height: 16 }} />}
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
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.8125rem", backgroundColor: submitting || !email || !password ? "#9ca3af" : "#0061d4", color: "#fff", fontWeight: 700, fontSize: "1rem", borderRadius: "0.75rem", border: "none", cursor: submitting || !email || !password ? "not-allowed" : "pointer", transition: "background .15s", marginTop: "0.5rem" }}
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
                <button onClick={() => navigate("/signup")} style={{ color: "#0061d4", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                  Create account →
                </button>
              </p>
            </div>
          </div>

          {/* Test credentials hint — only shown in local dev when Supabase is not configured */}
          {usingTestAccounts && (() => {
            const pilotEmail = import.meta.env.VITE_DEV_PILOT_EMAIL as string;
            const pilotPass  = import.meta.env.VITE_DEV_PILOT_PASS  as string;
            const adminEmail = import.meta.env.VITE_DEV_ADMIN_EMAIL as string;
            const adminPass  = import.meta.env.VITE_DEV_ADMIN_PASS  as string;
            if (!pilotEmail || !adminEmail) return (
              <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", backgroundColor: "#f8f7f4", border: "1px solid #dcd6ce", borderRadius: 12 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Local dev mode</div>
                <p style={{ fontSize: "0.8125rem", color: "#6b7280", lineHeight: 1.6 }}>
                  Supabase is not configured. Set <code style={{ fontSize: "0.75rem", backgroundColor: "#f0ece6", padding: "1px 4px", borderRadius: 4 }}>VITE_DEV_PILOT_EMAIL</code> and <code style={{ fontSize: "0.75rem", backgroundColor: "#f0ece6", padding: "1px 4px", borderRadius: 4 }}>VITE_DEV_PILOT_PASS</code> in your <code style={{ fontSize: "0.75rem", backgroundColor: "#f0ece6", padding: "1px 4px", borderRadius: 4 }}>.env</code> to enable local login.
                </p>
              </div>
            );
            const accounts = [
              { label: "Pilot customer", email: pilotEmail, pw: pilotPass, badge: "Demo dashboard", bc: "#fef3c7", tc: "#92400e" },
              { label: "Admin", email: adminEmail, pw: adminPass, badge: "Admin access", bc: "#e0f2fe", tc: "#0369a1" },
            ];
            return (
              <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", backgroundColor: "#f8f7f4", border: "1px solid #dcd6ce", borderRadius: 12 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.625rem" }}>Local dev accounts</div>
                {accounts.map(a => (
                  <button key={a.email} type="button"
                    onClick={() => { setEmail(a.email); setPassword(a.pw); setError(""); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0.625rem", borderRadius: 8, border: "none", backgroundColor: "transparent", cursor: "pointer", textAlign: "left", marginBottom: "0.25rem", transition: "background .12s" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#ebe8e2")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#374151" }}>{a.label}</div>
                      <div style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{a.email}</div>
                    </div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 9999, backgroundColor: a.bc, color: a.tc, whiteSpace: "nowrap" }}>{a.badge}</span>
                  </button>
                ))}
                <p style={{ fontSize: "0.72rem", color: "#d1d5db", marginTop: "0.375rem" }}>Click to auto-fill · credentials from your .env file</p>
              </div>
            );
          })()}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
