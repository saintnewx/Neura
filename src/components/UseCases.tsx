import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Four formats supported by the existing generator. Selection is local only.
const FORMATS = [
  { name: "Пост", channel: "Социальные сети", task: "Расскажи об осеннем меню кофейни. Без акций и скидок.",
    title: "Пауза, которая кстати.",
    text: "Пусть осень будет не только списком дел, но и временем для себя. Выберите напиток из осеннего меню — и на несколько минут отложите всё остальное.\n\nКакое настроение у вашего кофе сегодня?" },
  { name: "Email", channel: "Рассылка", task: "Пригласи читателей познакомиться с осенним меню кофейни.",
    title: "Тема: Немного осени в вашем дне",
    text: "Здравствуйте!\n\nИногда для смены настроения достаточно небольшой паузы. Приглашаем познакомиться с осенним меню и выбрать то, что вам по вкусу.\n\nЗагляните в меню — возможно, там найдётся повод замедлиться." },
  { name: "Реклама", channel: "Рекламный текст", task: "Напиши короткую рекламу осеннего меню кофейни. Без неподтверждённых обещаний.",
    title: "Меньше спешки. Больше осени.",
    text: "Выберите настроение в осеннем меню кофейни. Для короткой паузы, разговора или просто момента наедине с собой.\n\nПознакомьтесь с меню." },
  { name: "Reels", channel: "Сценарий видео", task: "Предложи сценарий Reels об осеннем меню кофейни.",
    title: "Идея: «Поставьте день на паузу»",
    text: "Кадр 1. Быстрая смена повседневных дел. Текст: «Когда всё слишком быстро».\n\nКадр 2. Крупный план чашки. Ритм замедляется. Текст: «Найдите свой момент».\n\nФинал. Покажите осеннее меню. Призыв: «Выберите напиток под настроение»." },
] as const;

export default function UseCases() {
  const [selected, setSelected] = useState(0);
  const example = FORMATS[selected];
  return (
    <section id="story" className="mn-section mn-story" aria-labelledby="story-title">
      <div className="mn-container">
        <div className="mn-story-heading">
          <div><p className="mn-label">Как работает</p><h2 id="story-title">Одна идея.<br />Разные форматы.</h2></div>
          <p className="mn-lead">Выберите формат, добавьте нужные детали, получите черновик. Последнее слово — всегда за вами.</p>
        </div>
        <div className="mn-story-layout">
          <div className="mn-story-choices">
            <div role="group" aria-label="Формат демонстрационного материала" className="mn-format-choices">
              {FORMATS.map((item, index) => (
                <button key={item.name} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>
                  <span>{item.name}<small>{item.channel}</small></span><ArrowRight size={18} aria-hidden="true" />
                </button>
              ))}
            </div>
            <Link to="/app" className="mn-inline-link">Создать свой текст <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="mn-story-example" aria-live="polite">
            <div className="mn-story-request"><span className="mn-sample-label">Задание</span><p>{example.task}</p></div>
            <div key={example.name} className="mn-story-draft"><span className="mn-sample-label">Пример результата · {example.name}</span><h3>{example.title}</h3><p>{example.text}</p></div>
            <p className="mn-story-disclosure">Иллюстрация формата. Тексты подготовлены заранее, AI-запрос не выполняется.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
