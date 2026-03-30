import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { LogoMark } from "@/components/LogoMark";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

export default function ResetPassword() {
  const [, navigate] = useLocation();
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");
  const [done, setDone]             = useState(false);
  const [ready, setReady]           = useState(false);

  useEffect(() => {
    if (!supabase) { setError("Auth service unavailable."); return; }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if ((event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") && session) {
          setReady(true);
        }
      }
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (!supabase) { setError("Auth service unavailable."); return; }
    setError(""); setSubmitting(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (err) { setError(err.message || "Failed to update password."); return; }
    await supabase.auth.signOut();
    setDone(true);
    setTimeout(() => navigate("/login"), 3000);
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem", fontSize: "0.9375rem",
    border: "1px solid #dcd6ce", borderRadius: "0.75rem",
    backgroundColor: "#fafafa", color: "#1d1d1f", outline: "none",
    transition: "border-color .15s",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#faf9f7", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 64, borderBottom: "1px solid #dcd6ce", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", backgroundColor: "rgba(250,249,247,0.97)" }}>
        <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <LogoMark size={34} />
          <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "#1a1a2e", letterSpacing: "-0.02em" }}>
            <span style={{ color: "#00c6e0" }}>U</span>nkov
          </span>
        </button>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ backgroundColor: "#fff", border: "1px solid #dcd6ce", borderRadius: 16, padding: "2.5rem 2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            {done ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <CheckCircle style={{ width: 24, height: 24, color: "#059669" }} />
                </div>
                <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#1d1d1f", marginBottom: "0.5rem" }}>Password updated</h1>
                <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>Redirecting you to sign in…</p>
              </div>
            ) : (
              <>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "#e8f0fe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                    <Lock style={{ width: 22, height: 22, color: "#0061d4" }} />
                  </div>
                  <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em", marginBottom: "0.375rem" }}>Set new password</h1>
                  <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>Choose a strong password for your account</p>
                </div>
                {!ready && !error && (
                  <p style={{ textAlign: "center", padding: "1rem", color: "#6b7280", fontSize: "0.875rem" }}>Verifying reset link…</p>
                )}
                {ready && (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.375rem" }}>New password</label>
                      <div style={{ position: "relative" }}>
                        <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" required minLength={8}
                          style={{ ...inp, paddingRight: "2.75rem" }}
                          onFocus={e => (e.currentTarget.style.borderColor = "#0061d4")} onBlur={e => (e.currentTarget.style.borderColor = "#dcd6ce")} />
                        <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}>
                          {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.375rem" }}>Confirm password</label>
                      <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat new password" required style={inp}
                        onFocus={e => (e.currentTarget.style.borderColor = "#0061d4")} onBlur={e => (e.currentTarget.style.borderColor = "#dcd6ce")} />
                    </div>
                    {error && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "0.75rem" }}>
                        <AlertCircle style={{ width: 15, height: 15, color: "#ef4444", flexShrink: 0 }} />
                        <span style={{ fontSize: "0.875rem", color: "#b91c1c" }}>{error}</span>
                      </div>
                    )}
                    <button type="submit" disabled={submitting || !password || !confirm}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.8125rem", backgroundColor: (submitting || !password || !confirm) ? "#9ca3af" : "#0061d4", color: "#fff", fontWeight: 700, fontSize: "1rem", borderRadius: "0.75rem", border: "none", cursor: (submitting || !password || !confirm) ? "not-allowed" : "pointer", transition: "background .15s", marginTop: "0.5rem" }}
                      onMouseEnter={e => { if (!submitting && password && confirm) (e.currentTarget as HTMLElement).style.backgroundColor = "#00297a"; }}
                      onMouseLeave={e => { if (!submitting && password && confirm) (e.currentTarget as HTMLElement).style.backgroundColor = "#0061d4"; }}>
                      {submitting ? (<><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" }} />Updating…</>) : (<>Update password <ArrowRight style={{ width: 16, height: 16 }} /></>)}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
