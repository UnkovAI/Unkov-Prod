import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { LogoMark } from "@/components/LogoMark";
import Footer from "@/components/Footer";
import {
  Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle,
  Mail, Lock, User, Building2, Loader2, AlertTriangle
} from "lucide-react";

// ── Shared input style ─────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: "100%", padding: "0.75rem 1rem 0.75rem 2.625rem",
  fontSize: "0.9375rem", border: "1px solid #dcd6ce",
  borderRadius: "0.75rem", backgroundColor: "#fafafa",
  color: "#1d1d1f", outline: "none", transition: "border-color .15s",
  boxSizing: "border-box",
};

// ── Password strength ─────────────────────────────────────────────
function pwStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Weak",   color: "#dc2626" };
  if (score <= 2) return { score, label: "Fair",   color: "#d97706" };
  if (score <= 3) return { score, label: "Good",   color: "#0061d4" };
  return               { score, label: "Strong", color: "#059669" };
}

export default function SignUp() {
  const [, navigate] = useLocation();

  const [name,     setName]     = useState("");
  const [company,  setCompany]  = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [showCon,  setShowCon]  = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState(false);

  // Redirect to login if Supabase isn't configured
  // No redirect needed — if Supabase is not configured the submit handler
  // will show an inline error rather than silently bouncing the user away.

  const strength = pwStrength(password);
  const pwMatch  = confirm.length > 0 && password === confirm;
  const pwNoMatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!name.trim())    return setError("Please enter your full name.");
    if (!company.trim()) return setError("Please enter your company name.");
    if (!email.trim())   return setError("Please enter your email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (strength.score < 2)  return setError("Please choose a stronger password.");

    if (!supabase) return setError("Authentication service unavailable. Please try again later.");

    setSubmitting(true);

    try {
      // Step 1: Create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          // Pass metadata so the DB trigger can use it
          data: {
            name:    name.trim(),
            company: company.trim(),
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("An account with this email already exists. Try logging in instead.");
        } else {
          setError(signUpError.message);
        }
        setSubmitting(false);
        return;
      }

      // Step 2: If user was created, upsert their profile row in public.profiles
      // (The DB trigger handles this automatically, but we upsert as a safety net
      // in case the trigger hasn't fired yet or metadata wasn't captured)
      if (data.user) {
        // The trigger `on_auth_user_created` will insert the row.
        // We do a soft upsert in case the trigger is not yet set up.
        await supabase.from("users").upsert({
          id:      data.user.id,
          email:   email.trim().toLowerCase(),
          name:    name.trim(),
          company: company.trim(),
          role:    "pilot_customer",
        }, { onConflict: "id" });
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ───────────────────────────────────────────────
  if (success) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#faf9f7", display: "flex", flexDirection: "column" }}>
        <TopBar onHome={() => navigate("/")} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
          <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#d1fae5", border: "1px solid #6ee7b7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <CheckCircle style={{ width: 28, height: 28, color: "#059669" }} />
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1d1d1f", marginBottom: "0.75rem", letterSpacing: "-0.025em" }}>
              Check your inbox
            </h1>
            <p style={{ fontSize: "0.9375rem", color: "#6b7280", lineHeight: 1.7, marginBottom: "2rem" }}>
              We sent a confirmation link to <strong style={{ color: "#1d1d1f" }}>{email}</strong>.
              Click the link to activate your account — it expires in 24 hours.
            </p>
            <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "0.875rem", padding: "1rem 1.25rem", marginBottom: "2rem", textAlign: "left" }}>
              <p style={{ fontSize: "0.8125rem", color: "#0369a1", lineHeight: 1.65, margin: 0 }}>
                <strong>What happens next:</strong> Once you confirm your email, your account is active and the Unkov team will reach out within one business day to schedule your onboarding call.
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.75rem", backgroundColor: "#00297a", color: "#fff", borderRadius: "9999px", border: "none", fontWeight: 600, fontSize: "0.9375rem", cursor: "pointer" }}
            >
              Go to login <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      <Footer />
    </div>
    );
  }

  // ── Sign-up form ─────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#faf9f7", display: "flex", flexDirection: "column" }}>
      <TopBar onHome={() => navigate("/")} />

      {/* Supabase not configured warning */}
      {!isSupabaseConfigured && (
        <div style={{ backgroundColor: "#fffbeb", borderBottom: "1px solid #fde68a", padding: "0.875rem 2rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
          <AlertTriangle style={{ width: 18, height: 18, color: "#d97706", flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#92400e", marginBottom: "0.25rem" }}>
              Authentication not configured — account creation will not work
            </div>
            <div style={{ fontSize: "0.8125rem", color: "#78350f", lineHeight: 1.6 }}>
              Add <code style={{ backgroundColor: "#fef3c7", padding: "1px 5px", borderRadius: 4 }}>VITE_SUPABASE_URL</code> and{" "}
              <code style={{ backgroundColor: "#fef3c7", padding: "1px 5px", borderRadius: 4 }}>VITE_SUPABASE_PUBLISHABLE_KEY</code> to Vercel project settings, then <strong>redeploy</strong>.
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "1.625rem", fontWeight: 700, color: "#1d1d1f", marginBottom: "0.5rem", letterSpacing: "-0.025em" }}>
              Create your account
            </h1>
            <p style={{ fontSize: "0.9375rem", color: "#6b7280", lineHeight: 1.6 }}>
              Join the Unkov pilot — see your AI agent footprint in 30 minutes.
            </p>
          </div>

          {/* Card */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #dcd6ce", borderRadius: "1.25rem", padding: "2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>

              {/* Full name */}
              <Field label="Full name" icon={<User style={{ width: 15, height: 15, color: "#9ca3af" }} />}>
                <input
                  type="text"
                  placeholder="Sarah Chen"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                  required
                  style={inp}
                />
              </Field>

              {/* Company */}
              <Field label="Company" icon={<Building2 style={{ width: 15, height: 15, color: "#9ca3af" }} />}>
                <input
                  type="text"
                  placeholder="Acme Financial Corp"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  autoComplete="organization"
                  required
                  style={inp}
                />
              </Field>

              {/* Email */}
              <Field label="Work email" icon={<Mail style={{ width: 15, height: 15, color: "#9ca3af" }} />}>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  style={inp}
                />
              </Field>

              {/* Password */}
              <Field
                label="Password"
                icon={<Lock style={{ width: 15, height: 15, color: "#9ca3af" }} />}
                trailing={
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex" }}>
                    {showPw ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                  </button>
                }
              >
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  style={{ ...inp, paddingRight: "2.625rem" }}
                />
              </Field>

              {/* Password strength bar */}
              {password.length > 0 && (
                <div style={{ marginTop: "-0.625rem" }}>
                  <div style={{ display: "flex", gap: 3, marginBottom: "0.25rem" }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 9999, backgroundColor: i <= strength.score ? strength.color : "#e5e7eb", transition: "background-color .2s" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: "0.75rem", color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                </div>
              )}

              {/* Confirm password */}
              <Field
                label="Confirm password"
                icon={<Lock style={{ width: 15, height: 15, color: "#9ca3af" }} />}
                trailing={
                  <button type="button" onClick={() => setShowCon(v => !v)}
                    style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex" }}>
                    {showCon ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                  </button>
                }
              >
                <input
                  type={showCon ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                  style={{
                    ...inp,
                    paddingRight: "2.625rem",
                    borderColor: pwNoMatch ? "#fca5a5" : pwMatch ? "#6ee7b7" : undefined,
                  }}
                />
              </Field>
              {pwNoMatch && (
                <p style={{ fontSize: "0.8125rem", color: "#dc2626", marginTop: "-0.625rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <AlertCircle style={{ width: 13, height: 13 }} /> Passwords do not match
                </p>
              )}

              {/* Error */}
              {error && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", backgroundColor: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "0.75rem", padding: "0.75rem 1rem" }}>
                  <AlertCircle style={{ width: 15, height: 15, color: "#dc2626", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: "0.875rem", color: "#dc2626", lineHeight: 1.5 }}>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  padding: "0.875rem", backgroundColor: submitting ? "#3d6099" : "#00297a",
                  color: "#fff", borderRadius: "0.875rem", border: "none",
                  fontWeight: 600, fontSize: "0.9375rem", cursor: submitting ? "default" : "pointer",
                  transition: "background-color .15s", marginTop: "0.25rem",
                }}
              >
                {submitting
                  ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Creating account…</>
                  : <>Create account <ArrowRight style={{ width: 16, height: 16 }} /></>}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.5rem 0" }}>
              <div style={{ flex: 1, height: 1, backgroundColor: "#e5e7eb" }} />
              <span style={{ fontSize: "0.8125rem", color: "#9ca3af" }}>Already have an account?</span>
              <div style={{ flex: 1, height: 1, backgroundColor: "#e5e7eb" }} />
            </div>

            <button
              onClick={() => navigate("/login")}
              style={{ width: "100%", padding: "0.75rem", border: "1.5px solid #dcd6ce", borderRadius: "0.875rem", backgroundColor: "transparent", color: "#374151", fontWeight: 600, fontSize: "0.9375rem", cursor: "pointer", transition: "border-color .15s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#9ca3af")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#dcd6ce")}
            >
              Sign in instead
            </button>
          </div>

          {/* Legal note */}
          <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#9ca3af", marginTop: "1.25rem", lineHeight: 1.6 }}>
            By creating an account you agree to Unkov's{" "}
            <a href="/legal" style={{ color: "#6b7280", textDecoration: "underline" }}>Terms of Service</a>
            {" "}and{" "}
            <a href="/legal" style={{ color: "#6b7280", textDecoration: "underline" }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────
function TopBar({ onHome }: { onHome: () => void }) {
  return (
    <div style={{ height: 64, borderBottom: "1px solid #dcd6ce", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", backgroundColor: "rgba(250,249,247,0.97)" }}>
      <button onClick={onHome} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
        <LogoMark size={34} />
        <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "#1a1a2e", letterSpacing: "-0.02em" }}>
          <span style={{ color: "#00c6e0" }}>U</span>nkov
        </span>
      </button>
      <button onClick={onHome}
        style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#6b7280", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.375rem" }}>
        ← Back to home
      </button>
    </div>
  );
}

function Field({ label, icon, trailing, children }: {
  label: string;
  icon: React.ReactNode;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#374151", marginBottom: "0.375rem" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>{icon}</div>
        {children}
        {trailing}
      </div>
    </div>
  );
}
