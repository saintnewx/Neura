import { ArrowRight, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import HeroPreview from "./HeroPreview";

// Product-first Hero. Navigation reuses the existing guest and account flows.
export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative bg-neura-bg-base text-neura-foreground"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-32 md:pb-24 md:pt-40 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12 lg:pb-28 lg:pt-44">
        <div className="min-w-0">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.16em] text-neura-accent-text">
            AI для маркетинговых текстов
          </p>
          <h1
            id="hero-title"
            className="max-w-xl text-balance text-[clamp(40px,5.2vw,72px)] font-bold leading-[1.06] tracking-[-0.04em]"
          >
            От идеи до готового текста.
          </h1>
          <p className="mt-7 max-w-lg text-base font-normal leading-[1.7] text-neura-muted sm:text-lg">
            Создавайте посты, рекламные тексты и описания товаров с помощью AI.
            Выбирайте тон, получайте варианты и доводите результат до нужного
            звучания.
          </p>

          {/* The demo anchor already has a fixed-header offset and reduced-motion fallback. */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/app"
              className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-xl bg-neura-accent px-6 text-base font-medium text-white transition-transform duration-200 ease-out motion-safe:hover:-translate-y-0.5 focus-visible:outline-neura-accent-text motion-reduce:transform-none motion-reduce:transition-none"
            >
              Начать создавать
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a
              href="#demo"
              className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-xl border border-neura-border px-6 text-base font-medium text-neura-foreground transition-transform duration-200 ease-out motion-safe:hover:-translate-y-0.5 hover:border-neura-muted focus-visible:outline-neura-accent-text motion-reduce:transform-none motion-reduce:transition-none"
            >
              Смотреть пример
              <ArrowDown size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}
