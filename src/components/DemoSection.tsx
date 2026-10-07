import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Copy,
  FileText,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { contentTypes, generateContent } from "../lib/api";
import type { ContentType } from "../lib/api";
import type { GenerationInput, GenerationRecord } from "../lib/history";
import { GenerationLimitError } from "../lib/usage";
import type { DailyUsage } from "../lib/usage";
import Skeleton from "./Skeleton";
import Toast from "./Toast";

interface DemoSectionProps {
  variant?: "landing" | "workspace";
  disabled?: boolean;
  onBeforeGenerate?: () => Promise<{ accessToken?: string } | null>;
  onGenerated?: (input: GenerationInput) => Promise<void> | void;
  onUsage?: (usage: DailyUsage) => void;
  onLimitReached?: () => void;
  selectedGeneration?: GenerationRecord | null;
  onBusyChange?: (busy: boolean) => void;
}
interface GenerationRequest {
  task: string;
  type: ContentType;
  tone: string;
}
type GenerationStatus = "idle" | "loading" | "success" | "error";

// Both routes share validation, result, retry, and clipboard behavior.
export default function DemoSection({
  variant = "landing",
  disabled = false,
  onBeforeGenerate,
  onGenerated,
  onUsage,
  onLimitReached,
  selectedGeneration,
  onBusyChange,
}: DemoSectionProps) {
  const [task, setTask] = useState("");
  const [type, setType] = useState<ContentType>("Пост");
  const [tone, setTone] = useState("Нейтральный");
  const [admitting, setAdmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [result, setResult] = useState("");
  const [generationError, setGenerationError] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastId, setToastId] = useState(0);
  const [copyError, setCopyError] = useState("");
  const lastRequest = useRef<GenerationRequest | null>(null);
  const requestId = useRef(0);
  const busy = useRef(false);
  const abortController = useRef<AbortController | null>(null);
  const fieldId = useId();
  const isLoading = status === "loading";
  const controlsDisabled = disabled || isLoading || admitting || saving;
  const closeToast = useCallback(() => setToastOpen(false), []);

  useEffect(() => {
    onBusyChange?.(isLoading || admitting || saving);
  }, [isLoading, admitting, saving, onBusyChange]);

  // Invalidate pending work if the route is unmounted.
  useEffect(
    () => () => {
      requestId.current += 1;
      abortController.current?.abort();
    },
    [],
  );

  // Opening history restores content without overwriting an active stream.
  useEffect(() => {
    if (!selectedGeneration || busy.current) return;
    const restored = selectedGeneration;
    setTask(restored.task);
    setType(restored.type);
    setTone(restored.tone);
    setResult(restored.result);
    setStatus("success");
    setGenerationError("");
    setCopyError("");
    setSaveError("");
    lastRequest.current = {
      task: restored.task,
      type: restored.type,
      tone: restored.tone,
    };
  }, [selectedGeneration]);

  async function generate(
    request: GenerationRequest = { task: task.trim(), type, tone },
  ) {
    if (!request.task.trim() || busy.current || disabled) return;
    busy.current = true;
    const currentId = ++requestId.current;
    const previous = { status, result, generationError };
    setAdmitting(true);
    abortController.current = new AbortController();
    try {
      const admission = onBeforeGenerate ? await onBeforeGenerate() : {};
      if (currentId !== requestId.current || admission === null) return;
      lastRequest.current = request;
      setAdmitting(false);
      setStatus("loading");
      setResult("");
      setGenerationError("");
      setCopyError("");
      setSaveError("");
      const text = await generateContent(
        request.task,
        request.type,
        (content) => {
          if (currentId === requestId.current) setResult(content);
        },
        abortController.current.signal,
        { ...admission, tone: request.tone, onUsage },
      );
      if (currentId !== requestId.current) return;
      setResult(text);
      setStatus("success");
      if (onGenerated) {
        setSaving(true);
        try {
          await onGenerated({ ...request, result: text });
        } catch (error) {
          if (currentId === requestId.current)
            setSaveError(
              `Текст готов, но история не сохранена: ${error instanceof Error ? error.message : "Попробуйте снова."}`,
            );
        }
      }
    } catch (error) {
      if (currentId === requestId.current) {
        if (error instanceof GenerationLimitError) {
          setResult(previous.result);
          setStatus(previous.status);
          setGenerationError(previous.generationError);
          onLimitReached?.();
          return;
        }
        setGenerationError(
          error instanceof Error
            ? error.message
            : "Не удалось сгенерировать текст. Попробуйте снова.",
        );
        setStatus("error");
      }
    } finally {
      if (currentId === requestId.current) {
        busy.current = false;
        abortController.current = null;
        setAdmitting(false);
        setSaving(false);
      }
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void generate();
  }

  async function copyResult() {
    setCopyError("");
    try {
      await navigator.clipboard.writeText(result);
      setToastId((id) => id + 1);
      setToastOpen(true);
    } catch {
      setCopyError(
        "Не удалось скопировать. Выделите текст и скопируйте вручную.",
      );
    }
  }

  return (
    <section
      id="demo"
      className={
        variant === "landing"
          ? "section-space border-y border-border bg-bg-elevated"
          : "w-full"
      }
    >
      <div className={variant === "landing" ? "container-page" : ""}>
        {variant === "landing" && (
          <div className="reveal mb-12 text-center">
            <p className="eyebrow mb-4">От идеи к результату</p>
            <h2>
              Попробуй <span className="gradient-text">прямо сейчас</span>
            </h2>
            <p className="mt-5 text-muted">
              Одна задача. Один клик. Первый текст готов.
            </p>
          </div>
        )}
        <div
          className={`grid gap-6 lg:grid-cols-5 ${variant === "landing" ? "reveal" : ""}`}
        >
          {/* Prompt and output format form. */}
          <form onSubmit={submit} className="card lg:col-span-2">
            <div className="mb-7 flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-xs font-semibold text-accent">
                01
              </span>
              <p className="text-base font-semibold">Расскажите об идее</p>
            </div>
            <label
              htmlFor={`${fieldId}-task`}
              className="mb-3 block text-sm font-medium"
            >
              Опишите задачу
            </label>
            <textarea
              id={`${fieldId}-task`}
              value={task}
              onChange={(event) => setTask(event.target.value)}
              disabled={controlsDisabled}
              placeholder="Например: напиши дружелюбный пост о новом осеннем меню кофейни…"
              rows={5}
              maxLength={2000}
              required
              className="field min-h-[165px] resize-y disabled:opacity-60"
              aria-describedby={`${fieldId}-hint`}
            />
            <p id={`${fieldId}-hint`} className="mt-2 text-xs text-muted">
              Укажите продукт, аудиторию и нужный тон.
            </p>
            <label
              htmlFor={`${fieldId}-type`}
              className="mb-3 mt-6 block text-sm font-medium"
            >
              Формат контента
            </label>
            <div className="relative">
              <select
                id={`${fieldId}-type`}
                value={type}
                onChange={(event) => setType(event.target.value as ContentType)}
                disabled={controlsDisabled}
                className="field appearance-none pr-12 disabled:opacity-60"
              >
                {contentTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
            <label
              htmlFor={`${fieldId}-tone`}
              className="mb-3 mt-6 block text-sm font-[510]"
            >
              Тон текста
            </label>
            <div className="relative">
              <select
                id={`${fieldId}-tone`}
                value={tone}
                onChange={(event) => setTone(event.target.value)}
                disabled={controlsDisabled}
                className="field appearance-none pr-12 disabled:opacity-60"
              >
                {["Нейтральный", "Дружелюбный", "Деловой", "Энергичный"].map(
                  (item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ),
                )}
              </select>
              <ChevronDown
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
            <button
              type="submit"
              disabled={!task.trim() || controlsDisabled}
              className="btn-primary mt-7 w-full"
            >
              <Sparkles size={18} />
              {admitting
                ? "Проверяем лимит…"
                : isLoading
                  ? "Генерируем…"
                  : "Сгенерировать"}
            </button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
              <Check size={12} />
              Посты, письма, реклама и сценарии Reels
            </p>
          </form>
          {/* Empty, loading, error, and success result states. */}
          <div
            className={`card flex min-h-[430px] min-w-0 flex-col lg:col-span-3 ${status === "error" ? "border-error/60" : ""}`}
            aria-busy={isLoading}
          >
            <div className="mb-6 flex items-center justify-between gap-3 border-b border-border pb-5">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-xs font-semibold text-accent">
                  02
                </span>
                <p className="text-base font-semibold">Ваш результат</p>
              </div>
              <span className="rounded-md border border-line px-2 py-1 text-[11px] tracking-widest text-muted">
                AI CONTENT
              </span>
            </div>
            {status === "loading" && !result && <Skeleton />}
            {result && status !== "idle" && (
              <p
                aria-live={isLoading ? "off" : "polite"}
                className="mb-7 flex-1 whitespace-pre-wrap break-words text-base leading-[1.8]"
              >
                {result}
              </p>
            )}
            {isLoading && result && (
              <p role="status" className="mb-4 text-sm text-accent">
                Neura продолжает писать…
              </p>
            )}
            {status === "idle" && (
              <div className="my-auto flex flex-col items-center py-10 text-center">
                <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-bg/40 text-muted">
                  <FileText size={28} strokeWidth={1.5} />
                </span>
                <p className="text-lg font-medium">Здесь появится ваш текст</p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                  Опишите идею слева.
                  <br />
                  Neura поможет найти нужные слова.
                </p>
              </div>
            )}
            {status === "error" && (
              <div role="alert" className="my-auto py-8 text-center">
                <AlertCircle size={32} className="mx-auto mb-4 text-error" />
                <h3 className="whitespace-pre-wrap break-words text-lg leading-relaxed text-error">
                  {generationError || "Не удалось сгенерировать текст."}
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    void generate(lastRequest.current ?? undefined)
                  }
                  className="btn-secondary mt-6"
                  disabled={controlsDisabled}
                >
                  <RefreshCw size={16} />
                  Попробовать снова
                </button>
              </div>
            )}
            {status === "success" && (
              <>
                <div className="flex flex-wrap gap-3 border-t border-border pt-5">
                  <button
                    type="button"
                    onClick={() => void copyResult()}
                    className="btn-secondary min-h-10 px-4 py-2.5 text-sm"
                    disabled={controlsDisabled}
                  >
                    <Copy size={16} />
                    Копировать
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      void generate(lastRequest.current ?? undefined)
                    }
                    className="btn-secondary min-h-10 px-4 py-2.5 text-sm"
                    disabled={controlsDisabled}
                  >
                    <RefreshCw size={16} />
                    Перегенерировать
                  </button>
                </div>
                {copyError && (
                  <p role="alert" className="mt-3 text-sm text-error">
                    {copyError}
                  </p>
                )}
                {saving && (
                  <p role="status" className="mt-3 text-sm text-muted">
                    Сохраняем историю…
                  </p>
                )}
                {saveError && (
                  <p role="alert" className="mt-3 text-sm text-error">
                    {saveError}
                  </p>
                )}
              </>
            )}
            <p className="mt-auto pt-5 text-xs leading-relaxed text-muted">
              Проверьте факты и адаптируйте текст перед публикацией.
            </p>
          </div>
        </div>
      </div>
      <Toast key={toastId} open={toastOpen} onClose={closeToast} />
    </section>
  );
}
