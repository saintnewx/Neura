import { useState } from "react";
import { ArrowRight, FileText, History, LayoutTemplate, MessageSquare, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const TONE_EXAMPLES = [
  { tone: "Дружелюбный", text: "Давайте сделаем паузу. Кофе и немного времени для себя — уже хороший план." },
  { tone: "Официальный", text: "Приглашаем познакомиться с меню кофейни и выбрать напиток по вашему вкусу." },
  { tone: "Дерзкий", text: "Дела подождут. Ваш кофе — нет. Самое время переключиться." },
];

// UI samples illustrate existing controls; they never submit generation requests.
export default function BentoGrid() {
  const [tone, setTone] = useState(0);
  return (
    <section id="features" className="mn-section" aria-labelledby="features-title">
      <div className="mn-container">
        <div className="mn-section-heading">
          <p className="mn-label">Возможности</p>
          <h2 id="features-title">Место, где идеи<br className="hidden sm:block" /> обретают форму.</h2>
          <p className="mn-lead">От первого задания до сохранённого черновика. Всё нужное для работы с текстом — рядом.</p>
        </div>
        <div className="mn-feature-grid">
          <article className="mn-feature mn-feature-context">
            <MessageSquare className="mn-feature-icon" size={22} aria-hidden="true" />
            <h3>Ваши детали.<br />Ваш контекст.</h3>
            <p>Расскажите о продукте и аудитории. Передайте AI факты, на которые должен опираться текст.</p>
            <div className="mn-context-sample">
              <span className="mn-sample-label">Пример дополнительного контекста</span>
              <p>Кофейня в Алматы. Аудитория — студенты. Есть тихий зал для работы.</p>
              <div className="mn-context-tags"><span>Продукт</span><span>Аудитория</span><span>Особенности</span></div>
            </div>
          </article>
          <article className="mn-feature mn-feature-tone">
            <SlidersHorizontal className="mn-feature-icon" size={22} aria-hidden="true" />
            <h3>Тот самый тон.</h3>
            <p>Выберите интонацию под задачу. В рабочей области доступны шесть вариантов.</p>
            <div className="mn-tone-sample" role="group" aria-label="Тон демонстрационного текста">
              {TONE_EXAMPLES.map((item, index) => <button key={item.tone} type="button" aria-pressed={tone === index} onClick={() => setTone(index)}>{item.tone}</button>)}
            </div>
            <p className="mn-tone-result" aria-live="polite">{TONE_EXAMPLES[tone].text}</p>
            <span className="mn-sample-label">Заранее подготовленные примеры</span>
          </article>
          <article className="mn-feature mn-feature-small">
            <LayoutTemplate className="mn-feature-icon" size={22} aria-hidden="true" />
            <h3>Начните с задачи.</h3>
            <p>12 шаблонов для постов, писем, офферов и других маркетинговых материалов.</p>
            <ul className="mn-template-sample" aria-label="Примеры доступных шаблонов">
              {["Instagram Post", "Email Campaign", "Product Description"].map(name => <li key={name}><FileText size={15} aria-hidden="true" />{name}<ArrowRight size={14} aria-hidden="true" /></li>)}
            </ul>
            <Link to="/app" className="mn-inline-link">Открыть шаблоны <ArrowRight size={16} aria-hidden="true" /></Link>
          </article>
          <article className="mn-feature mn-feature-small">
            <History className="mn-feature-icon" size={22} aria-hidden="true" />
            <h3>Возвращайтесь к идеям.</h3>
            <p>Сохраняйте завершённые генерации. После входа история доступна на других устройствах.</p>
            <div className="mn-history-sample">
              <span className="mn-sample-label">Пример истории</span>
              <div><span>Пост об осеннем меню</span><small>Пост</small></div>
              <div><span>Письмо о новом продукте</span><small>Email</small></div>
            </div>
          </article>
          <article className="mn-feature mn-feature-small">
            <FileText className="mn-feature-icon" size={22} aria-hidden="true" />
            <h3>Черновик — только начало.</h3>
            <p>Получайте ответ по мере генерации. Копируйте готовый текст или скачивайте TXT для дальнейшей работы.</p>
            <div className="mn-format-sample"><span>Пост</span><span>Email</span><span>Реклама</span><span>Reels</span></div>
            <p className="mn-feature-footnote">Перед публикацией проверьте факты и отредактируйте текст.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
