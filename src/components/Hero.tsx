import HeroSphere from "./HeroSphere";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-base"
    >
      {/* Тонкая техническая сетка */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="hidden md:block pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(124,131,253,0.15) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />
      <div
        aria-hidden="true"
        className="hidden md:block pointer-events-none absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(124,131,253,0.10) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      {/* Сфера */}
      <HeroSphere />

      {/* Контент */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <p className="text-label uppercase text-text-secondary mb-8">
          AI для маркетологов
        </p>

        <h1
          className="text-text-primary font-bold mb-8"
          style={{
            fontSize: "clamp(48px, 9vw, 128px)",
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
          }}
        >
          Забудь о
          <br />
          Writer's Block.
        </h1>

        <p
          className="text-text-secondary max-w-2xl mx-auto mb-12"
          style={{ fontSize: "19px", lineHeight: 1.6 }}
        >
          Neura генерирует тексты, которые конвертируют, а не просто заполняют
          страницы. За секунды.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="/app"
            className="inline-flex items-center justify-center bg-[#F5F5F7] text-[#0D0D0C] rounded-full px-8 font-medium transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ minHeight: "52px", fontSize: "17px" }}
          >
            Попробовать бесплатно
          </a>
          <a
            href="#story"
            className="inline-flex items-center justify-center border border-white/15 text-text-primary rounded-full px-8 font-medium transition-all duration-200 hover:border-white/30 hover:bg-white/[0.03]"
            style={{ minHeight: "52px", fontSize: "17px" }}
          >
            Посмотреть, как работает
          </a>
        </div>

        <p className="text-text-tertiary" style={{ fontSize: "13px" }}>
          Без карты · 10 генераций бесплатно
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-[scroll-indicator_2.4s_ease-in-out_infinite]"
      >
        <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
          <path
            d="M10 4 V26 M4 20 L10 26 L16 20"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}