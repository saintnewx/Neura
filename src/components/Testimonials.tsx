import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Unverified endorsements are replaced with supported workflows, not new claims.
const AUDIENCES = [
  { id: "01", name: "Маркетологам", detail: "Подготовить варианты рекламного текста, письма или оффера на основе одного задания.", format: "Реклама · Email · Оффер" },
  { id: "02", name: "SMM и авторам", detail: "Найти первую строку поста, сменить интонацию или собрать черновик сценария для Reels.", format: "Пост · Reels · Контент-план" },
  { id: "03", name: "Малому бизнесу", detail: "Рассказать о продукте своими словами: передать факты, выбрать тон и доработать черновик.", format: "Описание товара · Brand Bio" },
];
export default function Testimonials() {
  return (
    <section id="testimonials" className="mn-section mn-audience" aria-labelledby="audience-title">
      <div className="mn-container">
        <div className="mn-section-heading">
          <p className="mn-label">Для вашей работы</p>
          <h2 id="audience-title">Есть что сказать.<br />Найдём форму.</h2>
        </div>
        <div className="mn-audience-list">
          {AUDIENCES.map(item => (
            <article key={item.id}><span className="mn-audience-index" aria-hidden="true">{item.id}</span><h3>{item.name}</h3><p>{item.detail}</p><span className="mn-audience-format">{item.format}</span></article>
          ))}
        </div>
        <div className="mn-start">
          <div><h3>Начните с одной идеи.</h3><p>Вы выбираете, что сказать. Neura помогает с формулировкой.</p></div>
          <Link to="/app" className="mn-button mn-button-primary">Открыть Neura <ArrowRight aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
