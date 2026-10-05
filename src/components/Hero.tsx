import { useEffect, useState } from "react";
import { Check, Coffee, Mail, Play, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

// Short examples finish typing before the next 3-second cycle.
const examples = [
  {
    label: "Пост для кофейни",
    icon: Coffee,
    task: "Уютный пост о новом сезонном латте",
    text: "Осень в твоей чашке. Пряный латте уже ждёт. Заходи ☕",
  },
  {
    label: "Email для SaaS",
    icon: Mail,
    task: "Письмо о запуске новой функции",
    text: "Меньше рутины. Больше результата. Попробуй новый AI.",
  },
  {
    label: "Реклама для фитнеса",
    icon: Zap,
    task: "Реклама первой тренировки в студии",
    text: "Твоя лучшая форма начинается здесь. Первый шаг — наш.",
  },
];

// Animated product preview; reduced-motion users see complete text.
export default function Hero() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);
  const example = examples[exampleIndex];
  const ExampleIcon = example.icon;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setVisibleText(example.text);
      return;
    }
    setVisibleText("");
    let length = 0;
    const characters = Array.from(example.text);
    const typing = window.setInterval(() => {
      length += 1;
      setVisibleText(characters.slice(0, length).join(""));
      if (length >= characters.length) window.clearInterval(typing);
    }, 50);
    const next = window.setTimeout(
      () => setExampleIndex((index) => (index + 1) % examples.length),
      3000,
    );
    return () => {
      window.clearInterval(typing);
      window.clearTimeout(next);
    };
  }, [example, reducedMotion]);

  return (
    <section className="hero-glow relative overflow-hidden pb-16 pt-16 lg:pb-20 lg:pt-24">
      <div
        aria-hidden="true"
        className="hero-grid pointer-events-none absolute inset-0"
      />
      <div className="container-page relative grid items-center gap-14 lg:grid-cols-[1.12fr_1fr] lg:gap-10">
        {/* Headline and primary product actions. */}
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3.5 py-2 text-xs font-medium tracking-wide text-accent">
            <Sparkles size={14} /> AI ДЛЯ ВАШИХ ИДЕЙ
          </div>
          <h1>
            Забудь о<br />
            <span className="gradient-text">
              Writer's
              <br />
              Block.
            </span>
          </h1>
          <p className="mt-7 max-w-md text-lg leading-[1.65] text-muted">
            Neura генерирует тексты, которые конвертируют, а не просто заполняют
            страницы.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/app" className="btn-primary">
              Начать бесплатно
            </Link>
            <a href="#demo" className="btn-secondary">
              <Play size={16} />
              Смотреть демо
            </a>
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-muted">
            <Check size={14} className="text-accent" /> Без карты{" "}
            <span className="mx-1 text-line">/</span> 10 генераций бесплатно
          </p>
        </div>
        {/* Live typewriter card with three sample content formats. */}
        <div className="relative mb-7 mt-2 lg:mt-12">
          <div
            aria-hidden="true"
            className="absolute -inset-8 -z-10 rounded-full bg-accent-2/10 blur-3xl"
          />
          <div className="generator-frame rounded-[22px] p-px shadow-[0_20px_100px_rgba(0,0,0,0.35)]">
            <div className="overflow-hidden rounded-[21px] bg-card">
              <div className="flex items-center justify-between border-b border-line/70 px-6 py-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles size={16} className="text-accent" />
                  Neura Studio
                </div>
                <span className="rounded-md border border-line bg-bg/40 px-2 py-0.5 text-[11px] font-medium tracking-wider text-muted">
                  AI WORKSPACE
                </span>
              </div>
              <div className="p-6 sm:p-7">
                <p className="eyebrow mb-3">Ваша идея</p>
                <div className="flex min-h-[76px] items-center gap-3 rounded-xl border border-line bg-bg/50 p-4 text-sm leading-relaxed">
                  <ExampleIcon size={19} className="shrink-0 text-muted" />
                  {example.task}
                </div>
                <div className="my-5 flex flex-wrap gap-2">
                  {["Пост", "Email", "Реклама"].map((label, index) => (
                    <span
                      key={label}
                      className={`rounded-lg border px-3 py-1.5 text-xs ${index === exampleIndex ? "border-accent/25 bg-accent/10 text-accent" : "border-line/60 text-muted"}`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <div className="min-h-[160px] rounded-xl border border-accent/15 bg-gradient-to-br from-accent/[0.04] to-accent-2/[0.06] p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs font-medium text-accent">
                    <Sparkles size={13} />
                    {example.label}
                  </div>
                  <p
                    aria-hidden="true"
                    className="min-h-[80px] text-xl font-medium leading-relaxed"
                  >
                    {visibleText}
                    <span className="cursor ml-0.5 text-accent">|</span>
                  </p>
                  <span className="sr-only">{example.text}</span>
                </div>
                <div className="mt-5 flex items-center justify-between text-xs text-muted">
                  <span>От идеи до текста</span>
                  <span className="flex items-center gap-1.5">
                    <Zap size={13} className="text-accent" /> за секунды
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 right-3 flex items-center gap-3 rounded-xl border border-line bg-[#191D31] px-5 py-3 shadow-xl sm:right-6">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success">
              <Check size={17} />
            </span>
            <div>
              <p className="text-sm font-medium">Идея стала текстом</p>
              <p className="text-xs text-muted">
                Осталось нажать «Опубликовать»
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
