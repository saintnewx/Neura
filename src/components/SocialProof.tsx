const BRANDS = [
  "Lumen",
  "Vertex",
  "Northwind",
  "Acme",
  "Orbit",
  "Pinnacle",
  "Helios",
  "Meridian",
  "Cascade",
  "Atlas",
];

export default function SocialProof() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-label uppercase text-text-tertiary mb-16">
          Создано для современных команд
        </p>
      </div>

      {/* Marquee */}
      <div className="relative">
        <div
          className="flex gap-16 animate-[marquee_40s_linear_infinite] whitespace-nowrap"
          style={{ willChange: "transform" }}
        >
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span
              key={i}
              className="text-text-tertiary font-semibold select-none"
              style={{ fontSize: "24px", opacity: 0.5 }}
            >
              {brand}
            </span>
          ))}
        </div>

        {/* Mask по краям */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgb(13 13 12) 0%, transparent 10%, transparent 90%, rgb(13 13 12) 100%)",
          }}
        />

        {/* Тонкие линии сверху и снизу */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
          }}
        />
      </div>
    </section>
  );
}