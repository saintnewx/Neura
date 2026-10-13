import { Link } from "react-router-dom";

// Only existing routes and landing anchors; social accounts are not configured.
const groups = [
  {
    title: "Продукт",
    links: [
      ["Возможности", "/#features"],
      ["Демо-тарифы", "/#pricing"],
      ["Рабочая область", "/app"],
    ],
  },
  {
    title: "Компания",
    links: [
      ["О продукте", "/#features"],
      ["Войти в Neura", "/auth"],
    ],
  },
  {
    title: "Ресурсы",
    links: [
      ["Попробовать генерацию", "/#demo"],
      ["Частые вопросы", "/#faq"],
    ],
  },
  {
    title: "Правовое",
    links: [
      ["Условия демо", "/#legal"],
      ["Обработка данных", "/#data-use"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/[0.08] bg-bg py-24 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        {/* Brand and calm, consistent navigation. */}
        <div className="mb-12 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <Link
            to="/"
            aria-label="Neura — на главную"
            className="inline-flex min-h-11 items-center self-start text-2xl font-display tracking-tight text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
          >
            Neura<span className="text-accent-ink">.</span>
          </Link>
          <p className="text-sm leading-relaxed text-muted">
            Больше идей. Меньше рутины.
          </p>
        </div>
        <nav
          aria-label="Навигация в подвале"
          className="grid grid-cols-1 gap-x-8 gap-y-8 min-[375px]:grid-cols-2 md:grid-cols-4"
        >
          {groups.map((group) => (
            <div key={group.title} className="min-w-0">
              <h3 className="mb-3 text-sm font-display text-ink">
                {group.title}
              </h3>
              <ul>
                {group.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="inline-flex min-h-11 max-w-full items-center py-2 text-sm leading-relaxed text-muted transition-transform duration-150 hover:text-ink motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Visible demo disclosure; these are not links to nonexistent legal pages. */}
        <section
          id="legal"
          aria-labelledby="demo-terms-heading"
          className="mt-12 scroll-mt-24 border-t border-ink/[0.08] pt-8"
        >
          <h3
            id="demo-terms-heading"
            className="mb-3 text-sm font-display text-ink"
          >
            Условия демо
          </h3>
          <p className="max-w-3xl text-sm leading-relaxed text-muted">
            Neura доступна в бесплатном режиме: 5 генераций в день для гостей и
            20 для аккаунтов. Лимиты сбрасываются в 00:00 UTC. Pro и Team —
            демонстрационные тарифы; платежи и платные подписки не подключены.
            Логотипы и отзывы на лендинге приведены как демонстрационные
            примеры. Ответы AI могут содержать ошибки: проверьте факты и
            пригодность текста перед публикацией.
          </p>
          <div id="data-use" className="mt-6 scroll-mt-24">
            <h3 className="mb-3 text-sm font-display text-ink">
              Обработка данных
            </h3>
            <p className="max-w-3xl text-sm leading-relaxed text-muted">
              Вход и регистрация работают через Supabase Auth. Гостевая история
              сохраняется в этом браузере, а история новых завершённых генераций
              после входа — в Supabase для доступа с других устройств. Задача и
              тон передаются NVIDIA NIM (openai/gpt-oss-20b) для генерации
              ответа. Учитывайте условия обработки данных провайдерами и не
              отправляйте конфиденциальную информацию. Для загрузки шрифта
              браузер обращается к Google Fonts.
            </p>
          </div>
        </section>
        <div className="mt-10 border-t border-ink/[0.08] pt-6">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Neura
          </p>
        </div>
      </div>
    </footer>
  );
}
