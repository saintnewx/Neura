import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: "0",
    period: "навсегда",
    description: "Для знакомства с Neura",
    features: [
      "10 генераций в месяц",
      "Базовые шаблоны",
      "Экспорт в .txt",
      "Поддержка сообщества",
    ],
    cta: "Начать бесплатно",
    highlight: false,
  },
  {
    name: "Pro",
    price: "19",
    period: "в месяц",
    description: "Для маркетологов и SMM",
    features: [
      "Безлимит генераций",
      "Все шаблоны",
      "Свой тон и стиль",
      "История на всех устройствах",
      "Приоритетная поддержка",
    ],
    cta: "Выбрать Pro",
    highlight: true,
  },
  {
    name: "Team",
    price: "49",
    period: "в месяц",
    description: "Для команд до 5 человек",
    features: [
      "Всё из Pro",
      "5 пользователей",
      "Общие шаблоны",
      "Совместная история",
      "Поддержка по email",
    ],
    cta: "Выбрать Team",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-16 md:mb-24">
          <p className="text-label uppercase text-text-tertiary mb-4">
            Тарифы
          </p>
          <h2
            className="text-text-primary font-bold"
            style={{
              fontSize: "clamp(36px, 5.5vw, 80px)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            Простые тарифы
          </h2>
          <p
            className="text-text-secondary mt-6 max-w-copy"
            style={{ fontSize: "19px", lineHeight: 1.6 }}
          >
            Начни бесплатно. Перейди на Pro, когда почувствуешь разницу.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-panel p-8 flex flex-col transition-colors duration-200 ${
                plan.highlight
                  ? "bg-white/[0.05] border-2 border-accent/40 md:scale-[1.03] shadow-[0_0_60px_rgba(124,131,253,0.12)]"
                  : "bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.14]"
              }`}
            >
              {plan.highlight && (
                <span
                  className="inline-flex items-center self-start bg-accent text-[#0D0D0C] rounded-full px-3 py-1 mb-4 font-semibold"
                  style={{ fontSize: "11px", letterSpacing: "0.1em" }}
                >
                  ПОПУЛЯРНЫЙ
                </span>
              )}

              <h3
                className="text-text-primary font-semibold mb-2"
                style={{ fontSize: "20px" }}
              >
                {plan.name}
              </h3>
              <p
                className="text-text-tertiary mb-6"
                style={{ fontSize: "14px" }}
              >
                {plan.description}
              </p>

              <div className="flex items-baseline gap-2 mb-8">
                <span
                  className="text-text-primary font-bold"
                  style={{
                    fontSize: "56px",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  ${plan.price}
                </span>
                <span
                  className="text-text-tertiary"
                  style={{ fontSize: "14px" }}
                >
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      size={18}
                      className="text-accent flex-shrink-0 mt-0.5"
                    />
                    <span
                      className="text-text-secondary"
                      style={{ fontSize: "15px", lineHeight: 1.5 }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="/app"
                className={`inline-flex items-center justify-center rounded-full px-6 font-medium transition-all duration-200 ${
                  plan.highlight
                    ? "bg-[#F5F5F7] text-[#0D0D0C] hover:scale-[1.02] active:scale-[0.98]"
                    : "border border-white/[0.14] text-text-primary hover:border-white/[0.3] hover:bg-white/[0.03]"
                }`}
                style={{ minHeight: "52px", fontSize: "16px" }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}