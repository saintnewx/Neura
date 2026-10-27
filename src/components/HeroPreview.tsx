import { useEffect, useRef, useState } from "react";
import { Check, Copy, ArrowDown, FileText } from "lucide-react";

// Fixed illustrative drafts: no inference, quota, artificial streaming, or timers.
const EXAMPLES = [
  {
    id: "post", label: "Пост", template: "Instagram Post", tone: "Дружелюбный",
    task: "Напиши пост для кофейни об осеннем меню",
    result: "Осень — повод чуть меньше спешить. Обнять ладонями чашку кофе, выдохнуть и выбрать что-нибудь под настроение.\n\nЗнакомьтесь с осенним меню. Каким будет ваш вкус этой осени?",
  },
  {
    id: "email", label: "Email", template: "Email Campaign", tone: "Дружелюбный",
    task: "Напиши письмо с приглашением посмотреть осеннее меню кофейни",
    result: "Тема: Время для осенней паузы\n\nВ повседневных делах легко забыть о маленьких радостях. Пусть знакомство с осенним меню станет одной из них.\n\nВыберите то, что вам по настроению.",
  },
  {
    id: "ad", label: "Реклама", template: "Ad Copy", tone: "Дружелюбный",
    task: "Напиши рекламный текст об осеннем меню кофейни, без акций и скидок",
    result: "Осень меняет ритм. А вы выбираете настроение.\n\nОткройте для себя осеннее меню кофейни — и найдите повод сделать паузу.",
  },
] as const;

export default function HeroPreview() {
  const [selected, setSelected] = useState(0);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const current = useRef(0);
  const mounted = useRef(false);
  const example = EXAMPLES[selected];
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  async function copyExample() {
    const snapshot = selected;
    try {
      await navigator.clipboard.writeText(example.result);
      if (!mounted.current || current.current !== snapshot) return;
      setCopied(true);
      setNotice("Пример скопирован");
    } catch {
      if (mounted.current && current.current === snapshot)
        setNotice("Не удалось скопировать. Выделите текст примера вручную.");
    }
  }
  return (
    <div className="mn-preview" aria-label="Пример работы Neura Studio">
      <div className="mn-preview-top">
        <span className="mn-studio-name"><FileText size={18} aria-hidden="true" />Neura Studio</span>
        <span className="mn-example-badge">Демонстрация</span>
      </div>
      <div className="mn-preview-tabs" role="group" aria-label="Формат примера">
        {EXAMPLES.map((item, index) => (
          <button key={item.id} type="button" aria-pressed={selected === index}
            onClick={() => { current.current = index; setSelected(index); setNotice(""); setCopied(false); }}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="mn-preview-input">
        <div className="mn-preview-meta"><span>{example.template}</span><span>{example.tone}</span></div>
        <p className="mn-preview-field-label">Ваша идея</p>
        <p>{example.task}</p>
      </div>
      <div className="mn-preview-flow"><ArrowDown size={16} aria-hidden="true" /><span>Идея становится черновиком</span></div>
      <div className="mn-preview-result">
        <div className="mn-preview-result-title"><span className="mn-status-dot" aria-hidden="true" />Пример результата</div>
        <p key={example.id} className="mn-preview-text">{example.result}</p>
      </div>
      <div className="mn-preview-bottom">
        <span>Заранее подготовленный пример</span>
        <button type="button" onClick={() => void copyExample()} aria-label="Копировать пример">
          {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          {copied ? "Готово" : "Копировать"}
        </button>
      </div>
      <p role="status" aria-live="polite" className="mn-preview-notice">{notice}</p>
    </div>
  );
}
