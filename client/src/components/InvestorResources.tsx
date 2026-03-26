import { Download, Mail, FileText, BookOpen } from "lucide-react";
import { useState } from "react";
import { Presentation } from "lucide-react";

export default function InvestorResources() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", company: "", message: "" });
  };

  const resources = [
    { icon: FileText, title: "Business Plan", desc: "Comprehensive 5-year financial model and strategic roadmap", fmt: "PDF", size: "2.4 MB", href: "/unkov_business_plan_final.pdf" },
    { icon: Presentation, title: "Investor Pitch Deck", desc: "15-slide investor presentation with market analysis", fmt: "PPTX", size: "8.7 MB", href: "/pitch-deck" },
    { icon: BookOpen, title: "One-Pager", desc: "Executive summary for quick investor distribution", fmt: "PDF", size: "1.2 MB", href: "/unkov_investor_one_pager.pdf" },
  ];

  return (
    <section className="section bg-[#f6f8fa] border-y border-[#d8dde6]">
      <div className="container mx-auto px-10">
        <div className="max-w-xl mb-12">
          <span className="section-label">Resources</span>
          <h2 className="text-2xl font-bold text-[#1d1d1f] mb-2">Investor Materials</h2>
          <p className="text-sm text-[#6b7280]">Full due diligence package available. All documents ready for deep-dive review.</p>
        </div>

        <div className="grid md:grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {resources.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className="card p-6">
                <div className="p-2.5 bg-[#e8f0fe] rounded-lg w-fit mb-4">
                  <Icon className="w-4 h-4 text-[#00297a]" />
                </div>
                <div className="text-sm font-semibold text-[#1d1d1f] mb-1">{r.title}</div>
                <p className="text-xs text-[#6b7280] mb-4">{r.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-[#d8dde6]">
                  <span className="text-xs text-[#6b7280]">{r.fmt} · {r.size}</span>
                  {r.href ? (
                    <a href={r.href} download className="p-1.5 text-[#00297a] hover:bg-[#e8f0fe] rounded-md transition-colors">
                      <Download className="w-4 h-4" />
                    </a>
                  ) : (
                    <button className="p-1.5 text-[#6b7280] rounded-md cursor-not-allowed opacity-50" disabled title="Coming soon">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-8">
            <h3 className="text-base font-semibold text-[#1d1d1f] mb-6">Get in Touch</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[{ k: "name", l: "Name", p: "Your name" }, { k: "email", l: "Email", p: "your@email.com" }, { k: "company", l: "Company", p: "Your company" }].map(f => (
                <div key={f.k}>
                  <label className="block text-xs font-medium text-[#6b7280] mb-1">{f.l}</label>
                  <input type={f.k === "email" ? "email" : "text"} placeholder={f.p} value={(form as any)[f.k]}
                    onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} required={f.k !== "company"}
                    className="w-full px-3 py-2 text-sm border border-[#d8dde6] rounded-lg bg-[#ffffff] text-[#1d1d1f] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0061d4] transition-shadow" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-[#6b7280] mb-1">Message</label>
                <textarea rows={3} placeholder="Tell us about your interest..." value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required
                  className="w-full px-3 py-2 text-sm border border-[#d8dde6] rounded-lg bg-[#ffffff] text-[#1d1d1f] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0061d4] resize-none transition-shadow" />
              </div>
              <button type="submit" className="btn-primary w-full justify-center py-2.5">
                <Mail className="w-4 h-4" /> Send Inquiry
              </button>
            </form>
          </div>

          <div className="space-y-5">
            <div className="card p-6">
              <div className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-4">Direct Contact</div>
              <div className="space-y-3">
                {[["Email", "info@unkov.com", "mailto:info@unkov.com"], ["Website", "unkov.com", "https://unkov.com"]].map(([l, v, h]) => (
                  <div key={l}>
                    <div className="text-xs text-[#6b7280] mb-0.5">{l}</div>
                    <a href={h} className="text-sm font-medium text-[#00297a] hover:underline">{v}</a>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-6">
              <div className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-4">Due Diligence Ready</div>
              <div className="space-y-2">
                {["Financial: 3-year forecast & Cap Table", "Technical: Architecture & data provenance", "Legal: Formation docs & IP assignments"].map(item => (
                  <div key={item} className="flex items-start gap-2 text-sm text-[#3d4759]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00297a] mt-1.5 shrink-0" />{item}
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
