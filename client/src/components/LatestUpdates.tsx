import { useLocation } from 'wouter';
const updates = [
  { date: 'Mar 2026', tag: 'Status', title: 'Now Onboarding Design Partners', desc: 'We are actively working with BFSI and healthcare organizations on structured pilots. If you are evaluating AI agent governance, we want to talk.' },
  { date: 'Q1 2026', tag: 'Building', title: 'Identity Gate Engine in Development', desc: 'The core inline authorization layer is in active development. Pilot deployments start in Q2 2026 with design partners.' },
  { date: 'Q2 2026', tag: 'Roadmap', title: 'Cross-Sector Intelligence Coming', desc: 'The network effect moat — anonymized threat intelligence shared across all customers — is on the roadmap for H2 2026.' },
];
export default function LatestUpdates() {
  const [, navigate] = useLocation();
  return (
    <section className="section" style={{ backgroundColor: "#faf9f7" }}>
      <div className="container mx-auto px-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="section-label">Latest</span>
            <h2 className="section-heading">Where we are</h2>
          </div>
          <button onClick={() => navigate("/roadmap")} className="btn-ghost text-sm hidden md:inline-flex">View roadmap →</button>
        </div>
        <div className="grid md:grid-cols-1 md:grid-cols-3 gap-5">
          {updates.map((u, i) => (
            <div key={i} className="card p-6" style={{ borderColor: "#dcd6ce" }}>
              <div className="flex items-center justify-between mb-4">
                <span className="badge-blue">{u.tag}</span>
                <span className="text-xs" style={{ color: "#4a5568" }}>{u.date}</span>
              </div>
              <div className="text-sm font-semibold mb-2 leading-snug" style={{ color: "#1a1a2e" }}>{u.title}</div>
              <p className="text-sm leading-relaxed" style={{ color: "#3d4759" }}>{u.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
