import { useState } from "react";
import { Plus } from "lucide-react";

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
    a: "Генерация работает через NVIDIA NIM с моделью openai/gpt-oss-20b. Задача, дополнительный контекст и выбранный тон передаются сервису для получения ответа. Neura не даёт отдельных гарантий об использовании данных провайдером для обучения — перед отправкой учитывайте его условия обработки данных.",
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
    <section id="faq" className="mn-section mn-faq" aria-labelledby="faq-title">
      <div className="mn-container mn-faq-layout">
        <div><p className="mn-label">Без недосказанности</p><h2 id="faq-title">Хорошие<br />вопросы.</h2><p className="mn-lead">Что важно знать перед началом работы.</p></div>
        <div className="mn-faq-list">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = open === index;
            return (
              <div className="mn-faq-item" key={item.q}>
                <h3>
                  <button id={`faq-question-${index}`} type="button" onClick={() => setOpen(isOpen ? null : index)}
                    aria-expanded={isOpen} aria-controls={`faq-answer-${index}`}>
                    <span>{item.q}</span><Plus size={20} aria-hidden="true" />
                  </button>
                </h3>
                <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} className="mn-faq-answer" hidden={!isOpen}><p>{item.a}</p></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
