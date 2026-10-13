import { Link } from "react-router-dom";
import HeroPreview from "./HeroPreview";

// The Hero uses the existing /app destination; its preview never calls the API.
export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative overflow-hidden bg-bg text-center text-ink pt-[calc(112px+env(safe-area-inset-top))] md:pt-[calc(168px+env(safe-area-inset-top))]">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <h1 id="hero-title" className="mx-auto max-w-[300px] text-balance text-[44px] font-display leading-[1.05] tracking-[-0.025em] motion-safe:animate-fade-up md:max-w-none md:text-[64px] md:leading-[1.02] md:tracking-display lg:text-[clamp(56px,7vw,88px)]">
          От <em className="font-serif text-[1.04em] font-normal tracking-[-0.01em]">идеи</em><br className="hidden md:block" />{" "}до готового текста
        </h1>
        <p className="mx-auto mt-6 max-w-[335px] text-[17px] font-body leading-[1.5] text-muted motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] md:max-w-[520px] md:text-xl">
          Опишите идею одной строкой. Neura напишет пост, письмо или сценарий в нужном тоне.
        </p>
        <div className="mt-7 motion-safe:animate-fade-up motion-safe:[animation-delay:160ms] md:mt-9">
          <Link to="/app" className="inline-flex h-14 w-full max-w-[335px] items-center justify-center rounded-pill bg-accent px-7 text-[19px] font-display text-white transition-transform duration-[120ms] ease-out hover:bg-[#F04E53] motion-safe:hover:-translate-y-px motion-safe:active:scale-[0.97] focus-visible:outline-accent-ink motion-reduce:transition-none md:w-auto">
            Попробовать бесплатно
          </Link>
          <p className="mt-3.5 text-sm font-body text-muted">5 генераций бесплатно · без карты</p>
        </div>
      </div>
      <HeroPreview />
    </section>
  );
}
