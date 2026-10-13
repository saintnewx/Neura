import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";

const MeshGradient = lazy(() => import("@paper-design/shaders-react").then(module => ({ default: module.MeshGradient })));
const EXAMPLES = {
  Дружелюбный: "Друзья, у нас новость! ☕ В субботу открываем двери нашей кофейни в центре города. Свежая обжарка, домашняя выпечка и места, где приятно задержаться. Приходите с друзьями, первый капучино за наш счёт!",
  Дерзкий: "Хватит пить кофе из бумажного стакана на бегу. В субботу открываемся: со вкусом, который запомнится, и выпечкой, которую вы съедите раньше, чем скажете «ещё одну». Первый капучино бесплатно. Если успеете.",
  Экспертный: "Открытие в субботу: кофе собственной обжарки, эспрессо и фильтр на выбор. Помол подбираем под каждую партию зерна. Первый капучино за счёт заведения. Адрес и часы работы в профиле.",
} as const;
type Tone = keyof typeof EXAMPLES;
type Phase = "idle" | "fading" | "waiting" | "typing" | "done";
const GRADIENT = "radial-gradient(60% 60% at 50% 40%, #FFD9CB 0%, rgba(250,248,245,0) 70%)";
const COLORS = ["#FFD9C9", "#FFC2C0", "#FDE7C8", "#FAF8F5"];

// A failed optional shader leaves the static background and product example intact.
class ShaderFallback extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

// Isolated presentation state. These examples never reserve quota or enter history.
export default function HeroPreview() {
  const root = useRef<HTMLDivElement>(null);
  const clicked = useRef(false);
  const [tone, setTone] = useState<Tone>("Дружелюбный");
  const [replay, setReplay] = useState(0);
  const [started, setStarted] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [shaderAllowed, setShaderAllowed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [text, setText] = useState("");

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      setReduced(motion.matches);
      setShaderAllowed(desktop.matches && !motion.matches);
    };
    update();
    motion.addEventListener("change", update);
    desktop.addEventListener("change", update);
    const hero = root.current?.closest("#hero");
    const startObserver = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.4) {
        setStarted(true);
        startObserver.disconnect();
      }
    }, { threshold: 0.4 });
    const visibilityObserver = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (hero) startObserver.observe(hero);
    if (root.current) visibilityObserver.observe(root.current);
    return () => {
      motion.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
      startObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (reduced) { setText(EXAMPLES[tone]); setPhase("done"); return; }
    if (!started) return;
    let timer: number;
    let cancelled = false;
    const characters = Array.from(EXAMPLES[tone]);
    let count = 0;
    const type = () => {
      if (cancelled) return;
      count += 1;
      setText(characters.slice(0, count).join(""));
      setPhase(count === characters.length ? "done" : "typing");
      if (count < characters.length) timer = window.setTimeout(type, 8 + Math.random() * 16);
    };
    if (clicked.current) {
      setPhase("fading");
      timer = window.setTimeout(() => {
        setText(""); setPhase("waiting");
        timer = window.setTimeout(type, 250);
      }, 120);
    } else {
      setPhase("idle");
      timer = window.setTimeout(type, 600);
    }
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [tone, replay, started, reduced]);

  return (
    <div ref={root} className="relative mx-auto mt-10 h-[300px] max-w-[920px] px-5 text-left md:mt-16 md:h-[320px] md:max-w-[768px] md:px-6 lg:max-w-[928px]">
      {/* Keep fallback beneath the lazy shader, including WebGL failures. */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-20 left-1/2 h-[420px] w-[120%] -translate-x-1/2" style={{ background: GRADIENT, maskImage: "radial-gradient(closest-side, black 55%, transparent 100%)" }}>
        {shaderAllowed && <ShaderFallback><Suspense fallback={null}>
          <MeshGradient colors={COLORS} distortion={0.7} swirl={0.1} speed={visible ? 0.15 : 0} grainMixer={0} grainOverlay={0} maxPixelCount={900000} className="h-full w-full" />
        </Suspense></ShaderFallback>}
      </div>
      <div className="relative h-full overflow-hidden [mask-image:linear-gradient(to_bottom,black_calc(100%-48px),transparent)]">
        <div className="h-[460px] rounded-[24px] bg-white/[0.94] p-4 shadow-hero supports-[backdrop-filter:blur(1px)]:bg-white/[0.62] supports-[backdrop-filter:blur(1px)]:backdrop-blur-[16px] motion-safe:animate-preview-rise md:h-[520px] md:rounded-card-lg md:p-6 md:backdrop-saturate-[160%] md:supports-[backdrop-filter:blur(1px)]:backdrop-blur-[24px]">
          <div className="flex items-center justify-between gap-3">
            <div className="relative min-w-0">
              <div role="group" aria-label="Тон примера" className="flex snap-x gap-2 overflow-x-auto pr-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:pr-0">
                {(Object.keys(EXAMPLES) as Tone[]).map(item => (
                  <button key={item} type="button" aria-pressed={tone === item} onClick={() => { clicked.current = true; setStarted(true); setTone(item); setReplay(value => value + 1); }} className={`min-h-11 shrink-0 snap-start rounded-pill border px-3.5 text-sm font-display transition-transform duration-[120ms] motion-safe:active:scale-[0.97] focus-visible:-outline-offset-4 focus-visible:outline-accent-ink motion-reduce:transition-none md:px-4 ${tone === item ? "border-ink bg-ink text-white" : "border-ink/[0.08] bg-white/70 text-[#444444] hover:bg-white"}`}>
                    {item}
                  </button>
                ))}
              </div>
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#FFFCFA] to-transparent md:hidden" />
            </div>
            <span className="hidden shrink-0 text-xs text-muted md:block">Пример генерации</span>
          </div>
          <p className="mt-4 flex min-h-[52px] items-center rounded-[14px] border border-ink/[0.08] bg-white/[0.85] px-4 py-2 text-[15px] font-body leading-snug text-ink md:h-14 md:py-0 md:text-base">
            Открываем кофейню в центре города, нужен пост для Instagram
          </p>
          <p className="mt-2 text-xs text-muted md:hidden">Пример генерации</p>
          <div className="mt-5 min-h-[220px] rounded-[14px] bg-glass-strong p-4 text-[15px] font-body leading-[1.55] text-ink md:text-base md:leading-[1.6]">
            <div aria-hidden="true" className={`transition-opacity duration-[120ms] motion-reduce:transition-none ${phase === "fading" ? "opacity-0" : "opacity-100"}`}>
              {phase === "waiting" ? <span className="flex h-6 items-center gap-1.5">{[0, 1, 2].map(dot => <span key={dot} className="h-1.5 w-1.5 rounded-full bg-muted motion-safe:animate-pulse" style={{ animationDelay: `${dot * 80}ms` }} />)}</span> : <>{text}<span className={`ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-0.5 bg-accent shadow-[0_0_12px_rgba(255,90,95,0.6)] motion-reduce:hidden ${phase === "done" ? "motion-safe:animate-caret-blink" : ""}`} /></>}
            </div>
            <p role="status" aria-live="polite" className="sr-only">{phase === "done" ? `Пример. ${tone}: ${EXAMPLES[tone]}` : "Подготовка примера"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
