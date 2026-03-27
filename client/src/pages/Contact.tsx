import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Mail, Linkedin } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", company: "", email: "", topic: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Unkov inquiry: ${form.topic || "General"} — ${form.company}`);
    const body = encodeURIComponent(`Name: ${form.name}\nCompany: ${form.company}\nEmail: ${form.email}\nTopic: ${form.topic}\n\n${form.message}`);
    window.open(`mailto:info@unkov.com?subject=${subject}&body=${body}`, "_blank");
    setSent(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf9f7" }}>
      <Header />
      <div style={{ paddingTop: 60 }}>

        {/* Hero */}
        <section style={{ borderBottom: "1px solid #e5e7eb", padding: "clamp(2rem,5vw,5rem) 0 clamp(1.5rem,4vw,4rem)", backgroundColor: "#ffffff" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "860px" }}>
            <span className="section-label" style={{ marginBottom: "1.25rem", display: "inline-block" }}>Contact</span>
            <h1 style={{ fontSize: "clamp(2.25rem,5vw,3rem)", fontWeight: 600, color: "#111827", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: "1rem" }}>
              Get in touch.
            </h1>
            <p style={{ fontSize: "1.125rem", color: "#6b7280", lineHeight: 1.75, maxWidth: "36rem" }}>
              Whether you're evaluating Unkov for your BFSI or healthcare environment, want to start a pilot, or just have questions — we respond within one business day.
            </p>
          </div>
        </section>

        {/* Form + details */}
        <section style={{ padding: "clamp(2.5rem,5vw,5rem) 0" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "860px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(2rem,4vw,4rem)" }}>

              {/* Form */}
              <div>
                {sent ? (
                  <div style={{ padding: "2rem", backgroundColor: "#f0fdf4", border: "1px solid #6ee7b7", borderRadius: "1rem", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>✓</div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "#065f46", marginBottom: "0.5rem" }}>Message received</div>
                    <p style={{ fontSize: "0.875rem", color: "#4a5568" }}>We'll be in touch within one business day.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {[
                      { label: "Your name", key: "name", type: "text", placeholder: "Mustafa Albassam" },
                      { label: "Company", key: "company", type: "text", placeholder: "Acme Bank" },
                      { label: "Work email", key: "email", type: "email", placeholder: "you@company.com" },
                    ].map(({ label, key, type, placeholder }) => (
                      <div key={key}>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.375rem" }}>{label}</label>
                        <input
                          type={type}
                          value={form[key as keyof typeof form]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          placeholder={placeholder}
                          required
                          style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #d1d5db", borderRadius: "0.625rem", fontSize: "0.9375rem", color: "#111827", outline: "none", boxSizing: "border-box", backgroundColor: "#ffffff" }}
                        />
                      </div>
                    ))}

                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.375rem" }}>What are you reaching out about?</label>
                      <select
                        value={form.topic}
                        onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                        required
                        style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #d1d5db", borderRadius: "0.625rem", fontSize: "0.9375rem", color: form.topic ? "#111827" : "#9ca3af", outline: "none", backgroundColor: "#ffffff", boxSizing: "border-box" }}
                      >
                        <option value="">Select a topic</option>
                        <option>Design partner / pilot</option>
                        <option>Product question</option>
                        <option>Investor inquiry</option>
                        <option>Partnership</option>
                        <option>Press / media</option>
                        <option>Something else</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.375rem" }}>Message</label>
                      <textarea
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Tell us about your environment or what you're trying to solve..."
                        rows={4}
                        style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #d1d5db", borderRadius: "0.625rem", fontSize: "0.9375rem", color: "#111827", outline: "none", resize: "vertical", boxSizing: "border-box", backgroundColor: "#ffffff" }}
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                      Send message <ArrowRight style={{ width: 16, height: 16 }} />
                    </button>
                  </form>
                )}
              </div>

              {/* Contact details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", paddingTop: "0.5rem" }}>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#111827", marginBottom: "0.75rem" }}>Direct contact</div>
                  <a href="mailto:info@unkov.com" style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9375rem", color: "#0061d4", textDecoration: "none", fontWeight: 500 }}>
                    <Mail style={{ width: 16, height: 16 }} /> info@unkov.com
                  </a>
                </div>

                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#111827", marginBottom: "0.75rem" }}>Follow us</div>
                  <a href="https://linkedin.com/company/unkov" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9375rem", color: "#0061d4", textDecoration: "none", fontWeight: 500 }}>
                    <Linkedin style={{ width: 16, height: 16 }} /> LinkedIn
                  </a>
                </div>

                <div style={{ backgroundColor: "#f0ece6", borderRadius: "1rem", padding: "1.5rem", border: "1px solid #dcd6ce" }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>Design partner program</div>
                  <p style={{ fontSize: "0.875rem", color: "#4a5568", lineHeight: 1.7, marginBottom: "1rem" }}>
                    We're currently onboarding BFSI and healthcare organizations as pilot customers. 30-minute deployment, your real environment, defined success metrics from day one.
                  </p>
                  <a href="/early-access" style={{ fontSize: "0.875rem", fontWeight: 600, color: "#00297a", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                    Apply for pilot <ArrowRight style={{ width: 13, height: 13 }} />
                  </a>
                </div>

                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#111827", marginBottom: "0.375rem" }}>Response time</div>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>We respond to all inquiries within one business day.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
