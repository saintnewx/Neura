import { useRef } from "react";
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
import Reveal from "../components/Reveal";
import { useAuth } from "../hooks/useAuth";
import { useWorkspace } from "../hooks/useWorkspace";

export default function Landing() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useAuth();
  const workspace = useWorkspace(user, loading);

  return (
    <div ref={pageRef}>
      <Header />
      <main id="main">
        <Hero />

        <Reveal>
          <SocialProof />
        </Reveal>

        <Reveal>
          <BentoGrid />
        </Reveal>

        <Reveal>
          <DemoSection
            key={user?.id ?? "guest"}
            onBeforeGenerate={workspace.beforeGenerate}
            onGenerated={workspace.saveGeneration}
          />
        </Reveal>

        {workspace.historyError && (
          <div
            role="alert"
            className="max-w-6xl mx-auto px-6 mt-4 text-sm text-error"
          >
            <p>{workspace.historyError}</p>
            {!!workspace.pendingCount && (
              <button
                type="button"
                onClick={() => void workspace.retrySave()}
                disabled={workspace.saving}
                className="inline-flex items-center justify-center border border-white/[0.14] text-text-primary rounded-full px-4 mt-3 transition-colors hover:border-white/[0.3] hover:bg-white/[0.03] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ minHeight: "40px", fontSize: "14px" }}
              >
                {workspace.saving ? "Сохраняем…" : "Повторить сохранение"}
              </button>
            )}
          </div>
        )}

        <Reveal>
          <Pricing />
        </Reveal>

        <Testimonials />

        <Reveal>
          <FAQ />
        </Reveal>
      </main>

      <Footer />
      <LimitModal open={workspace.limitOpen} onClose={workspace.closeLimit} />
    </div>
  );
}