import { useState } from "react";
import { Plus } from "lucide-react";
import Reveal from "./Reveal";

const FAQ_ITEMS = [
  {
    q: "Что такое Neura?",
    a: "Neura — это AI-инструмент для генерации маркетингового контента. Он пишет посты, письма, рекламные тексты и сценарии для Reels за секунды. Ты описываешь задачу — Neura выдаёт готовый текст.",
  },
  {
    q: "Нужно ли указывать данные карты?",
    a: "Нет. Ты можешь начать бесплатно — 10 генераций в месяц без карты. Если понравится, перейдёшь на Pro, когда сам захочешь.",
  },
  {
    q: "Какие модели AI используются?",
    a: "Neura работает на открытых моделях через NVIDIA NIM. Это значит, что твои данные не используются для обучения моделей, а генерация проходит быстро и стабильно.",
  },
  {
    q: "Можно ли использовать Neura для коммерческих целей?",
    a: "Да. Всё, что ты генерируешь, принадлежит тебе. Ты можешь использовать тексты в блогах, соцсетях, рекламе — где угодно.",
  },
  {
    q: "На каких языках работает Neura?",
    a: "Neura понимает русский и английский. Ты можешь писать задачу на одном языке, а получить результат на другом — или на том же.",
  },
  {
    q: "Что будет, если я исчерпаю лимит?",
    a: "Бесплатно — 10 генераций в месяц. После этого можно подождать до следующего месяца или перейти на Pro — там лимита нет.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 md:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="max-w-3xl mb-16 md:mb-24">
            <p className="text-label uppercase text-text-tertiary mb-4">
              Вопросы
            </p>
            <h2
              className="text-text-primary font-bold"
              style={{
                fontSize: "clamp(36px, 5.5vw, 80px)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              Частые вопросы
            </h2>
          </div>
        </Reveal>

        <div className="max-w-3xl">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 60}>
                <div className="border-b border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left transition-colors duration-200 group"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`font-semibold transition-colors duration-200 ${
                        isOpen ? "text-accent" : "text-text-primary group-hover:text-accent"
                      }`}
                      style={{ fontSize: "18px", lineHeight: 1.4 }}
                    >
                      {item.q}
                    </span>
                    <Plus
                      size={20}
                      className={`flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-45 text-accent" : "text-text-tertiary"
                      }`}
                    />
                  </button>

                  <div
                    className="overflow-hidden transition-all duration-400 ease-out"
                    style={{
                      maxHeight: isOpen ? "400px" : "0px",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <p
                      className="text-text-secondary pb-6 pr-8"
                      style={{ fontSize: "16px", lineHeight: 1.7 }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}