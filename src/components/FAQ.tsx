import { useState } from "react";
import { Plus } from "lucide-react";
import Reveal from "./Reveal";

// Facts describe the currently available demo, not future paid plans.
const FAQ_ITEMS = [
  {
    q: "Что такое Neura?",
    a: "Neura — AI-инструмент для создания маркетингового контента: постов, писем, рекламы и сценариев Reels. Опишите задачу, выберите формат и тон. Время ответа зависит от модели, нагрузки сервиса и соединения.",
  },
  {
    q: "Нужны ли регистрация и данные карты?",
    a: "Карта не нужна. Гостям доступно 5 генераций в день, после входа в аккаунт — 20. Авторизация работает через Supabase Auth. Pro и Team пока представлены как демонстрационные тарифы: платежи и платные подписки не подключены.",
  },
  {
    q: "Какая AI-модель используется?",
    a: "Генерация работает через NVIDIA NIM с моделью openai/gpt-oss-20b. Задача и выбранный тон передаются сервису для получения ответа. Neura не даёт отдельных гарантий об использовании данных провайдером для обучения — перед отправкой учитывайте его условия обработки данных.",
  },
  {
    q: "Можно ли использовать тексты для коммерческих задач?",
    a: "Neura помогает готовить черновики для маркетинговых задач. Перед публикацией проверьте факты, соответствие требованиям площадки и возможные права третьих лиц. AI-ответ может содержать ошибки; Neura не гарантирует уникальность текста или исключительные права на него.",
  },
  {
    q: "Сохраняется ли история генераций?",
    a: "Да. В гостевом режиме история сохраняется в localStorage этого браузера. После входа новые завершённые генерации сохраняются в Supabase и доступны на других устройствах с тем же аккаунтом. Гостевая история автоматически в аккаунт не переносится. При ошибке сохранения готовый текст остаётся на экране, а сохранение можно повторить.",
  },
  {
    q: "Когда обновляется дневной лимит?",
    a: "Лимиты — 5 генераций в день для гостя и 20 для аккаунта — сбрасываются в 00:00 UTC. При исчерпании лимита вернитесь после сброса. Выбор демонстрационного Pro или Team не увеличивает квоту: оплаты пока нет. Попытка генерации может расходовать лимит даже при ошибке сервиса.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative bg-bg py-24 md:py-40">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal>
          <div className="max-w-3xl mb-16 md:mb-24">
            <p className="text-xs font-display tracking-[0.2em] uppercase text-muted mb-4">
              Вопросы
            </p>
            <h2
              className="text-ink font-display"
              style={{
                fontSize: "32px",
                lineHeight: 1,
                letterSpacing: "-0.01em",
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
                <div className="border-b border-ink/[0.08]">
                  <h3>
                    <button
                      id={`faq-question-${i}`}
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="min-h-11 w-full flex items-center justify-between gap-6 py-6 text-left transition-transform duration-200 motion-reduce:transition-none motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 group"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${i}`}
                    >
                      <span
                        className={`font-display transition-transform duration-200 motion-reduce:transition-none motion-reduce:transition-none ${
                          isOpen
                            ? "text-accent-ink"
                            : "text-ink group-hover:text-accent-ink"
                        }`}
                        style={{ fontSize: "18px", lineHeight: 1.4 }}
                      >
                        {item.q}
                      </span>
                      <Plus
                        size={20}
                        aria-hidden="true"
                        className={`flex-shrink-0 text-accent-ink transition-transform duration-200 motion-reduce:transition-none motion-reduce:transition-none ${
                          isOpen ? "rotate-45" : "rotate-0"
                        }`}
                      />
                    </button>
                  </h3>

                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                    className="grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity,visibility] duration-[400ms] ease-out [&[hidden]]:!grid [&[hidden]]:grid-rows-[0fr] [&[hidden]]:opacity-0 [&[hidden]]:invisible motion-reduce:transition-none"
                    hidden={!isOpen}
                  >
                    <div className="min-h-0 overflow-hidden"><p
                      className="text-muted pb-6 pr-0 sm:pr-8"
                      style={{ fontSize: "16px", lineHeight: 1.7 }}
                    >
                      {item.a}
                    </p></div>
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
