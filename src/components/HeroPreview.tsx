import { FileText } from "lucide-react";

// A fixed example, not an interactive generator: no requests, timers or simulated states.
export default function HeroPreview() {
  return (
    <figure
      aria-label="Пример задачи и готового маркетингового текста"
      className="m-0 min-w-0 rounded-2xl border border-neura-border bg-neura-bg-elevated"
    >
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-neura-border px-5 py-5 sm:px-7">
        <span className="text-sm font-semibold tracking-tight text-neura-foreground">
          Neura Studio
        </span>
        <span className="rounded-md border border-neura-border px-2.5 py-1 text-xs font-medium text-neura-accent-text">
          Демонстрация
        </span>
      </figcaption>

      {/* Request and result are intentionally separated by surface and typography. */}
      <div className="space-y-7 p-5 sm:p-7">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-neura-muted">
            Ваша задача
          </p>
          <p className="rounded-xl border border-neura-border bg-neura-bg-base p-4 text-sm font-normal leading-[1.7] text-neura-foreground sm:text-base">
            Напиши пост для кофейни об открытии нового зала. Тон: дружелюбный.
          </p>
        </div>

        <div>
          <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-neura-accent-text">
            <FileText size={16} aria-hidden="true" />
            Готовый текст
          </p>
          <p className="text-lg font-normal leading-[1.65] tracking-[-0.01em] text-neura-foreground sm:text-[22px]">
            У нас стало больше места для ваших встреч. Новый зал открыт —
            приходите за кофе и оставайтесь подольше.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-neura-border pt-4 text-xs font-normal text-neura-muted">
          <span>Формат: Пост</span>
          <span>Тон: Дружелюбный</span>
        </div>
      </div>
    </figure>
  );
}
