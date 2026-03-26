import { useState } from "react";
import { Mail, Download, FileText, BookOpen } from "lucide-react";
import { Presentation } from "lucide-react";

export default function InvestorsSection() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", company: "", message: "" });
  };
  const resources = [
    { icon: FileText, title: "Business Plan", desc: "Comprehensive 5-year financial model and strategic roadmap", fmt: "PDF" },
    { icon: Presentation, title: "Pitch Deck", desc: "15-slide investor presentation with market analysis", fmt: "PPTX" },
    { icon: BookOpen, title: "One-Pager", desc: "Executive summary for quick investor distribution", fmt: "PDF" },
  ];
  return (
    <section id="investors" className="section" style={{ backgroundColor: "#faf9f7" }}>
      <div className="container mx-auto px-10">
        <div className="max-w-2xl mb-14">
          <span className="section-label">For Investors</span>
          <h2 className="section-heading mb-4">Seed Round — Now Raising</h2>
          <p className="section-sub">Post-Money SAFE structure. Detailed terms and financial model available on request.</p>
        </div>
        <div className="grid md:grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {resources.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className="card p-6 flex flex-col" style={{ borderColor: "#dcd6ce" }}>
                <div className="p-2.5 rounded-lg w-fit mb-4" style={{ backgroundColor: "#edf1ff" }}>
                  <Icon className="w-4 h-4" style={{ color: "#00297a" }} />
                </div>
                <div className="text-sm font-semibold mb-1" style={{ color: "#1a1a2e" }}>{r.title}</div>
                <p className="text-xs flex-1 mb-4" style={{ color: "#4a5568" }}>{r.desc}</p>
                <button className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#00297a" }}>
                  <Download className="w-3.5 h-3.5" /> Download {r.fmt}
                </button>
              </div>
            );
          })}
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-8" style={{ borderColor: "#dcd6ce" }}>
            <h3 className="text-base font-semibold mb-6" style={{ color: "#1a1a2e" }}>Get in Touch</h3>
            {submitted ? (
              <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac", borderRadius: "0.875rem", padding: "2rem", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#065f46", marginBottom: "0.375rem" }}>Message sent!</div>
                <p style={{ fontSize: "0.875rem", color: "#047857", marginBottom: "1.25rem" }}>We'll get back to you within one business day.</p>
                <button onClick={() => setSubmitted(false)} style={{ fontSize: "0.875rem", fontWeight: 600, color: "#059669", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Send another message</button>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[{ k: "name", l: "Name", p: "Your name", t: "text" }, { k: "email", l: "Email", p: "your@email.com", t: "email" }, { k: "company", l: "Company", p: "Your company", t: "text" }].map(f => (
                <div key={f.k}>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#3d4759" }}>{f.l}</label>
                  <input type={f.t} placeholder={f.p} value={(form as any)[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2" style={{ border: "1px solid #dcd6ce", backgroundColor: "#faf9f7", color: "#1a1a2e" }} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "#3d4759" }}>Message</label>
                <textarea rows={3} placeholder="Tell us about your interest..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required
                  className="w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 resize-none" style={{ border: "1px solid #dcd6ce", backgroundColor: "#faf9f7", color: "#1a1a2e" }} />
              </div>
              <button type="submit" className="btn-primary w-full justify-center py-2.5">
                <Mail className="w-4 h-4" /> Send Inquiry
              </button>
            </form>
            )}
          </div>
          <div className="space-y-5">
            <div className="card p-6" style={{ borderColor: "#dcd6ce" }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#4a5568" }}>Funding Terms</div>
              <div className="space-y-3">
                {[["Round", "Seed — Post-Money SAFE"], ["Target Raise", "Available on request"], ["Post-Money Valuation", "Available on request"], ["Equity Dilution", "Available on request"], ["Cash Runway", "Available on request"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span style={{ color: "#3d4759" }}>{k}</span>
                    <span className="font-semibold" style={{ color: "#1a1a2e" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-6" style={{ borderColor: "#dcd6ce" }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#4a5568" }}>Due Diligence Ready</div>
              <div className="space-y-2">
                {["Financial: 3-year forecast & Cap Table", "Technical: Architecture & data provenance", "Legal: Formation docs & IP assignments"].map(item => (
                  <div key={item} className="flex items-start gap-2 text-sm" style={{ color: "#3d3d5c" }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: "#00297a" }} />{item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
