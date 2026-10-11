import { useEffect, useRef, useState } from "react";
import { Sparkles, Copy, Download, RefreshCw, Check, Lock } from "lucide-react";
import { contentTypes, generateContent } from "../lib/api";
import type { ContentType } from "../lib/api";
import type { GenerationInput, GenerationRecord } from "../lib/history";
import { GenerationLimitError } from "../lib/usage";
import type { DailyUsage } from "../lib/usage";

type RequestInput = Omit<GenerationInput, "result">;

interface DemoSectionProps {
  onBeforeGenerate: () => Promise<{ accessToken?: string } | null>;
  onGenerated: (input: GenerationInput) => Promise<void> | void;
  onUsage: (usage: DailyUsage) => void;
  onLimitReached: () => void;
  onBusyChange: (busy: boolean) => void;
  selectedGeneration: GenerationRecord | null;
  disabled: boolean;
  variant: "landing" | "workspace";
  usage: DailyUsage;
}

// Workspace owns admission, quota, history, and persistence recovery.
export default function DemoSection({
  onBeforeGenerate,
  onGenerated,
  onUsage,
  onLimitReached,
  onBusyChange,
  selectedGeneration,
  disabled,
  variant,
  usage,
}: DemoSectionProps) {
  const [task, setTask] = useState("");
  const [type, setType] = useState<ContentType>("Пост");
  const [tone, setTone] = useState("Нейтральный");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [complete, setComplete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const busy = useRef(false);
  const alive = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const lastRequest = useRef<RequestInput | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>();
  const busyCallback = useRef(onBusyChange);
  busyCallback.current = onBusyChange;

  // Parents key this component by account: switching accounts aborts old work.
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      controller.current?.abort();
      clearTimeout(copyTimer.current);
      busyCallback.current(false);
    };
  }, []);

  // History restoration never performs admission, generation, or another save.
  useEffect(() => {
    if (!selectedGeneration) return;
    controller.current?.abort();
    controller.current = null;
    busy.current = false;
    setLoading(false);
    setStreaming(false);
    busyCallback.current(false);
    const { task, type, tone, result } = selectedGeneration;
    lastRequest.current = { task, type, tone };
    setTask(task);
    setType(type);
    setTone(tone);
    setResult(result);
    setComplete(true);
    setError("");
    setActionError("");
    setCopied(false);
    clearTimeout(copyTimer.current);
  }, [selectedGeneration]);

  // A synchronous lock covers preflight, streaming, and persistence.
  async function handleGenerate(request: RequestInput) {
    if (disabled || busy.current || request.task.trim().length < 5) return;
    busy.current = true;
    const abort = new AbortController();
    controller.current = abort;
    const current = () =>
      alive.current && controller.current === abort && !abort.signal.aborted;
    setLoading(true);
    setError("");
    setActionError("");
    setCopied(false);
    clearTimeout(copyTimer.current);
    busyCallback.current(true);
    let generated = false;
    let receivedText = "";
    try {
      const admission = await onBeforeGenerate();
      if (!current()) return;
      if (!admission) {
        setError(
          limitReached
            ? "Дневной лимит исчерпан. Оформите Pro или вернитесь завтра."
            : "Генерация недоступна. Проверьте вход и дневной лимит.",
        );
        return;
      }
      lastRequest.current = { ...request, task: request.task.trim() };
      const snapshot = lastRequest.current;
      setResult("");
      setComplete(false);
      setStreaming(true);
      const text = await generateContent(
        snapshot.task,
        snapshot.type,
        (content) => {
          if (current()) {
            receivedText = content;
            setResult(content);
          }
        },
        abort.signal,
        {
          accessToken: admission.accessToken,
          tone: snapshot.tone,
          onUsage: (value) => {
            if (current()) onUsage(value);
          },
        },
      );
      if (!current()) return;
      generated = true;
      setStreaming(false);
      setResult(text);
      setComplete(true);
      // Only a completed stream reaches the existing recovery/save mechanism.
      await onGenerated({
        task: snapshot.task,
        type: snapshot.type,
        tone: snapshot.tone,
        result: text,
      });
    } catch (failure) {
      if (!current()) return;
      if (failure instanceof GenerationLimitError) {
        if (failure.usage) onUsage(failure.usage);
        onLimitReached();
      }
      const failureMessage =
        failure instanceof Error
          ? failure.message
          : "Не удалось сгенерировать текст. Проверьте подключение и попробуйте снова.";
      setError(
        generated
          ? "Текст готов, но сохранение не удалось. Скопируйте текст и повторите сохранение в истории."
          : receivedText
            ? `${failureMessage} Частичный текст остаётся на экране, но не сохранён в историю.`
            : failureMessage,
      );
    } finally {
      if (current()) {
        controller.current = null;
        busy.current = false;
        setLoading(false);
        setStreaming(false);
        busyCallback.current(false);
      }
    }
  }

  // Clipboard rejection must not produce a false success confirmation.
  async function handleCopy() {
    setActionError("");
    const text = result;
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      if (!alive.current) return;
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      if (alive.current)
        setActionError(
          "Не удалось скопировать. Выделите текст вручную или скачайте TXT.",
        );
    }
  }

  function handleDownload() {
    setActionError("");
    let url: string | undefined;
    try {
      url = URL.createObjectURL(
        new Blob([result], { type: "text/plain;charset=utf-8" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `neura-${lastRequest.current?.type ?? type}-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setActionError("Не удалось скачать текст. Попробуйте скопировать его.");
    } finally {
      if (url) {
        const objectUrl = url;
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      }
    }
  }

  const remaining = Math.max(0, usage.limit - usage.used);
  const limitReached = remaining === 0;
  const compact = variant === "workspace";
  return (
    <section
      id="demo"
      className={compact ? "relative" : "relative py-24 md:py-40"}
    >
      <div className={compact ? "w-full" : "max-w-6xl mx-auto px-6"}>
        {!compact && (
          <div className="max-w-3xl mb-16 md:mb-24">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-text-tertiary mb-4">
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
              className="text-text-secondary mt-6 max-w-2xl"
              style={{ fontSize: "19px", lineHeight: 1.6 }}
            >
              Опиши задачу — Neura выдаст готовый текст за секунды. Без
              регистрации.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Левая панель */}
          <div className="lg:col-span-2 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 sm:p-8 flex flex-col">
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
              htmlFor={`${variant}-task`}
              className="text-text-secondary mb-3 block"
              style={{ fontSize: "13px" }}
            >
              Опишите задачу
            </label>
            <textarea
              id={`${variant}-task`}
              disabled={disabled}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Например: напиши дружелюбный пост о новом осеннем меню кофейни..."
              className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 text-text-primary placeholder:text-text-tertiary outline-none focus:border-white/[0.2] transition-colors resize-none mb-2"
              style={{
                fontSize: "16px",
                minHeight: compact ? "140px" : "160px",
              }}
              maxLength={500}
            />
            <div
              className="text-text-tertiary mb-6 text-right"
              style={{ fontSize: "12px" }}
            >
              {task.length} / 500
            </div>

            <label
              htmlFor={`${variant}-type`}
              className="text-text-secondary mb-2 block"
              style={{ fontSize: "13px" }}
            >
              Формат
            </label>
            <select
              id={`${variant}-type`}
              disabled={disabled}
              value={type}
              onChange={(e) => setType(e.target.value as ContentType)}
              className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-4 text-text-primary outline-none focus:border-white/[0.2] transition-colors mb-6 appearance-none"
              style={{ fontSize: "16px", height: "48px" }}
            >
              {contentTypes.map((format) => (
                <option key={format}>{format}</option>
              ))}
            </select>

            <label
              htmlFor={`${variant}-tone`}
              className="text-text-secondary mb-2 text-[13px]"
            >
              Тон
            </label>
            <select
              id={`${variant}-tone`}
              value={tone}
              disabled={disabled}
              onChange={(event) => setTone(event.target.value)}
              className="min-h-12 mb-6 rounded-2xl border border-border bg-bg-elevated px-4 text-base text-text-primary"
            >
              {Array.from(
                new Set([
                  tone,
                  "Нейтральный",
                  "Дружелюбный",
                  "Продающий",
                  "Официальный",
                  "Дерзкий",
                  "Ироничный",
                  "Вдохновляющий",
                ]),
              ).map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>

            <div
              className="flex items-center justify-between mb-4 text-text-tertiary"
              style={{ fontSize: "12px" }}
            >
              <span className="inline-flex items-center gap-1.5">
                <Lock size={12} />
                {usage.used} / {usage.limit} генераций сегодня
              </span>
              {limitReached && (
                <button
                  type="button"
                  onClick={onLimitReached}
                  className="min-h-11 text-accent hover:underline"
                >
                  Лимиты →
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => void handleGenerate({ task, type, tone })}
              disabled={disabled || task.trim().length < 5 || loading}
              className="mt-auto inline-flex items-center justify-center gap-2 bg-text-primary text-bg-base rounded-full px-6 font-medium transition-[transform,opacity] duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                role="alert"
                aria-live="polite"
                className="text-error mt-3"
                style={{ fontSize: "13px", lineHeight: 1.5 }}
              >
                {error}
              </p>
            )}
          </div>

          {/* Partial streams stay visible but cannot be saved or exported as complete. */}
          <div className="lg:col-span-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 sm:p-8 flex flex-col min-h-[400px]">
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
                <div className="h-5 bg-white/[0.04] rounded w-3/4 motion-safe:animate-pulse" />
                <div className="h-5 bg-white/[0.04] rounded w-full motion-safe:animate-pulse" />
                <div className="h-5 bg-white/[0.04] rounded w-2/3 motion-safe:animate-pulse" />
                <div className="h-5 bg-white/[0.04] rounded w-5/6 motion-safe:animate-pulse" />
                <div className="h-5 bg-white/[0.04] rounded w-1/2 motion-safe:animate-pulse" />
              </div>
            )}

            {error && !complete && lastRequest.current && !loading && (
              <button
                type="button"
                disabled={disabled}
                className="min-h-11 mb-4 text-sm text-accent disabled:opacity-40"
                onClick={() => {
                  if (lastRequest.current)
                    void handleGenerate(lastRequest.current);
                }}
              >
                Попробовать снова
              </button>
            )}
            <p
              role="status"
              aria-live="polite"
              className="text-sm text-error mb-3"
            >
              {actionError || (copied ? "Скопировано" : "")}
            </p>
            {result && (
              <>
                <div
                  className="flex-1 text-text-primary whitespace-pre-line break-words"
                  style={{ fontSize: "16px", lineHeight: 1.7 }}
                >
                  {result}
                  {streaming && (
                    <span className="inline-block w-2 h-4 bg-accent ml-1 motion-safe:animate-pulse align-middle" />
                  )}
                </div>
                {complete && !loading && (
                  <div className="flex flex-wrap gap-3 mt-8">
                    <button
                      type="button"
                      onClick={() => void handleCopy()}
                      className="inline-flex items-center gap-2 border border-white/[0.08] text-text-primary rounded-full px-5 transition-colors hover:border-white/[0.2] hover:bg-white/[0.03]"
                      style={{ minHeight: "44px", fontSize: "14px" }}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? "Скопировано" : "Копировать"}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 border border-white/[0.08] text-text-primary rounded-full px-5 transition-colors hover:border-white/[0.2] hover:bg-white/[0.03]"
                      style={{ minHeight: "44px", fontSize: "14px" }}
                    >
                      <Download size={16} />
                      Скачать
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (lastRequest.current)
                          void handleGenerate(lastRequest.current);
                      }}
                      disabled={disabled || loading}
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
