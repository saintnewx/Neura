// Product capabilities, not customer endorsements or usage statistics.
export default function SocialProof() {
  return (
    <section aria-label="Возможности продукта" className="relative bg-bg py-24 md:py-40">
      <div className="mx-auto max-w-5xl px-6">
        <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-8 border-y border-ink/[0.08] py-8 text-center text-sm font-body text-muted md:grid-cols-4 md:gap-8">
          {["12 шаблонов", "6 тонов", "потоковая генерация", "история в облаке"].map(fact => (
            <li key={fact} className="flex min-h-11 items-center justify-center">{fact}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
