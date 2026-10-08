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
import LimitModal from "../components/LimitModal";
import { useAuth } from "../hooks/useAuth";
import { useWorkspace } from "../hooks/useWorkspace";
import { useStageReveal } from "../hooks/useStageReveal";

// Reveal sections once; browser fallback leaves content visible.
export default function Landing() {
  const pageRef = useRef<HTMLDivElement>(null);
  useStageReveal(pageRef);
  const { user, loading } = useAuth();
  const workspace = useWorkspace(user, loading);
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
        <DemoSection
  key={user?.id ?? "guest"}
  onBeforeGenerate={workspace.beforeGenerate}
  onGenerated={workspace.saveGeneration}
/>.
        {workspace.historyError && (
          <div role="alert" className="container-page mt-4 text-sm text-error">
            <p>{workspace.historyError}</p>
            {!!workspace.pendingCount && (
              <button
                type="button"
                onClick={() => void workspace.retrySave()}
                disabled={workspace.saving}
                className="btn-secondary mt-3 min-h-10 px-4 py-2 text-sm"
              >
                {workspace.saving ? "Сохраняем…" : "Повторить сохранение"}
              </button>
            )}
          </div>
        )}
        <Pricing />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <LimitModal open={workspace.limitOpen} onClose={workspace.closeLimit} />
    </div>
  );
}
