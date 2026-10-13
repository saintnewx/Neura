import { Check } from "lucide-react";

// Only Starter is available. Pro and Team are non-purchasable demo concepts.
const PLANS = [
  {
    name: "Starter",
    price: "0",
    period: "бесплатно",
    description: "Для знакомства с Neura",
    features: [
      "5 генераций в день для гостей",
      "20 генераций в день с аккаунтом",
      "История на устройствах после входа",
      "Экспорт в .txt",
    ],
    cta: "Начать бесплатно",
    available: true,
    highlight: false,
  },
  {
    name: "Pro",
    price: "19",
    period: "в месяц · концепт",
    description: "Демонстрационный концепт тарифа",
    features: [
      "Платная подписка не подключена",
      "Покупка тарифа недоступна",
      "Действуют бесплатные лимиты 5/20",
    ],
    cta: "Скоро",
    available: false,
    highlight: true,
  },
  {
    name: "Team",
    price: "49",
    period: "в месяц · концепт",
    description: "Демонстрационный концепт тарифа",
    features: [
      "Оплата не подключена",
      "Командный тариф недоступен",
      "Действуют бесплатные лимиты 5/20",
    ],
    cta: "Скоро",
    available: false,
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative bg-bg py-24 md:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-24">
          <p className="text-xs font-display tracking-[0.2em] uppercase text-muted mb-4">
            Тарифы
          </p>
          <h2
            className="text-ink font-display"
            style={{
              fontSize: "32px",
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            Простые тарифы
          </h2>
          <p
            className="text-muted mt-6 max-w-2xl"
            style={{ fontSize: "19px", lineHeight: 1.6 }}
          >
            Начните бесплатно: 5 генераций в день для гостей, 20 — с аккаунтом.
            Pro и Team — демонстрационные концепты. Оплата не подключена,
            указанные цены не являются действующим предложением.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-card min-w-0 p-6 sm:p-8 flex flex-col transition-transform duration-200 motion-reduce:transition-none motion-reduce:transition-none ${
                plan.highlight
                  ? "bg-glass-strong border-2 border-accent shadow-glass"
                  : "bg-white/80 border border-ink/[0.08] hover:border-ink/[0.14]"
              }`}
            >
              {plan.highlight && <span className="absolute -top-3 left-6 rounded-pill bg-accent-ink px-3 py-1 text-xs font-display text-white">Популярный</span>}
              <h3
                className="text-ink font-display mb-2"
                style={{ fontSize: "20px" }}
              >
                {plan.name}
              </h3>
              <p
                className="text-muted mb-6"
                style={{ fontSize: "14px" }}
              >
                {plan.description}
              </p>

              <div className="flex flex-wrap items-baseline gap-2 mb-4">
                <span
                  className="text-ink font-display"
                  style={{
                    fontSize: "56px",
                    lineHeight: 1,
                    letterSpacing: "-0.01em",
                  }}
                >
                  ${plan.price}
                </span>
                <span
                  className="text-muted"
                  style={{ fontSize: "14px" }}
                >
                  {plan.period}
                </span>
              </div>

              {!plan.available && (
                <p className="mb-6 text-sm leading-relaxed text-muted">
                  Концептуальная цена, не действующее предложение. Оплата не
                  подключена.
                </p>
              )}

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    {plan.available ? (
                      <Check
                        size={18}
                        aria-hidden="true"
                        className="text-accent-ink flex-shrink-0 mt-0.5"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-secondary"
                      />
                    )}
                    <span
                      className="text-muted"
                      style={{ fontSize: "15px", lineHeight: 1.5 }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.available ? (
                <a
                  href="/app"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-ink/[0.14] px-6 text-base font-medium text-ink transition-[transform,opacity] duration-200 motion-reduce:transition-none motion-safe:hover:scale-[1.02] hover:border-ink/30 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
                >
                  {plan.cta}
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className={`inline-flex min-h-[52px] cursor-not-allowed items-center justify-center rounded-full px-6 text-base font-medium opacity-50 ${
                    plan.highlight
                      ? "bg-ink/[0.06] text-muted"
                      : "border border-ink/[0.14] text-ink"
                  }`}
                >
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
