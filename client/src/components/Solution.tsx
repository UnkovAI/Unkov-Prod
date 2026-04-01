import { Network, Brain, Shield, Activity } from "lucide-react";

export default function Solution() {
  const modules = [
    {
      icon: Network,
      number: "01",
      title: "Discover",
      subtitle: "Identity Graph",
      description: "Maps every identity — human, service account, API key, and AI agent — across all 20 connected systems. Relationships become edges in a live Neptune graph. Path queries reveal which AI agents can reach PHI, who shares credentials, and what was touched by a compromised account.",
      features: ["20 connectors — Okta, AWS, Entra, GitHub + 16 more", "Neptune graph: nodes, edges, relationship paths", "Real-time cross-system email + group deduplication"],
    },
    {
      icon: Brain,
      number: "02",
      title: "Analyze",
      subtitle: "Risk Engine",
      description: "Every identity receives a weighted risk score recomputed continuously as events arrive. Behavior, permission scope, and graph proximity each contribute to the composite score. Claude-powered agents explain findings in natural language and detect behavioral anomalies rules can't catch.",
      features: ["risk = behavior×0.4 + permission×0.3 + graph×0.3", "Real-time score updates on every login, key change, or API call", "3 Claude agents: risk explainer, anomaly detector, CISO summary"],
    },
    {
      icon: Shield,
      number: "03",
      title: "Enforce",
      subtitle: "The Gate",
      description: "Every AI tool call routes through the AI Proxy before reaching OpenAI or Anthropic. Every login passes through the Okta inline hook. Every API call passes through the Lambda authorizer. Each gate returns ALLOW, REVIEW, or BLOCK — in real time, in the execution path.",
      features: ["AI Proxy: POST /ai-proxy/openai/* — identity check before every LLM call", "Okta inline hook: login intercepted before token issued", "AWS Lambda authorizer: API call blocked if risk > 80"],
    },
    {
      icon: Activity,
      number: "04",
      title: "Monitor",
      subtitle: "Audit & Compliance",
      description: "Every gate decision, every AI proxy call, every approved action is logged to an immutable audit trail. Compliance exports map findings directly to PCI DSS, HIPAA, and SOC 2 controls. When regulators ask, your team hits Export — not scramble.",
      features: ["Immutable audit log — every gate decision recorded", "One-click compliance export: PCI DSS 4.0, HIPAA, SOC 2", "Dashboard shows recommendations queue, AI analysis, gate status"],
    },
  ];

  return (
    <section className="py-24 bg-[#0B0F19] border-t border-[rgba(56,189,248,0.1)]">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <div className="tech-label">THE SOLUTION</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            A real-time decision engine in the identity path
          </h2>
          <p className="text-lg text-[#cbd5e1] max-w-2xl mx-auto">
            Not monitoring. Not a dashboard. Unkov sits between your identities and your systems — every request evaluated, scored, and decided before it executes.
          </p>
        </div>

        {/* Four-module flow */}
        <div className="grid md:grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {modules.map((module, idx) => {
            const Icon = module.icon;
            return (
              <div key={idx} className="relative">
                {idx < modules.length - 1 && (
                  <div className="hidden md:block absolute top-24 -right-3 w-6 h-1 bg-gradient-to-r from-[#38BDF8] to-transparent z-10"></div>
                )}
                <div className="tech-card p-6 h-full border-[rgba(56,189,248,0.2)] hover:border-[rgba(56,189,248,0.4)] transition-all duration-300">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-3xl font-bold text-[#38BDF8] opacity-30">{module.number}</div>
                    <div className="p-2 bg-[rgba(56,189,248,0.1)] rounded-lg">
                      <Icon className="w-5 h-5 text-[#38BDF8]" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{module.title}</h3>
                  <div className="text-xs font-semibold text-[#38BDF8] uppercase tracking-wider mb-3 opacity-70">{module.subtitle}</div>
                  <p className="text-sm text-[#94a3b8] leading-relaxed mb-4">{module.description}</p>
                  <ul className="space-y-1">
                    {module.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-xs text-[#64748b]">
                        <span className="text-[#38BDF8] mt-0.5 shrink-0">›</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stack summary */}
        <div className="tech-card p-6 border-[rgba(56,189,248,0.15)]">
          <div className="text-xs font-semibold text-[#38BDF8] uppercase tracking-widest mb-3 opacity-60">Full Stack</div>
          <div className="flex flex-wrap gap-2">
            {["Connectors → Graph", "Graph → Real-time events", "Events → Risk score", "Risk → Policy decision", "Policy → Gate enforcement", "Gate → Audit trail"].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-[#94a3b8] bg-[rgba(56,189,248,0.08)] px-3 py-1 rounded-full border border-[rgba(56,189,248,0.15)]">{step}</span>
                {i < 5 && <span className="text-[#38BDF8] opacity-40 text-sm">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
