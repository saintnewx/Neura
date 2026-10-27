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
    <footer className="mn-footer">
      <div className="mn-container">
        <div className="mn-footer-top">
          <div className="mn-footer-brand">
            <Link to="/" className="mn-brand" aria-label="Neura — на главную"><span className="mn-brand-mark" aria-hidden="true">n</span>Neura</Link>
            <p>Больше идей.<br />Меньше рутины.</p>
          </div>
          <nav aria-label="Навигация в подвале" className="mn-footer-nav">
            {groups.map(group => <div key={group.title}><h3>{group.title}</h3><ul>{group.links.map(([label, href]) => <li key={label}><Link to={href}>{label}</Link></li>)}</ul></div>)}
          </nav>
        </div>
        <div className="mn-footer-disclosures">
          <section id="legal" aria-labelledby="demo-terms-heading">
            <h3 id="demo-terms-heading">Условия демо</h3>
            <p>Neura доступна в бесплатном режиме: 5 генераций в день для гостей и 20 для аккаунтов. Лимиты сбрасываются в 00:00 UTC. Pro и Team — демонстрационные тарифы; платежи и платные подписки не подключены. Ответы AI могут содержать ошибки: проверьте факты и пригодность текста перед публикацией.</p>
          </section>
          <section id="data-use" aria-labelledby="data-use-heading">
            <h3 id="data-use-heading">Обработка данных</h3>
            <p>Вход и регистрация работают через Supabase Auth. Гостевая история сохраняется в этом браузере, история новых завершённых генераций после входа — в Supabase. Дополнительный контекст в облачную историю пока не записывается. Задача, контекст и тон передаются NVIDIA NIM (openai/gpt-oss-20b). Учитывайте условия провайдеров и не отправляйте конфиденциальную информацию.</p>
          </section>
        </div>
        <div className="mn-footer-bottom"><p>© {new Date().getFullYear()} Neura</p><span>Пространство для ваших идей.</span></div>
      </div>
    </footer>
  );
}
