import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Раньше полдня уходило на первые строки. Теперь есть черновик за минуту — и больше времени на стратегию.",
    initials: "АК",
    name: "Анна Ковалева",
    role: "SMM-менеджер · Layers",
  },
  {
    quote:
      "Наконец-то AI, который не пишет как AI. Задаю контекст и тон — получаю текст, который хочется дочитать.",
    initials: "МС",
    name: "Максим Соколов",
    role: "Head of Marketing · Quotient",
  },
  {
    quote:
      "Посты, письма, рекламные креативы — всё в одном месте. Neura стала нашим любимым участником команды.",
    initials: "ЕД",
    name: "Елена Дмитриева",
    role: "Основатель · Catalog",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 md:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-16 md:mb-24">
          <p className="text-label uppercase text-text-tertiary mb-4">
            Создано для тех, кто создаёт
          </p>
          <h2
            className="text-text-primary font-bold"
            style={{
              fontSize: "clamp(36px, 5.5vw, 80px)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            Что говорят маркетологи
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="rounded-panel bg-white/[0.03] border border-white/[0.08] p-8 flex flex-col transition-colors duration-200 hover:bg-white/[0.05] hover:border-white/[0.14] m-0"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-1 text-accent" aria-label="5 из 5">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={14}
                      fill="currentColor"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <Quote size={24} className="text-white/10" />
              </div>

              <blockquote
                className="text-text-primary flex-1 mb-8"
                style={{ fontSize: "16px", lineHeight: 1.8 }}
              >
                «{item.quote}»
              </blockquote>

              <figcaption className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold"
                  style={{ fontSize: "13px" }}
                >
                  {item.initials}
                </span>
                <div>
                  <p
                    className="text-text-primary font-semibold"
                    style={{ fontSize: "14px" }}
                  >
                    {item.name}
                  </p>
                  <p
                    className="text-text-tertiary mt-0.5"
                    style={{ fontSize: "12px" }}
                  >
                    {item.role}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <p
          className="mt-6 text-text-tertiary"
          style={{ fontSize: "12px" }}
        >
          Отзывы и логотипы — демонстрационные примеры.
        </p>
      </div>
    </section>
  );
}