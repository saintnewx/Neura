import { useRef, useState } from "react";
import "../styles/landing-midnight.css";
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
  const [, setGeneratorBusy] = useState(false);

  return (
    <div ref={pageRef} className="midnight-landing">
      <a href="#main" className="mn-skip">Перейти к содержимому</a>
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
            onUsage={workspace.updateUsage}
            onLimitReached={workspace.openLimit}
            onBusyChange={setGeneratorBusy}
            selectedGeneration={null}
            disabled={loading || workspace.historyLoading}
            variant="landing"
            usage={workspace.usage}
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
                className="inline-flex items-center justify-center border border-ink/[0.14] text-text-primary rounded-full px-4 mt-3 transition-transform hover:border-ink/30 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ minHeight: "44px", fontSize: "14px" }}
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
