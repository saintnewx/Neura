import { useState } from "react";
import { Sparkles, Copy, Download, RefreshCw, Check } from "lucide-react";

type DemoSectionProps = {
  onBeforeGenerate?: (...args: any[]) => any;
  onGenerated?: (...args: any[]) => any;
  disabled?: boolean;
  [key: string]: any;
};

export default function DemoSection(_props: DemoSectionProps) {
  const [task, setTask] = useState("");
  const [type, setType] = useState("Пост");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const example = `🍂 Новинка в нашем меню! 🍂

Сезонные напитки «Осенний шарм» уже в продаже:

— Карамельный эспрессо-тарт — 350 ₽
— Медовый латте с корицей — 400 ₽
— Травяной холодный кофе — 450 ₽

Попробуйте прямо сейчас и почувствуйте, как осень согревает вас изнутри.`;

  const handleGenerate = () => {
    if (task.trim().length < 5) return;
    setLoading(true);
    setResult("");

    // Демонстрация: показываем заранее подготовленный пример
    setTimeout(() => {
      setResult(example);
      setLoading(false);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="demo"
      className="relative py-24 md:py-40"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-16 md:mb-24">
          <p className="text-label uppercase text-text-tertiary mb-4">
            Демонстрация
          </p>
          <h2
            className="text-text-primary font-bold"
            style={{
              fontSize: "clamp(36px, 5.5vw, 80px)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          <DemoSection
  key={user?.id ?? "guest"}
  onBeforeGenerate={workspace.before...}
  onGenerated={workspace.saveGenerat...}
/>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Левая панель */}
          <div className="lg:col-span-2 rounded-panel bg-white/[0.03] border border-white/[0.08] p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={18} className="text-accent" />
              <span
                className="text-text-primary font-semibold"
                style={{ fontSize: "16px" }}
              >
                Создать контент
              </span>
            </div>

            <label
              className="text-text-secondary mb-3 block"
              style={{ fontSize: "13px" }}
            >
              Опишите задачу
            </label>
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Например: напиши дружелюбный пост о новом осеннем меню кофейни..."
              className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 text-text-primary placeholder:text-text-tertiary outline-none focus:border-white/[0.2] transition-colors resize-none mb-4"
              style={{ fontSize: "15px", minHeight: "160px" }}
            />
            <div
              className="text-text-tertiary mb-6 text-right"
              style={{ fontSize: "12px" }}
            >
              {task.length} / 500
            </div>

            <label
              className="text-text-secondary mb-2 block"
              style={{ fontSize: "13px" }}
            >
              Формат
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-4 text-text-primary outline-none focus:border-white/[0.2] transition-colors mb-6 appearance-none"
              style={{ fontSize: "15px", height: "48px" }}
            >
              <option>Пост</option>
              <option>Email</option>
              <option>Реклама</option>
              <option>Reels</option>
            </select>

            <button
              onClick={handleGenerate}
              disabled={task.trim().length < 5 || loading}
              className="mt-auto inline-flex items-center justify-center gap-2 bg-[#F5F5F7] text-[#0D0D0C] rounded-full px-6 font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ minHeight: "52px", fontSize: "17px" }}
            >
              <Sparkles size={18} />
              {loading ? "Генерируем..." : "Сгенерировать"}
            </button>
          </div>

          {/* Правая панель */}
          <div className="lg:col-span-3 rounded-panel bg-white/[0.03] border border-white/[0.08] p-8 flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-accent" />
                <span
                  className="text-text-primary font-semibold"
                  style={{ fontSize: "16px" }}
                >
                  Результат
                </span>
              </div>
              <span
                className="text-text-tertiary border border-white/[0.08] rounded-full px-3 py-1"
                style={{ fontSize: "11px", letterSpacing: "0.1em" }}
              >
                AI CONTENT
              </span>
            </div>

            {!result && !loading && (
              <div className="flex-1 flex items-center justify-center text-center">
                <p
                  className="text-text-tertiary max-w-xs"
                  style={{ fontSize: "15px", lineHeight: 1.6 }}
                >
                  Здесь появится готовый текст. Опишите задачу слева и нажмите
                  «Сгенерировать».
                </p>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col gap-3 pt-2">
                <div className="h-5 bg-white/[0.04] rounded w-3/4 animate-pulse" />
                <div className="h-5 bg-white/[0.04] rounded w-full animate-pulse" />
                <div className="h-5 bg-white/[0.04] rounded w-2/3 animate-pulse" />
                <div className="h-5 bg-white/[0.04] rounded w-5/6 animate-pulse" />
                <div className="h-5 bg-white/[0.04] rounded w-1/2 animate-pulse" />
              </div>
            )}

            {result && !loading && (
              <>
                <div
                  className="flex-1 text-text-primary whitespace-pre-line"
                  style={{ fontSize: "16px", lineHeight: 1.7 }}
                >
                  {result}
                </div>
                <div className="flex flex-wrap gap-3 mt-8">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 border border-white/[0.08] text-text-primary rounded-full px-5 transition-colors hover:border-white/[0.2] hover:bg-white/[0.03]"
                    style={{ minHeight: "44px", fontSize: "14px" }}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Скопировано" : "Копировать"}
                  </button>
                  <button
                    className="inline-flex items-center gap-2 border border-white/[0.08] text-text-primary rounded-full px-5 transition-colors hover:border-white/[0.2] hover:bg-white/[0.03]"
                    style={{ minHeight: "44px", fontSize: "14px" }}
                  >
                    <Download size={16} />
                    Скачать
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="inline-flex items-center gap-2 border border-white/[0.08] text-text-primary rounded-full px-5 transition-colors hover:border-white/[0.2] hover:bg-white/[0.03]"
                    style={{ minHeight: "44px", fontSize: "14px" }}
                  >
                    <RefreshCw size={16} />
                    Перегенерировать
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}