const brands = [
  "Layers",
  "Quotient",
  "Circooles",
  "Sisyphus",
  "Catalog",
  "Polymath",
];

// Text-only logos keep the landing image-free.
export default function SocialProof() {
  return (
    <section className="container-page reveal py-12">
      <div className="border-y border-line/60 py-10">
        <div className="mb-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-5">
          <p className="eyebrow">Нам доверяют</p>
          <span className="hidden h-4 w-px bg-line sm:block" />
          <p className="text-xl font-semibold tracking-tight">2,400+ команд</p>
        </div>
        <div className="grid grid-cols-2 items-center gap-x-6 gap-y-7 text-center sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand, index) => (
            <span
              key={brand}
              className={`text-xl font-semibold tracking-tight text-muted opacity-60 ${index === 3 ? "italic" : ""}`}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
