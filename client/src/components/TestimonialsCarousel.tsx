import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote: "Unkov reduced our manual access reviews from 120+ hours per quarter to just 12 hours. The ROI was immediate.",
    author: "Anonymous CISO",
    title: "CISO",
    company: "Financial Services",
  },
  {
    quote: "We caught privilege creep our manual process had missed for over six months — before it became an incident. That alone justified the investment.",
    author: "Anonymous VP Security",
    title: "VP of Security",
    company: "Healthcare Organization",
  },
  {
    quote: "New hire provisioning went from 5 days to under 10 minutes. Our IT team now does security work, not spreadsheet work.",
    author: "Anonymous IT Director",
    title: "IT Director",
    company: "Enterprise Technology",
  },
];

export default function TestimonialsCarousel() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  return (
    <section style={{ padding: "clamp(3rem,6vw,6rem) 0", backgroundColor: "#f0ece6", borderTop: "1px solid #dcd6ce" }}>
      <div className="container mx-auto px-10">
        <div style={{ maxWidth: "660px", margin: "0 auto", textAlign: "center" }}>
          <span className="section-label" style={{ display: "block", textAlign: "center", marginBottom: "2.5rem" }}>Customer Stories</span>

          <blockquote style={{ fontSize: "1.25rem", fontWeight: 500, lineHeight: 1.7, color: "#1a1a2e", marginBottom: "2rem", fontStyle: "italic", letterSpacing: "-0.01em" }}>
            "{t.quote}"
          </blockquote>

          <div style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.01em" }}>{t.author}</div>
          <div style={{ fontSize: "1rem", color: "#6b7280", marginTop: "0.25rem" }}>{t.title} · {t.company}</div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "2.5rem" }}>
            <button
              onClick={() => setI((i - 1 + testimonials.length) % testimonials.length)}
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #dcd6ce", backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#4a5568", transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#00297a"; (e.currentTarget as HTMLElement).style.color = "#00297a"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#dcd6ce"; (e.currentTarget as HTMLElement).style.color = "#4a5568"; }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            {testimonials.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)}
                style={{ width: idx === i ? 24 : 8, height: 8, borderRadius: "9999px", border: "none", cursor: "pointer", transition: "all 0.2s", backgroundColor: idx === i ? "#00297a" : "#c4b8ae", padding: 0 }} />
            ))}
            <button
              onClick={() => setI((i + 1) % testimonials.length)}
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #dcd6ce", backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#4a5568", transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#00297a"; (e.currentTarget as HTMLElement).style.color = "#00297a"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#dcd6ce"; (e.currentTarget as HTMLElement).style.color = "#4a5568"; }}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
