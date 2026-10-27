import { LayoutTemplate, SlidersHorizontal, History, Text } from "lucide-react";

// Confirmed capabilities, not customer endorsements.
const CAPABILITIES = [
  { icon: LayoutTemplate, title: "12 шаблонов", detail: "для маркетинговых задач" },
  { icon: SlidersHorizontal, title: "6 вариантов тона", detail: "для вашего голоса" },
  { icon: Text, title: "Контекст продукта", detail: "детали для точного задания" },
  { icon: History, title: "История генераций", detail: "в облаке после входа" },
];
export default function SocialProof() {
  return (
    <section className="mn-capabilities" aria-label="Возможности Neura">
      <div className="mn-container">
        <ul>
          {CAPABILITIES.map(({ icon: Icon, title, detail }) => (
            <li key={title}><Icon size={20} aria-hidden="true" /><div><strong>{title}</strong><span>{detail}</span></div></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
