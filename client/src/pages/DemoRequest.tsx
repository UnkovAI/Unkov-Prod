import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Network, Brain, Zap, BarChart3, Shield, GitBranch, Landmark, Stethoscope, Bot, Building2, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

const DEMO_OPTIONS = [
  { id: "identity-graph",    icon: GitBranch,    label: "Identity Social Fabric",        desc: "Live graph of every human, bot, and AI agent in your environment" },
  { id: "intent-engine",     icon: Brain,        label: "Intent Engine & Provisioning",  desc: "ML-driven peer-clone provisioning and access prediction" },
  { id: "remediation",       icon: Zap,          label: "Autonomous Remediation",        desc: "Kill-Switch, orphan purge, toxic link revocation in action" },
  { id: "monitoring",        icon: BarChart3,     label: "Continuous Monitoring",         desc: "Real-time dashboards and compliance evidence collection" },
  { id: "compliance",        icon: Shield,        label: "Predictive Compliance",         desc: "PCI DSS 4.0, HIPAA, SOC 2 — automated evidence gathering" },
  { id: "attack-paths",      icon: Network,       label: "Attack Path Visualization",     desc: "See lateral movement risks before attackers exploit them" },
];

const USE_CASES = [
  { id: "bfsi",        icon: Landmark,      label: "Banking & Financial Services" },
  { id: "healthcare",  icon: Stethoscope,   label: "Healthcare & Life Sciences"   },
  { id: "ai-agents",   icon: Bot,           label: "AI Agent Governance"          },
  { id: "midmarket",   icon: Building2,     label: "Mid-Market IT Team"           },
];

const TEAM_SIZES = ["1–50", "51–200", "201–1,000", "1,001–5,000", "5,000+"];

export default function DemoRequest() {
  const [, navigate] = useLocation();
  const [selectedDemos, setSelectedDemos] = useState<string[]>([]);
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);
  const [teamSize, setTeamSize] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const toggleDemo = (id: string) =>
    setSelectedDemos(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.company) return;
    const body = [
      `Name: ${form.name}`,
      `Company: ${form.company}`,
      `Role: ${form.role || "Not specified"}`,
      `Team Size: ${teamSize || "Not specified"}`,
      `Use Case: ${selectedUseCase || "Not specified"}`,
      `Demo Areas: ${selectedDemos.join(", ") || "Not specified"}`,
      `Notes: ${form.notes || "None"}`,
    ].join("\n");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#faf9f7" }}>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "#d1fae5" }}>
            <CheckCircle className="w-8 h-8" style={{ color: "#059669" }} />
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{ color: "#1a1a2e" }}>Request Received!</h2>
          <p className="text-lg mb-8 max-w-md" style={{ color: "#4a5568" }}>Our team will reach out within one business day to confirm your personalized demo.</p>
          <button onClick={() => navigate("/")} className="btn-primary">Back to Home <ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf9f7" }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>
        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #00297a 0%, #0041a8 100%)", padding: "4rem 0 3.5rem" }}>
          <div className="container mx-auto max-w-3xl px-10 text-center">
            <span className="section-label" style={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.1)" }}>Request a Live Demo</span>
            <h1 className="text-4xl font-extrabold text-white mt-4 mb-3" style={{ letterSpacing: "-0.03em", lineHeight: 1.15 }}>
              See Unkov Built for<br />Your Environment
            </h1>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.8)", maxWidth: "32rem", margin: "0 auto", lineHeight: 1.7 }}>
              Tell us what matters most. We'll tailor a 30-minute walkthrough to your exact use case — no generic slides.
            </p>
          </div>
        </div>

        <div className="container mx-auto max-w-3xl px-10 py-16">

          {/* Step 1: Demo areas */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#00297a" }}>1</div>
              <h2 className="text-lg font-bold" style={{ color: "#1a1a2e" }}>What would you like us to demo? <span className="text-sm font-normal" style={{ color: "#6b7280" }}>(select all that apply)</span></h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {DEMO_OPTIONS.map(opt => {
                const Icon = opt.icon;
                const selected = selectedDemos.includes(opt.id);
                return (
                  <button key={opt.id} onClick={() => toggleDemo(opt.id)}
                    className="flex items-start gap-3 p-4 rounded-xl border text-left transition-all"
                    style={{ borderColor: selected ? "#00297a" : "#dcd6ce", backgroundColor: selected ? "#e8f0fe" : "#ffffff", boxShadow: selected ? "0 0 0 2px rgba(0,41,122,0.15)" : "none" }}>
                    <div className="p-2 rounded-lg shrink-0 mt-0.5" style={{ backgroundColor: selected ? "#00297a" : "#f0ece6" }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: selected ? "#ffffff" : "#3d4759" }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>{opt.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#4a5568" }}>{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Use case */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#00297a" }}>2</div>
              <h2 className="text-lg font-bold" style={{ color: "#1a1a2e" }}>What best describes your situation?</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {USE_CASES.map(uc => {
                const Icon = uc.icon;
                const selected = selectedUseCase === uc.id;
                return (
                  <button key={uc.id} onClick={() => setSelectedUseCase(uc.id)}
                    className="flex items-center gap-3 p-4 rounded-xl border text-left transition-all"
                    style={{ borderColor: selected ? "#00297a" : "#dcd6ce", backgroundColor: selected ? "#e8f0fe" : "#ffffff", boxShadow: selected ? "0 0 0 2px rgba(0,41,122,0.15)" : "none" }}>
                    <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: selected ? "#00297a" : "#f0ece6" }}>
                      <Icon className="w-4 h-4" style={{ color: selected ? "#ffffff" : "#3d4759" }} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>{uc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Team size */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#00297a" }}>3</div>
              <h2 className="text-lg font-bold" style={{ color: "#1a1a2e" }}>How large is your organization?</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {TEAM_SIZES.map(size => (
                <button key={size} onClick={() => setTeamSize(size)}
                  className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
                  style={{ borderColor: teamSize === size ? "#00297a" : "#dcd6ce", backgroundColor: teamSize === size ? "#00297a" : "#ffffff", color: teamSize === size ? "#ffffff" : "#3d4759" }}>
                  {size} employees
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Contact */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#00297a" }}>4</div>
              <h2 className="text-lg font-bold" style={{ color: "#1a1a2e" }}>Your contact details</h2>
            </div>
            <div className="card p-8" style={{ borderColor: "#dcd6ce" }}>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {[
                  { key: "name",    label: "Full Name *",    placeholder: "Jane Smith",       type: "text"  },
                  { key: "email",   label: "Work Email *",   placeholder: "jane@company.com", type: "email" },
                  { key: "company", label: "Company *",      placeholder: "Acme Corp",        type: "text"  },
                  { key: "role",    label: "Your Role",      placeholder: "Head of IT",       type: "text"  },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3d4759" }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder}
                      value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ border: "1px solid #dcd6ce", backgroundColor: "#faf9f7", color: "#1a1a2e" }} />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3d4759" }}>Anything specific you'd like us to prepare?</label>
                <textarea rows={3} placeholder="E.g. we have 5,000 service accounts and need to show compliance for PCI DSS 4.0 audit next quarter..."
                  value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  style={{ border: "1px solid #dcd6ce", backgroundColor: "#faf9f7", color: "#1a1a2e" }} />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button onClick={handleSubmit}
              disabled={!form.name || !form.email || !form.company}
              className="btn-primary px-10 py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              Request My Personalized Demo <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-xs mt-3" style={{ color: "#6b7280" }}>Our team responds within one business day. No spam, ever.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
