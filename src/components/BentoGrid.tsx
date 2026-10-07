import { Brain, Zap, Sparkles, TrendingUp, Plug } from "lucide-react";

export default function BentoGrid() {
  return (
    <section
      id="features"
      className="relative py-24 md:py-40"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Заголовок секции */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <p className="text-label uppercase text-text-tertiary mb-4">
            Возможности
          </p>
          <h2
            className="text-text-primary font-bold"
            style={{
              fontSize: "clamp(36px, 5.5vw, 80px)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            Почему Neura
          </h2>
          <p
            className="text-text-secondary mt-6 max-w-copy"
            style={{ fontSize: "19px", lineHeight: 1.6 }}
          >
            Всё, что нужно маркетологу — в одном месте. Без переключений,
            без пустых листов, без рутины.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {/* Карточка 1 — большая */}
          <div className="md:col-span-4 md:row-span-2 rounded-panel bg-white/[0.03] border border-white/[0.08] p-8 md:p-10 flex flex-col justify-between min-h-[320px] md:min-h-[420px] transition-colors duration-200 hover:bg-white/[0.05] hover:border-white/[0.14]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-6">
                <Brain size={22} className="text-accent" />
              </div>
              <h3
                className="text-text-primary font-semibold mb-3"
                style={{ fontSize: "28px", letterSpacing: "-0.01em" }}
              >
                Понимает контекст
              </h3>
              <p
                className="text-text-secondary max-w-md"
                style={{ fontSize: "17px", lineHeight: 1.6 }}
              >
                Ваш продукт, аудитория, цель, тон. Neura анализирует задачу
                и превращает её в текст, который говорит с вашими клиентами.
              </p>
            </div>

            {/* Мини-визуал: связная сеть */}
            <div className="mt-8 relative h-32 md:h-40">
              <svg viewBox="0 0 400 160" className="w-full h-full" fill="none">
                <line x1="80" y1="80" x2="160" y2="40" stroke="rgb(124 131 253 / 0.2)" strokeWidth="1" />
                <line x1="80" y1="80" x2="160" y2="120" stroke="rgb(124 131 253 / 0.2)" strokeWidth="1" />
                <line x1="160" y1="40" x2="240" y2="80" stroke="rgb(124 131 253 / 0.2)" strokeWidth="1" />
                <line x1="160" y1="120" x2="240" y2="80" stroke="rgb(124 131 253 / 0.2)" strokeWidth="1" />
                <line x1="240" y1="80" x2="320" y2="40" stroke="rgb(124 131 253 / 0.2)" strokeWidth="1" />
                <line x1="240" y1="80" x2="320" y2="120" stroke="rgb(124 131 253 / 0.2)" strokeWidth="1" />

                <circle cx="80" cy="80" r="6" fill="rgb(124 131 253 / 0.8)" />
                <circle cx="160" cy="40" r="4" fill="rgb(124 131 253 / 0.5)" />
                <circle cx="160" cy="120" r="4" fill="rgb(124 131 253 / 0.5)" />
                <circle cx="240" cy="80" r="5" fill="rgb(124 131 253 / 0.7)" />
                <circle cx="320" cy="40" r="4" fill="rgb(124 131 253 / 0.5)" />
                <circle cx="320" cy="120" r="4" fill="rgb(124 131 253 / 0.5)" />
              </svg>
            </div>
          </div>

          {/* Карточка 2 — скорость */}
          <div className="md:col-span-2 rounded-panel bg-white/[0.03] border border-white/[0.08] p-8 flex flex-col justify-between min-h-[200px] transition-colors duration-200 hover:bg-white/[0.05] hover:border-white/[0.14]">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-6">
              <Zap size={22} className="text-accent" />
            </div>
            <div>
              <div
                className="text-text-primary font-bold mb-2"
                style={{ fontSize: "56px", lineHeight: 1, letterSpacing: "-0.03em" }}
              >
                0.8s
              </div>
              <p className="text-text-secondary" style={{ fontSize: "15px" }}>
                среднее время до готового текста
              </p>
            </div>
          </div>

          {/* Карточка 3 — тон и стиль */}
          <div className="md:col-span-2 rounded-panel bg-white/[0.03] border border-white/[0.08] p-8 flex flex-col justify-between min-h-[200px] transition-colors duration-200 hover:bg-white/[0.05] hover:border-white/[0.14]">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-6">
              <Sparkles size={22} className="text-accent" />
            </div>
            <div>
              <h3
                className="text-text-primary font-semibold mb-3"
                style={{ fontSize: "18px" }}
              >
                Тон и стиль
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Дружелюбный", "Продающий", "Официальный", "Дерзкий"].map((tone) => (
                  <span
                    key={tone}
                    className="text-text-secondary border border-white/[0.08] rounded-full px-3 py-1"
                    style={{ fontSize: "12px" }}
                  >
                    {tone}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Карточка 4 — тренды */}
          <div className="md:col-span-3 rounded-panel bg-white/[0.03] border border-white/[0.08] p-8 flex flex-col justify-between min-h-[220px] transition-colors duration-200 hover:bg-white/[0.05] hover:border-white/[0.14]">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-6">
              <TrendingUp size={22} className="text-accent" />
            </div>
            <div>
              <h3
                className="text-text-primary font-semibold mb-2"
                style={{ fontSize: "18px" }}
              >
                Актуальные тренды
              </h3>
              <p
                className="text-text-secondary mb-4"
                style={{ fontSize: "15px", lineHeight: 1.5 }}
              >
                Neura учитывает, что работает сейчас — не то, что работало год назад.
              </p>
              <svg viewBox="0 0 300 60" className="w-full h-12" fill="none">
                <path
                  d="M0 50 L50 42 L100 46 L150 30 L200 20 L250 15 L300 8"
                  stroke="rgb(124 131 253 / 0.6)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Карточка 5 — интеграции */}
          <div className="md:col-span-3 rounded-panel bg-white/[0.03] border border-white/[0.08] p-8 flex flex-col justify-between min-h-[220px] transition-colors duration-200 hover:bg-white/[0.05] hover:border-white/[0.14]">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-6">
              <Plug size={22} className="text-accent" />
            </div>
            <div>
              <h3
                className="text-text-primary font-semibold mb-2"
                style={{ fontSize: "18px" }}
              >
                Готово к работе
              </h3>
              <p
                className="text-text-secondary"
                style={{ fontSize: "15px", lineHeight: 1.5 }}
              >
                Копируй в Telegram, Instagram, LinkedIn — или скачивай в .txt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}