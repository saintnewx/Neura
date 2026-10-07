import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

// Illustrative plans; CTA opens the demo without payment or registration.
const plans = [
  {
    name: "Free",
    price: "0",
    description: "Чтобы познакомиться с Neura",
    features: [
      "10 генераций в месяц",
      "Все 4 формата контента",
      "Базовые тона и стили",
      "Копирование в один клик",
    ],
    cta: "Начать бесплатно",
    popular: false,
  },
  {
    name: "Pro",
    price: "19",
    description: "Для тех, кто создаёт каждый день",
    features: [
      "500 генераций в месяц",
      "Все 4 формата контента",
      "Гибкие тона и стили",
      "Приоритетная генерация",
      "История ваших текстов",
    ],
    cta: "Попробовать Pro",
    popular: true,
  },
  {
    name: "Team",
    price: "49",
    description: "Для команды с большими идеями",
    features: [
      "2 000 генераций в месяц",
      "Всё, что есть в Pro",
      "До 5 участников команды",
      "Единый голос бренда",
      "Приоритетная поддержка",
    ],
    cta: "Начать с командой",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section-space container-page">
      <div className="reveal mb-14 text-center">
        <p className="eyebrow mb-4">Ваш следующий шаг</p>
        <h2>Простые тарифы</h2>
        <p className="mt-5 text-muted">
          Начните бесплатно. Масштабируйтесь вместе с идеями.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`card card-interactive reveal relative flex flex-col ${plan.popular ? "border-accent bg-gradient-to-b from-accent/[0.05] to-card shadow-[0_0_40px_rgba(94,106,210,0.06)]" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white">
                <Sparkles size={12} />
                Популярный
              </div>
            )}
            <p
              className={`text-lg font-semibold ${plan.popular ? "text-accent" : ""}`}
            >
              {plan.name}
            </p>
            <p className="mt-2 text-sm text-muted">{plan.description}</p>
            <div className="my-8 flex items-baseline gap-1">
              <span className="text-[52px] font-bold leading-none tracking-tight">
                ${plan.price}
              </span>
              <span className="text-sm text-muted">
                {plan.price === "0" ? "/ навсегда" : "/ мес"}
              </span>
            </div>
            <Link
              to={`/app?plan=${plan.name.toLowerCase()}`}
              className={
                plan.popular ? "btn-primary px-4" : "btn-secondary px-4"
              }
            >
              {plan.cta}
            </Link>
            <div className="my-7 h-px bg-line" />
            <ul className="space-y-4">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm leading-relaxed"
                >
                  <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                  {feature}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="mt-7 text-center text-xs text-muted">
        Тарифы показаны для ознакомления. Все кнопки открывают бесплатное демо.
      </p>
    </section>
  );
}
