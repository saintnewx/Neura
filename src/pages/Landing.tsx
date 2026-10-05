import { useEffect, useRef } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import SocialProof from "../components/SocialProof";
import BentoGrid from "../components/BentoGrid";
import DemoSection from "../components/DemoSection";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

// Reveal sections once; browser fallback leaves content visible.
export default function Landing() {
  const pageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const elements = pageRef.current?.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-pending");
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    elements?.forEach((element) => {
      element.classList.add("reveal-pending");
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
      elements?.forEach((element) =>
        element.classList.remove("reveal-pending"),
      );
    };
  }, []);

  // Nine landing sections.
  return (
    <div ref={pageRef}>
      <Header />
      <main id="main">
        <Hero />
        <SocialProof />
        <BentoGrid />
        <DemoSection />
        <Pricing />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
