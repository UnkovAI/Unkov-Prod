export default function WhyNowTimeline() {
  const events = [
    { period: "2024", title: "PCI DSS 4.0 Enforcement",  desc: "Automated access controls and continuous verification mandated for all payment processors.", tag: "Compliance" },
    { period: "2024", title: "AI Agent Proliferation",   desc: "Fortune 500 enterprises deploy 50+ autonomous AI agents each, overwhelming manual governance.", tag: "Market Shift" },
    { period: "2025", title: "HIPAA Identity Updates",   desc: "Enhanced identity verification and automated access reviews required for HIPAA-regulated systems.", tag: "Healthcare" },
    { period: "2025", title: "SOC 2 Audit Evolution",    desc: "Auditors demand immutable, automated audit trails — manual spreadsheets no longer accepted.", tag: "Enterprise" },
    { period: "2026", title: "95% Agentic Enterprises",  desc: "95% of enterprises with 1,000+ employees now run AI agents autonomously. Manual governance is structurally impossible.", tag: "Today" },
  ];
  return (
    <section className="section" style={{ backgroundColor: "#faf9f7" }}>
      <div className="container mx-auto px-10">
        <div className="max-w-2xl mb-14">
          <span className="section-label">Why Now</span>
          <h2 className="section-heading mb-4">Five years of converging tailwinds</h2>
          <p className="section-sub">Regulatory pressure, AI proliferation, and escalating breach costs have created an urgent, unmet need for autonomous identity governance.</p>
        </div>
        <div className="relative">
          <div className="absolute left-24 top-0 bottom-0 w-px hidden md:block" style={{ backgroundColor: "#dcd6ce" }} />
          <div className="space-y-5">
            {events.map((e, i) => (
              <div key={i} className="flex gap-8 items-start">
                <div className="w-16 md:w-24 shrink-0 text-right">
                  <span className="text-sm font-semibold" style={{ color: "#4a5568" }}>{e.period}</span>
                </div>
                <div className="hidden md:flex items-center justify-center w-0 relative">
                  <div className="absolute w-2.5 h-2.5 rounded-full ring-4 -ml-1.5" style={{ backgroundColor: "#00297a", ringColor: "#ffffff" }} />
                </div>
                <div className="flex-1 card p-5 md:ml-4" style={{ borderColor: "#dcd6ce" }}>
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>{e.title}</div>
                    <span className="badge-blue shrink-0">{e.tag}</span>
                  </div>
                  <p className="text-sm" style={{ color: "#3d4759" }}>{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
