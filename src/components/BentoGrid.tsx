import {
  BrainCircuit,
  Layers,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from "lucide-react";

// Four features arranged into a responsive Swiss bento layout.
export default function BentoGrid() {
  return (
    <section id="product" className="section-space container-page">
      <div className="reveal mb-12">
        <p className="eyebrow mb-4">Ваша идея. Возможности AI.</p>
        <h2>
          Почему <span className="gradient-text">Neura</span>
        </h2>
        <p className="mt-5 max-w-xl text-muted">
          Меньше времени на пустой лист. Больше — на то, что двигает ваш бизнес.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-4 lg:grid-rows-2">
        {/* Context is the dominant feature. */}
        <article className="card card-interactive reveal flex flex-col lg:col-span-2 lg:row-span-2">
          <span className="icon-box">
            <BrainCircuit size={24} />
          </span>
          <h3 className="mt-6">Понимает контекст</h3>
          <p className="mt-4 max-w-sm text-muted">
            Ваш продукт, ваша аудитория, ваша цель. Neura связывает всё в текст,
            который говорит на языке клиента.
          </p>
          <div className="relative mt-8 flex min-h-[205px] flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-bg/40 p-5">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,217,255,0.14),transparent_70%)]"
            />
            <div className="relative flex flex-wrap justify-center gap-2">
              <span className="rounded-md border border-line bg-card px-3 py-1 text-xs text-muted">
                Ваш бренд
              </span>
              <span className="rounded-md border border-line bg-card px-3 py-1 text-xs text-muted">
                Аудитория
              </span>
              <span className="rounded-md border border-line bg-card px-3 py-1 text-xs text-muted">
                Цель
              </span>
            </div>
            <div
              aria-hidden="true"
              className="h-7 w-px bg-gradient-to-b from-line to-accent/60"
            />
            <div className="relative flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-6 py-3 text-base font-semibold text-accent">
              <Sparkles size={18} />
              Neura
            </div>
            <div
              aria-hidden="true"
              className="h-7 w-px bg-gradient-to-b from-accent/60 to-line"
            />
            <span className="relative text-xs text-muted">
              Текст, в котором узнают ваш бренд
            </span>
          </div>
        </article>
        {/* Speed, tone, and formats. */}
        <article className="card card-interactive reveal relative overflow-hidden lg:col-span-2">
          <span className="icon-box">
            <Zap size={24} />
          </span>
          <h3 className="mt-6 max-w-sm">
            Скорость — десятки вариантов за секунды
          </h3>
          <p className="mt-4 max-w-sm text-muted">
            От первого черновика до свежих идей для всей кампании. Без часов
            ожидания.
          </p>
          <Zap
            aria-hidden="true"
            size={150}
            strokeWidth={1}
            className="absolute -right-5 top-8 -rotate-12 text-accent/[0.06]"
          />
        </article>
        <article className="card card-interactive reveal">
          <span className="icon-box border-accent-2/20 bg-accent-2/10 text-accent-2">
            <SlidersHorizontal size={24} />
          </span>
          <h3 className="mt-6">Тон и стиль</h3>
          <p className="mt-4 text-base text-muted">
            Дружелюбно, смело или по делу. Просто укажите нужный тон в задаче.
          </p>
        </article>
        <article className="card card-interactive reveal">
          <span className="icon-box">
            <Layers size={24} />
          </span>
          <h3 className="mt-6">4 режима</h3>
          <p className="mt-4 text-base text-muted">
            Посты, email, реклама и Reels. Один инструмент для ваших каналов.
          </p>
        </article>
      </div>
    </section>
  );
}
