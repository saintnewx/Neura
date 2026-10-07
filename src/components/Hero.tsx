import { useEffect, useState } from "react";
import { ArrowUpRight, Coffee, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

// The studio illustrates a coffee-shop post without starting a real generation.
const exampleTask =
  "Напиши тёплый пост для кофейни о новом сезонном латте. Пригласи заглянуть на кофе после прогулки.";
const examplePost =
  "Осень пахнет корицей и свежим кофе. Мы приготовили пряный латте с нежной молочной пеной — тот самый повод сделать паузу. Загляните после прогулки: чашка согреет руки, а мы найдём для вас уютное место.";

// Type at 30ms per character; reduced motion shows the complete accessible example.
export default function Hero() {
  const [visibleText, setVisibleText] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const characters = Array.from(examplePost);
    let typingTimer: number | undefined;

    function updateMotion() {
      window.clearInterval(typingTimer);
      setReducedMotion(query.matches);
      if (query.matches) {
        setVisibleText(examplePost);
        return;
      }
      setVisibleText("");
      let length = 0;
      typingTimer = window.setInterval(() => {
        length += 1;
        setVisibleText(characters.slice(0, length).join(""));
        if (length >= characters.length) window.clearInterval(typingTimer);
      }, 30);
    }

    updateMotion();
    query.addEventListener("change", updateMotion);
    return () => {
      window.clearInterval(typingTimer);
      query.removeEventListener("change", updateMotion);
    };
  }, []);

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden py-20 sm:py-24 lg:py-28">
      <div className="container-page grid w-full items-center gap-16 lg:grid-cols-2 lg:gap-12">
        {/* Centered editorial copy, with safe line breaks for narrow screens. */}
        <div className="min-w-0 text-center">
          <p
            className="stage-one-reveal mb-7 text-[12px] font-semibold uppercase tracking-[0.2em] text-accent"
            data-reveal-delay="0"
          >
            AI ДЛЯ МАРКЕТОЛОГОВ
          </p>
          <h1
            className="stage-one-title stage-one-reveal font-bold leading-[0.98] tracking-tight"
            data-reveal-delay="100"
          >
            <span className="block">Забудь о</span>
            <span className="block bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
              <span className="block">Writer&apos;s</span>
              <span className="block">Block.</span>
            </span>
          </h1>
          <p
            className="stage-one-reveal mx-auto mt-7 max-w-2xl text-[22px] leading-[1.55] text-muted"
            data-reveal-delay="200"
          >
            Neura генерирует тексты, которые конвертируют, а не просто заполняют
            страницы.
          </p>
          <div
            className="stage-one-reveal mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            data-reveal-delay="300"
          >
            <Link
              to="/app"
              className="stage-one-primary inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold"
            >
              Начать бесплатно
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <a
              href="#demo"
              className="stage-one-secondary inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-border bg-white/[0.03] px-8 py-4 text-base font-semibold text-text backdrop-blur-xl"
            >
              <Play size={16} aria-hidden="true" />
              Смотреть демо
            </a>
          </div>
          <p
            className="stage-one-reveal mt-5 text-[13px] text-muted"
            data-reveal-delay="400"
          >
            Без карты · 10 генераций бесплатно
          </p>
        </div>

        {/* Glass studio and its ambient cyan light use only CSS and Lucide icons. */}
        <div
          className="stage-one-reveal relative isolate min-w-0"
          data-reveal-delay="500"
        >
          <div
            aria-hidden="true"
            className="studio-glow pointer-events-none absolute -inset-12 -z-10 rounded-full blur-3xl"
          />
          <div className="studio-card overflow-hidden rounded-3xl border border-border bg-card backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-5 sm:px-6">
              <div className="flex items-center gap-2.5 text-[15px] font-semibold text-text">
                <Sparkles
                  size={18}
                  className="text-accent"
                  aria-hidden="true"
                />
                Neura Studio
              </div>
              <span className="shrink-0 rounded-full border border-border bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-muted">
                GPT-4o
              </span>
            </div>
            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2">
              <div className="min-w-0">
                <label
                  htmlFor="hero-studio-task"
                  className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.15em] text-muted"
                >
                  Ваша идея
                </label>
                <textarea
                  id="hero-studio-task"
                  value={exampleTask}
                  readOnly
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-border bg-bg/40 p-4 text-[14px] leading-[1.75] text-text outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                />
                <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3 py-1.5 text-[11px] text-muted">
                  <Coffee size={13} aria-hidden="true" />
                  Пост для кофейни
                </span>
              </div>
              <div className="min-w-0">
                <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
                  <Sparkles size={12} aria-hidden="true" />
                  Результат
                </p>
                <div className="min-h-[245px] rounded-2xl border border-accent/10 bg-white/[0.02] p-4">
                  <p
                    aria-hidden="true"
                    className="break-words text-[14px] leading-[1.75] text-text"
                  >
                    {visibleText}
                    {!reducedMotion &&
                      visibleText.length < examplePost.length && (
                        <span className="studio-cursor ml-0.5 text-accent">
                          |
                        </span>
                      )}
                  </p>
                  <span className="sr-only">{examplePost}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4 text-[11px] text-muted sm:px-6">
              <span>Меньше рутины. Больше идей.</span>
              <span className="flex shrink-0 items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Демо
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
