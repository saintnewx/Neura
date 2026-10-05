import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

const questions = [
  {
    question: "Что такое Neura и кому она подойдёт?",
    answer:
      "Neura — AI-помощник для маркетологов, SMM-менеджеров и предпринимателей. Он помогает начать работу над постом, письмом, рекламой или сценарием Reels с понятного черновика.",
  },
  {
    question: "Можно ли попробовать бесплатно?",
    answer:
      "Да. Откройте демо на этой странице или отдельную рабочую область. Регистрация и банковская карта не нужны. В текущей версии используется демонстрационная заглушка API.",
  },
  {
    question: "Какие форматы контента поддерживаются?",
    answer:
      "Четыре формата: посты для социальных сетей, email, рекламные тексты и сценарии Reels. Выберите формат перед генерацией, а в задаче укажите аудиторию и площадку.",
  },
  {
    question: "Как задать свой тон и стиль?",
    answer:
      "Добавьте пожелания прямо в описание задачи: например, «дружелюбно, без канцелярита» или «коротко и по делу». Полезно также привести пример текста вашего бренда.",
  },
  {
    question: "Нужно ли редактировать сгенерированный текст?",
    answer:
      "Да. Проверьте факты, цены и обещания, добавьте детали вашего продукта и адаптируйте текст под бренд. AI помогает с черновиком, а финальное решение остаётся за вами.",
  },
];

// Single-open accordion with semantic buttons and animated disclosure.
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const id = useId();
  return (
    <section id="faq" className="section-space container-page">
      <div className="reveal mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-4">Есть вопросы?</p>
          <h2>Частые вопросы</h2>
        </div>
        <div className="divide-y divide-line/70 border-y border-line/70">
          {questions.map((item, index) => {
            const open = openIndex === index;
            return (
              <div key={item.question}>
                <h3>
                  <button
                    type="button"
                    id={`${id}-question-${index}`}
                    aria-expanded={open}
                    aria-controls={`${id}-answer-${index}`}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-base font-medium leading-relaxed transition-colors hover:text-accent sm:text-lg"
                  >
                    {item.question}
                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-muted transition-transform duration-300 ${open ? "rotate-180 text-accent" : ""}`}
                    />
                  </button>
                </h3>
                <div
                  id={`${id}-answer-${index}`}
                  role="region"
                  aria-labelledby={`${id}-question-${index}`}
                  aria-hidden={!open}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 text-base leading-[1.8] text-muted">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
