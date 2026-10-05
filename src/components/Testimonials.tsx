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

// Sample social proof is explicitly identified in this demo project.
export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="section-space border-y border-line/40 bg-card/20"
    >
      <div className="container-page">
        <div className="reveal mb-12">
          <p className="eyebrow mb-4">Создано для тех, кто создаёт</p>
          <h2>
            Что говорят
            <br className="hidden sm:block" /> маркетологи
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="card card-interactive reveal m-0 flex flex-col"
            >
              <div className="mb-6 flex items-center justify-between">
                <div aria-label="5 из 5" className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={14}
                      fill="currentColor"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <Quote size={24} className="text-line" />
              </div>
              <blockquote className="mb-8 flex-1 text-base leading-[1.8]">
                «{item.quote}»
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent">
                  {item.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{item.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted">
          Отзывы и логотипы — демонстрационные примеры.
        </p>
      </div>
    </section>
  );
}
