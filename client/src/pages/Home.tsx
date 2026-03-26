import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import AgenticShift from "@/components/AgenticShift";
import WhyUnkov from "@/components/WhyUnkov";
import FAQAccordion from "@/components/FAQAccordion";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen text-[#1d1d1f]" style={{ backgroundColor: "#faf9f7" }}>
      <Header />
      <Hero />
      <div id="problem"><Problem /></div>
      <div id="solution"><AgenticShift /></div>
      <WhyUnkov />
      <FAQAccordion />
      <CTA />
      <Footer />
    </div>
  );
}
