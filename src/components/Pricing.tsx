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

// Only the free plan is actionable; concept prices are kept explicitly qualified.
export default function Pricing() {
  return (
    <section id="pricing" className="mn-section mn-pricing" aria-labelledby="pricing-title">
      <div className="mn-container">
        <div className="mn-section-heading">
          <p className="mn-label">Тарифы</p>
          <h2 id="pricing-title">Начните бесплатно.<br />Всё прозрачно.</h2>
          <p className="mn-lead">5 генераций в день для гостей, 20 — с аккаунтом. Лимиты обновляются в 00:00 UTC.</p>
        </div>
        <div className="mn-pricing-grid">
          {PLANS.map(plan => (
            <article key={plan.name} className={`mn-plan ${plan.available ? "mn-plan-available" : ""}`}>
              <div className="mn-plan-heading"><h3>{plan.name}</h3><span>{plan.available ? "Доступен" : "Концепт"}</span></div>
              <p className="mn-plan-description">{plan.description}</p>
              <div className="mn-plan-price"><strong>${plan.price}</strong><span>{plan.period}</span></div>
              {!plan.available && <p className="mn-plan-disclosure">Концептуальная цена, не действующее предложение. Оплата не подключена.</p>}
              <ul>
                {plan.features.map(feature => (
                  <li key={feature}>
                    {plan.available ? <Check size={17} aria-hidden="true" /> : <span className="mn-plan-dash" aria-hidden="true">—</span>}
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.available ? <a href="/app" className="mn-button mn-button-primary">{plan.cta}</a> : <button type="button" disabled className="mn-button">{plan.cta}</button>}
            </article>
          ))}
        </div>
        <p className="mn-pricing-note">Pro и Team — демонстрационные концепты. Платежи и платные подписки не подключены.</p>
      </div>
    </section>
  );
}
