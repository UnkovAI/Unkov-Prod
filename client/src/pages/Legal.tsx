import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Legal() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf9f7", color: "#1a1a2e" }}>
      <Header />
      <div className="pt-20">
        <section className="section-slim" style={{ borderBottom: "1px solid #dcd6ce" }}>
          <div className="container mx-auto px-10 max-w-2xl">
            <span className="section-label">Legal</span>
            <h1 className="text-2xl font-bold mb-4" style={{ color: "#1a1a2e" }}>Legal Policies</h1>
            <p className="section-sub">Privacy Policy, Terms of Service, and Cookie Policy for Unkov.</p>
          </div>
        </section>

        <section className="section-slim">
          <div className="container mx-auto px-10 max-w-3xl space-y-16">
            {[
              { title: "Privacy Policy", sections: [
                { h: "Information We Collect", p: "We collect information you provide directly — your name, email address, and company name when you submit a contact form or sign up for updates. We also collect standard web analytics data (page views, referrer, browser type)." },
                { h: "How We Use Your Information", p: "We use your contact information solely to respond to your inquiry or send product updates you have subscribed to. We do not sell or share your personal data with third parties for marketing purposes." },
                { h: "Data Retention", p: "We retain contact form submissions for up to 24 months. You may request deletion of your data at any time by emailing privacy@unkov.com." },
              ]},
              { title: "Terms of Service", sections: [
                { h: "Use of This Site", p: "This website is provided for informational purposes only. Nothing on this site constitutes a binding offer, warranty, or commitment to deliver any specific product feature or service." },
                { h: "Intellectual Property", p: "All content on this site — including text, graphics, logos, and product descriptions — is the property of Unkov and may not be reproduced without express written permission." },
                { h: "Forward-Looking Statements", p: "This site contains forward-looking statements about Unkov's business, product roadmap, and financial projections. Nothing on this site constitutes investment advice or a solicitation to invest." },
              ]},
              { title: "Cookie Policy", sections: [
                { h: "What We Store", p: "A single 'theme' value in your browser's localStorage to preserve your light/dark mode preference across sessions. This is not a cookie and is never sent to our servers." },
                { h: "Third-Party Services", p: "We may use privacy-respecting analytics that do not use cookies or fingerprinting. No data is shared with advertising networks." },
                { h: "Your Control", p: "You can clear your localStorage at any time via your browser's developer tools. This will reset your theme preference to the default (light mode)." },
              ]},
            ].map((doc, di) => (
              <div key={di}>
                {di > 0 && <div style={{ borderTop: "1px solid #dcd6ce", marginBottom: "4rem" }} />}
                <h2 className="text-2xl font-bold mb-2" style={{ color: "#1a1a2e" }}>{doc.title}</h2>
                <p className="text-xs mb-6" style={{ color: "#4a5568" }}>Last updated: March 2026</p>
                <div className="space-y-5">
                  {doc.sections.map((s, si) => (
                    <div key={si}>
                      <h3 className="text-base font-semibold mb-2" style={{ color: "#1a1a2e" }}>{s.h}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "#3d4759" }}>{s.p}</p>
                    </div>
                  ))}
                  <p className="text-sm" style={{ color: "#3d4759" }}>
                    Questions? Email <a href="mailto:privacy@unkov.com" className="font-medium underline" style={{ color: "#00297a" }}>privacy@unkov.com</a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
