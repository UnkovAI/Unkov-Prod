import { useState } from "react";
import { Send, Linkedin, Twitter, Github } from "lucide-react";
import { useLocation } from "wouter";
import { LogoMark } from "./LogoMark";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [, navigate] = useLocation();
  const year = new Date().getFullYear();

  // Navigate AND scroll to top
  const go = (href: string) => {
    navigate(href);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); setTimeout(() => setSubscribed(false), 3000); }
  };

  const cols = [
    { title: "Products",  links: [
      { label: "Apply for Pilot",  href: "/early-access" },
      { label: "Features",         href: "/features" },
      { label: "Documentation",     href: "/docs" },
      { label: "How It Works",     href: "/features" },
      { label: "Pricing",          href: "/pricing" },
      { label: "Integrations",     href: "/integrations" },
    ]},
    { title: "Company",   links: [
      { label: "About Us",  href: "/company" },
      { label: "Blog",      href: "/blog" },
      { label: "Careers",   href: "/careers" },
      { label: "Press",     href: "/press" },
      { label: "Contact",   href: "/contact" },
    ]},
    { title: "Investors", links: [
      { label: "For Investors",  href: "/investor-gate" },
      { label: "Roadmap",        href: "/roadmap" },
      { label: "Pitch Deck",     href: "/pitch-deck" },
    ]},
  ];

  return (
    <footer style={{ backgroundColor: "#0f1729", color: "#8090b0" }}>

      {/* Newsletter */}
      <div style={{ borderBottom: "1px solid #252b3b" }}>
        <div className="container mx-auto px-10 py-12">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="text-sm font-semibold mb-1" style={{ color: "#f6f8fa" }}>Stay Updated</div>
              <p className="text-sm" style={{ color: "#c8d4e8" }}>Product roadmap, market insights, and agentic economy trends.</p>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" required
                className="px-4 py-2 text-sm rounded-lg w-56 focus:outline-none focus:ring-2"
                style={{ backgroundColor: "#162035", border: "1px solid #2e3650", color: "#f6f8fa" }} />
              <button type="submit"
                className="px-4 py-2 text-white text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                style={{ backgroundColor: "#0061d4" }}>
                <Send className="w-3.5 h-3.5" /> Subscribe
              </button>
            </form>
          </div>
          {subscribed && <p className="text-sm mt-3" style={{ color: "#6ee7b7" }}>✓ Subscribed! Check your email for confirmation.</p>}
        </div>
      </div>

      {/* Links */}
      <div className="container mx-auto px-10 py-12">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>

          {/* Brand col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <LogoMark size={24} bgColor="#0f1729" />
              <span className="text-sm font-semibold" style={{ color: "#f6f8fa" }}><span style={{ color: "#00e5ff" }}>U</span>nkov</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#c8d4e8" }}>The identity gate between every human, AI agent, and everything they can touch.</p>
            <div className="flex gap-3 mt-5">
              {[
                { Icon: Twitter,  href: "https://x.com/UnkovAI",                        label: "X (Twitter)" },
                { Icon: Linkedin, href: "https://www.linkedin.com/company/112230801",   label: "LinkedIn" },
                { Icon: Github,   href: "https://github.com/UnkovAI",                   label: "GitHub" },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="p-2 rounded-md transition-colors"
                  style={{ color: "#8090b0" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#f6f8fa")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#8090b0")}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav cols */}
          {cols.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#8090b0" }}>{col.title}</div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => go(l.href)}
                      className="text-sm transition-colors text-left"
                      style={{ color: "#8090b0", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#f6f8fa")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#8090b0")}>
                      {l.label}
                      {col.title === "Investors" ? " 🔒" : ""}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs pt-8" style={{ borderTop: "1px solid #252b3b" }}>
          <span>© {year} Unkov. All rights reserved.</span>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(label => (
              <button key={label}
                onClick={() => go("/legal")}
                className="transition-colors"
                style={{ color: "#8090b0", background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#f6f8fa")}
                onMouseLeave={e => (e.currentTarget.style.color = "#8090b0")}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}