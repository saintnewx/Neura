import { Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

// Section destinations keep navigation useful without fabricated pages.
const groups = [
  {
    title: "Продукт",
    links: [
      ["Возможности", "#product"],
      ["Тарифы", "#pricing"],
      ["Попробовать", "/app"],
    ],
  },
  {
    title: "Компания",
    links: [
      ["О Neura", "#product"],
      ["Наши пользователи", "#testimonials"],
    ],
  },
  {
    title: "Ресурсы",
    links: [
      ["Демо", "#demo"],
      ["Частые вопросы", "#faq"],
    ],
  },
  {
    title: "Правовое",
    links: [
      ["Условия использования", "#legal"],
      ["Конфиденциальность", "#legal"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line/60 bg-card/20 pb-8 pt-16">
      <div className="container-page">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            Neura<span className="text-accent">.</span>
          </Link>
          <p className="text-sm text-muted">
            Ваши идеи заслуживают нужных слов.
          </p>
        </div>
        <nav
          aria-label="Навигация в подвале"
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-5 text-sm font-semibold tracking-normal">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith("/") ? (
                      <Link
                        to={href}
                        className="text-sm text-muted transition-colors hover:text-accent"
                      >
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        className="text-sm text-muted transition-colors hover:text-accent"
                      >
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        {/* Actual demo terms and data handling, rather than inactive legal links. */}
        <details
          id="legal"
          className="mt-10 rounded-xl border border-line/50 px-4 py-3 text-xs text-muted"
        >
          <summary className="cursor-pointer text-sm">
            Условия демо и конфиденциальность
          </summary>
          <p className="mt-3 leading-relaxed">
            Это демонстрационный интерфейс: тарифы, логотипы и отзывы приведены
            как примеры. Оплата и регистрация не подключены. Введённая задача
            обрабатывается локальной заглушкой, не отправляется AI-провайдеру и
            не сохраняется после ухода со страницы. Google Fonts получает
            стандартные сетевые данные для загрузки шрифта. Не вводите
            конфиденциальную информацию. При подключении реального API
            необходимо опубликовать актуальные условия и политику обработки
            данных.
          </p>
        </details>
        <div className="mt-8 flex flex-col items-center justify-between gap-5 border-t border-line/60 pt-7 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Neura. Все права защищены.
          </p>
          <div className="flex gap-5">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X / Twitter"
              className="text-muted transition-colors hover:text-accent"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-muted transition-colors hover:text-accent"
            >
              <Github size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-muted transition-colors hover:text-accent"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
