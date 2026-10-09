import { useEffect, useState } from "react";
import { Sparkles, Copy, Download, RefreshCw, Check, Lock } from "lucide-react";

const GUEST_LIMIT = 5;
const STORAGE_KEY = "neura_demo_usage";

type Usage = { count: number; date: string };

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getUsage(): Usage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, date: todayKey() };
    const data = JSON.parse(raw) as Usage;
    if (data.date !== todayKey()) return { count: 0, date: todayKey() };
    return data;
  } catch {
    return { count: 0, date: todayKey() };
  }
}

function saveUsage(count: number): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ count, date: todayKey() })
    );
  } catch {
    /* localStorage может быть отключён */
  }
}

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
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<Usage>({ count: 0, date: "" });

  useEffect(() => {
    setUsage(getUsage());
  }, []);

  const remaining = Math.max(0, GUEST_LIMIT - usage.count);
  const limitReached = remaining <= 0 && usage.date !== "";

  const handleGenerate = async () => {
    const trimmed = task.trim();
    if (trimmed.length < 5) return;
    if (limitReached) {
      setError("Дневной лимит исчерпан. Войдите в аккаунт, чтобы получить 20 генераций в день.");
      return;
    }

    setLoading(true);
    setResult("");
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: trimmed, type }),
      });

      if (!res.ok || !res.body) {
        // Ошибки валидации возвращаются JSON'ом
        let message = `Ошибка сервера: ${res.status}`;
        try {
          const data = await res.json();
          if (data?.error) message = String(data.error);
        } catch {
          /* ignore */
        }
        throw new Error(message);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
      let streamError = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() || "";

        for (const block of blocks) {
          if (!block.startsWith("data:")) continue;
          const payload = block.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;

          try {
            const data = JSON.parse(payload) as {
              content?: string;
              error?: string;
            };
            if (data.error) {
              streamError = data.error;
              continue;
            }
            if (data.content) {
              fullText += data.content;
              setResult(fullText);
            }
          } catch {
            /* skip malformed frame */
          }
        }
      }

      if (streamError) {
        setError(streamError);
        return;
      }

      if (!fullText.trim()) {
        setError("Модель вернула пустой ответ. Попробуйте снова.");
        return;
      }

      const nextCount = usage.count + 1;
      saveUsage(nextCount);
      setUsage({ count: nextCount, date: todayKey() });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Что-то пошло не так. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neura-${type.toLowerCase()}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="demo" className="relative py-24 md:py-40">
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
          >
            Создай контент, который цепляет
          </h2>
          <p
            className="text-text-secondary mt-6 max-w-copy"
            style={{ fontSize: "19px", lineHeight: 1.6 }}
          >
            Опиши задачу — Neura выдаст готовый текст за секунды. Без регистрации.
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
              className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 text-text-primary placeholder:text-text-tertiary outline-none focus:border-white/[0.2] transition-colors resize-none mb-2"
              style={{ fontSize: "15px", minHeight: "160px" }}
              maxLength={500}
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

            <div
              className="flex items-center justify-between mb-4 text-text-tertiary"
              style={{ fontSize: "12px" }}
            >
              <span className="inline-flex items-center gap-1.5">
                <Lock size={12} />
                {remaining} / {GUEST_LIMIT} генераций сегодня
              </span>
              {limitReached && (
                <a href="/auth" className="text-accent hover:underline">
                  Войти →
                </a>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={task.trim().length < 5 || loading || limitReached}
              className="mt-auto inline-flex items-center justify-center gap-2 bg-[#F5F5F7] text-[#0D0D0C] rounded-full px-6 font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ minHeight: "52px", fontSize: "17px" }}
            >
              <Sparkles size={18} />
              {loading
                ? "Генерируем..."
                : limitReached
                  ? "Лимит исчерпан"
                  : "Сгенерировать"}
            </button>

            {error && (
              <p
                className="text-error mt-3"
                style={{ fontSize: "13px", lineHeight: 1.5 }}
              >
                {error}
              </p>
            )}
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

            {!result && !loading && !error && (
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

            {loading && !result && (
              <div className="flex-1 flex flex-col gap-3 pt-2">
                <div className="h-5 bg-white/[0.04] rounded w-3/4 animate-pulse" />
                <div className="h-5 bg-white/[0.04] rounded w-full animate-pulse" />
                <div className="h-5 bg-white/[0.04] rounded w-2/3 animate-pulse" />
                <div className="h-5 bg-white/[0.04] rounded w-5/6 animate-pulse" />
                <div className="h-5 bg-white/[0.04] rounded w-1/2 animate-pulse" />
              </div>
            )}

            {result && (
              <>
                <div
                  className="flex-1 text-text-primary whitespace-pre-line"
                  style={{ fontSize: "16px", lineHeight: 1.7 }}
                >
                  {result}
                  {loading && (
                    <span className="inline-block w-2 h-4 bg-accent ml-1 animate-pulse align-middle" />
                  )}
                </div>
                {!loading && (
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
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 border border-white/[0.08] text-text-primary rounded-full px-5 transition-colors hover:border-white/[0.2] hover:bg-white/[0.03]"
                      style={{ minHeight: "44px", fontSize: "14px" }}
                    >
                      <Download size={16} />
                      Скачать
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={loading || limitReached}
                      className="inline-flex items-center gap-2 border border-white/[0.08] text-text-primary rounded-full px-5 transition-colors hover:border-white/[0.2] hover:bg-white/[0.03] disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ minHeight: "44px", fontSize: "14px" }}
                    >
                      <RefreshCw size={16} />
                      Перегенерировать
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}