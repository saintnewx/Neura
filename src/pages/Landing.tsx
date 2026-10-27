import { useEffect, useRef, useState } from "react";
import "../styles/landing-midnight.css";
import Header from "../components/Header";
import Hero from "../components/Hero";
import SocialProof from "../components/SocialProof";
import BentoGrid from "../components/BentoGrid";
import UseCases from "../components/UseCases";
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
  const lastFocusedControl = useRef<HTMLElement | null>(null);
  const limitWasOpen = useRef(false);

  // Admission temporarily disables the submit button before opening the dialog.
  // Restore its earlier focus only when the shared dialog has no valid target.
  useEffect(() => {
    const control = lastFocusedControl.current;
    if (
      limitWasOpen.current &&
      !workspace.limitOpen &&
      document.activeElement === document.body &&
      control?.isConnected &&
      !control.matches(":disabled")
    ) {
      control.focus();
    }
    limitWasOpen.current = workspace.limitOpen;
  }, [workspace.limitOpen]);

  return (
    <div
      ref={pageRef}
      className="midnight-landing"
      onFocusCapture={(event) => {
        if (!workspace.limitOpen && event.target instanceof HTMLElement) {
          lastFocusedControl.current = event.target;
        }
      }}
    >
      <a href="#main" className="mn-skip">Перейти к содержимому</a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />

        <Reveal>
          <SocialProof />
        </Reveal>

        <Reveal>
          <BentoGrid />
        </Reveal>

        <Reveal>
          <UseCases />
        </Reveal>

        <div className="mn-generator">
          <div className="mn-container mn-generator-heading">
            <p className="mn-label">Попробуйте на своей задаче</p>
            <h2>Ваш следующий текст<br className="hidden sm:block" /> начинается здесь.</h2>
            <p className="mn-lead">Опишите идею, укажите важные факты и выберите тон. Это рабочий генератор — результат придёт от AI.</p>
          </div>
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
        </div>

        {workspace.historyError && (
          <div
            role="alert"
            className="mn-container mn-save-error"
          >
            <p>{workspace.historyError}</p>
            {!!workspace.pendingCount && (
              <button
                type="button"
                onClick={() => void workspace.retrySave()}
                disabled={workspace.saving}
                className="mn-button"
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
