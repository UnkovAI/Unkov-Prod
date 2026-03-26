import { Network, Brain, Shield } from "lucide-react";

export default function Solution() {
  const modules = [
    {
      icon: Network,
      number: "01",
      title: "Discover",
      subtitle: "Identity Gate",
      description: "Maps the multi-dimensional relationships between humans, bots, and resources in real-time using proprietary graph engine.",
      features: ["Real-time relationship mapping", "Lateral movement detection", "Hidden bridge discovery"]
    },
    {
      icon: Brain,
      number: "02",
      title: "Analyze",
      subtitle: "Intent Engine",
      description: "Predicts access needs by analyzing functional peer-clones and organizational context with machine learning.",
      features: ["Peer-Clone provisioning", "< 10 min onboarding", "Behavioral scoring"]
    },
    {
      icon: Shield,
      number: "03",
      title: "Remediate",
      subtitle: "Self-Healing Fabric",
      description: "Automatically purges orphaned accounts and kills toxic bot-links the moment risk is detected.",
      features: ["Usage-based rightsizing", "Hard kill-switch for bots", "Continuous verification"]
    }
  ];

  return (
    <section className="py-24 bg-[#0B0F19] border-t border-[rgba(56,189,248,0.1)]">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <div className="tech-label">THE SOLUTION</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Moving from Digital Filing Cabinets to Predictive Intelligence
          </h2>
          <p className="text-lg text-[#cbd5e1] max-w-2xl mx-auto">
            Unkov is the first identity orchestrator purpose-built for the agentic era. A self-healing "Social Fabric" that continuously discovers, decides, and remediates identity risks.
          </p>
        </div>

        {/* Three-module flow */}
        <div className="grid md:grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {modules.map((module, idx) => {
            const Icon = module.icon;
            return (
              <div key={idx} className="relative">
                {/* Connection line */}
                {idx < modules.length - 1 && (
                  <div className="hidden md:block absolute top-24 -right-4 w-8 h-1 bg-gradient-to-r from-[#38BDF8] to-transparent"></div>
                )}

                <div className="tech-card p-8 h-full border-[rgba(56,189,248,0.2)] hover:border-[rgba(56,189,248,0.4)] transition-all duration-300">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="text-4xl font-bold text-[#38BDF8] opacity-30">{module.number}</div>
                    <div className="p-3 bg-[rgba(56,189,248,0.1)] rounded-lg">
                      <Icon className="w-6 h-6 text-[#38BDF8]" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-1">{module.title}</h3>
                  <div className="text-xs text-[#94A3B8] uppercase tracking-wide mb-4">{module.subtitle}</div>
                  <p className="text-sm text-[#cbd5e1] mb-6">{module.description}</p>

                  <ul className="space-y-2">
                    {module.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-start gap-2 text-sm text-[#cbd5e1]">
                        <span className="text-[#38BDF8] mt-1">→</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Key benefit */}
        <div className="tech-card p-8 border-[rgba(56,189,248,0.3)] bg-[rgba(56,189,248,0.05)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#38BDF8] flex items-center justify-center flex-shrink-0">
              <span className="text-[#0B0F19] font-bold text-lg">⚡</span>
            </div>
            <div>
              <div className="font-mono text-sm text-[#38BDF8] uppercase tracking-widest">ZERO-TOUCH DEPLOYMENT</div>
              <p className="text-white font-semibold mt-1">Live "Identity Drift" dashboard generated in under 30 minutes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
