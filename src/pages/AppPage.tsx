import { ArrowLeft, Sparkles } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import DemoSection from "../components/DemoSection";

// Focused generator workspace, also used by all pricing CTAs.
export default function AppPage() {
  const [params] = useSearchParams();
  const plan = params.get("plan");
  return (
    <div className="hero-glow min-h-screen">
      <header className="border-b border-line/50">
        <div className="container-page flex h-20 items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft size={18} />
            Назад
          </Link>
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            Neura<span className="text-accent">.</span>
          </Link>
        </div>
      </header>
      <main className="container-page py-12 sm:py-16">
        <div className="mb-10">
          <p className="eyebrow mb-4 flex items-center gap-2">
            <Sparkles size={14} className="text-accent" />
            Ваша рабочая область
          </p>
          <h1 className="text-4xl leading-tight sm:text-5xl lg:text-[56px]">
            Начнём с идеи.
          </h1>
          <p className="mt-4 text-muted">
            Опишите задачу — найдём для неё нужные слова.
          </p>
          {(plan === "pro" || plan === "team") && (
            <p
              role="status"
              className="mt-4 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-muted"
            >
              Вы выбрали {plan === "pro" ? "Pro" : "Team"}. Сейчас доступно
              бесплатное демо — платные подписки ещё не подключены.
            </p>
          )}
        </div>
        <DemoSection variant="workspace" />
      </main>
      <footer className="container-page pb-8 text-xs text-muted">
        © {new Date().getFullYear()} Neura · Больше идей. Меньше рутины.
      </footer>
    </div>
  );
}
