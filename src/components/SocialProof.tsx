const brands = [
  "Google",
  "Meta",
  "Notion",
  "Spotify",
  "Twitch",
  "Shopify",
  "Adobe",
  "Figma",
  "Miro",
  "Samsung",
];

// One semantic brand list and a hidden duplicate create a seamless CSS marquee.
export default function SocialProof() {
  return (
    <section
      className="container-page stage-one-reveal py-12 sm:py-16"
      data-reveal-delay="100"
      aria-labelledby="social-proof-title"
    >
      <div className="brand-marquee-line mb-10" aria-hidden="true" />
      <p
        id="social-proof-title"
        className="mb-8 text-center text-[12px] font-medium uppercase tracking-[0.2em] text-muted"
      >
        НАМ ДОВЕРЯЮТ
      </p>
      <div className="brand-marquee">
        <div className="brand-marquee-track">
          <ul className="brand-marquee-group" aria-label="Компании">
            {brands.map((brand) => (
              <li key={brand} className="brand-marquee-logo">
                {brand}
              </li>
            ))}
          </ul>
          {/* Assistive technologies encounter each brand exactly once. */}
          <ul className="brand-marquee-group" aria-hidden="true">
            {brands.map((brand) => (
              <li key={brand} className="brand-marquee-logo">
                {brand}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="brand-marquee-line mt-10" aria-hidden="true" />
    </section>
  );
}
