import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";
import { LogoMark } from "../components/LogoMark";

const SESSION_KEY = "unkov_investor_auth";

/**
 * InvestorGate — server-validated access codes.
 *
 * No hash function. No salt. No validation logic.
 * The browser only ever sends the code the investor typed
 * to /api/validate-investor-code and receives {"valid": true/false}.
 *
 * The entire validation happens in api/validate-investor-code.ts,
 * which reads INVESTOR_SALT from Vercel's server environment —
 * a variable that never reaches the browser under any circumstances.
 */
export default function InvestorGate() {
  const [code, setCode]         = useState("");
  const [showCode, setShowCode] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [shaking, setShaking]   = useState(false);
  const [, navigate]            = useLocation();
  const inputRef                = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/validate-investor-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (res.status === 429) {
        // Rate limited
        setError(data.error || "Too many attempts. Please wait and try again.");
        setShaking(true);
        setTimeout(() => setShaking(false), 600);
        setCode("");
        return;
      }

      if (!res.ok) {
        setError("Something went wrong. Please try again or email info@unkov.com.");
        return;
      }

      if (data.valid) {
        sessionStorage.setItem(SESSION_KEY, "true");
        const redirect = sessionStorage.getItem("unkov_post_auth_redirect") || "/for-investors";
        sessionStorage.removeItem("unkov_post_auth_redirect");
        navigate(redirect);
      } else {
        setError("Incorrect access code. Request access via info@unkov.com.");
        setShaking(true);
        setTimeout(() => setShaking(false), 600);
        setCode("");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0f1e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ position: "fixed", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, background: "radial-gradient(ellipse,rgba(0,41,122,0.18) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <LogoMark size={48} bgColor="#0a0f1e" />
        </div>
        <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em" }}>Unkov</div>
      </div>

      <div style={{ width: "100%", maxWidth: 420, backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "2.5rem", backdropFilter: "blur(12px)", animation: shaking ? "shake 0.5s ease" : "none" }}>
        <div style={{ width: 48, height: 48, backgroundColor: "rgba(0,97,212,0.12)", border: "1px solid rgba(0,97,212,0.25)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
          <Lock style={{ width: 20, height: 20, color: "#60a5fa" }} />
        </div>

        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "0.5rem" }}>Investor Access</h1>
        <p style={{ fontSize: "0.875rem", color: "#94a3b8", marginBottom: "2rem", lineHeight: 1.7 }}>
          This area contains confidential investor materials including financial projections, funding terms, and the data room. Enter your access code to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
            Access Code
          </label>
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <input
              ref={inputRef}
              type={showCode ? "text" : "password"}
              value={code}
              onChange={e => { setCode(e.target.value); setError(""); }}
              placeholder="e.g. UNK-ABC123"
              autoComplete="off"
              spellCheck={false}
              disabled={loading}
              style={{ width: "100%", padding: "0.75rem 3rem 0.75rem 1rem", backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${error ? "#ef4444" : "rgba(255,255,255,0.1)"}`, borderRadius: 10, color: "#f1f5f9", fontSize: "0.95rem", outline: "none", letterSpacing: "0.1em", boxSizing: "border-box" as const, opacity: loading ? 0.6 : 1 }}
            />
            <button
              type="button"
              onClick={() => setShowCode(s => !s)}
              style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: "0.25rem" }}
            >
              {showCode ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
            </button>
          </div>

          {error && (
            <p style={{ fontSize: "0.875rem", color: "#ef4444", marginBottom: "1rem", marginTop: "-0.5rem" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !code.trim()}
            style={{ width: "100%", padding: "0.875rem", backgroundColor: loading || !code.trim() ? "#334155" : "#0061d4", border: "none", borderRadius: 10, color: loading || !code.trim() ? "#64748b" : "#fff", fontWeight: 700, fontSize: "0.95rem", cursor: loading || !code.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "background .15s" }}
            onMouseEnter={e => { if (!loading && code.trim()) (e.currentTarget as HTMLElement).style.backgroundColor = "#0052b3"; }}
            onMouseLeave={e => { if (!loading && code.trim()) (e.currentTarget as HTMLElement).style.backgroundColor = "#0061d4"; }}
          >
            {loading ? (
              <>
                <span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#94a3b8", borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" }} />
                Verifying…
              </>
            ) : (
              <>Access Investor Materials <ArrowRight style={{ width: 16, height: 16 }} /></>
            )}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.75rem 0 1.5rem" }}>
          <div style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />
          <span style={{ fontSize: "0.875rem", color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>No code?</span>
          <div style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />
        </div>

        <a
          href="mailto:info@unkov.com?subject=Investor Access Request"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", padding: "0.75rem", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#94a3b8", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none", boxSizing: "border-box" as const }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "#e2e8f0"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}
        >
          Request access — info@unkov.com
        </a>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "2rem", fontSize: "0.875rem", color: "#64748b" }}>
        <Shield style={{ width: 12, height: 12 }} />
        Confidential materials. Not for distribution. © Unkov 2026
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          15%{transform:translateX(-8px)} 30%{transform:translateX(8px)}
          45%{transform:translateX(-6px)} 60%{transform:translateX(6px)}
          75%{transform:translateX(-3px)} 90%{transform:translateX(3px)}
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
