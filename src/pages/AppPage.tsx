import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Instagram,
  Send,
  Mail,
  Heading,
  Megaphone,
  CalendarDays,
  Search,
  UserRound,
  Tags,
  Clapperboard,
  Package,
  FileText,
  Cloud,
  History,
  X,
  LogIn,
  LogOut,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import DemoSection, { stripTemplateSuffix } from "../components/DemoSection";
import type { WorkspaceTemplate } from "../components/DemoSection";
import LimitModal from "../components/LimitModal";
import { useAuth } from "../hooks/useAuth";
import { useWorkspace } from "../hooks/useWorkspace";
import type { GenerationRecord } from "../lib/history";

// Shared restriction stays short; system grounding remains the higher priority.
const TEMPLATE_GROUNDING =
  "Факты о бизнесе бери только из задания и контекста. Не придумывай скидки, цены, сроки, свойства, адреса или другие условия. Если необходимого факта нет, предпочитай нейтральную формулировку, иначе короткий плейсхолдер.";
function groundedTemplate(instruction: string): string {
  return `${instruction} ${TEMPLATE_GROUNDING}`;
}

// Catalog formats match the four existing API/DB content types.
const TEMPLATES = [
  {
    id: "instagram-post",
    name: "Instagram Post",
    description: "Пост с зацепкой и призывом к действию.",
    type: "Пост",
    icon: Instagram,
    instruction: groundedTemplate(
      "Создай пост для Instagram: сильная первая строка, короткие абзацы, польза из задания или контекста и один призыв к действию. Добавь до трёх уместных хештегов.",
    ),
    placeholder: "Расскажите о бренде, теме поста и аудитории Instagram...",
  },
  {
    id: "telegram-announcement",
    name: "Telegram Announcement",
    description: "Ясный анонс для Telegram-канала.",
    type: "Пост",
    icon: Send,
    instruction: groundedTemplate(
      "Подготовь анонс для Telegram: ёмкий заголовок, что произойдёт и кому это полезно, затем один следующий шаг. Используй дату и ссылку только если они указаны в задаче или контексте.",
    ),
    placeholder:
      "Что вы анонсируете в Telegram? Укажите детали и следующий шаг...",
  },
  {
    id: "email-campaign",
    name: "Email Campaign",
    description: "Тема, прехедер и текст письма.",
    type: "Email",
    icon: Mail,
    instruction: groundedTemplate(
      "Напиши email-кампанию: тему письма, прехедер и основной текст с одним CTA. Начни с потребности читателя, покажи предоставленную пользу предложения. Не используй ложную срочность.",
    ),
    placeholder:
      "Кому отправляем письмо, какое предложение и что должен сделать читатель?...",
  },
  {
    id: "landing-headline",
    name: "Landing Headline",
    description: "Первый экран с ясной ценностью.",
    type: "Реклама",
    icon: Heading,
    instruction: groundedTemplate(
      "Создай первый экран лендинга: три варианта заголовка, один подзаголовок и текст CTA-кнопки. Сформулируй пользу продукта для указанной аудитории без неподтверждённых обещаний.",
    ),
    placeholder:
      "Опишите продукт, аудиторию и ключевую пользу для первого экрана...",
  },
  {
    id: "ad-copy",
    name: "Ad Copy",
    description: "Короткие варианты рекламного текста.",
    type: "Реклама",
    icon: Megaphone,
    instruction: groundedTemplate(
      "Создай три коротких рекламных объявления с разными зацепками. Для каждого дай заголовок, основной текст и CTA. Опирайся на факты задания и контекста, без выдуманных скидок или гарантий.",
    ),
    placeholder: "Что рекламируем, кому и на какой площадке?...",
  },
  {
    id: "content-plan",
    name: "Content Plan",
    description: "Темы и форматы на семь дней.",
    type: "Пост",
    icon: CalendarDays,
    instruction: groundedTemplate(
      "Составь контент-план на семь дней: для каждого дня укажи тему, формат, основную мысль и цель публикации. Чередуй образовательные, вовлекающие и продающие материалы. Дни плана не являются объявленными сроками акции.",
    ),
    placeholder:
      "Опишите нишу, аудиторию и цель контента на ближайшую неделю...",
  },
  {
    id: "seo-description",
    name: "SEO Description",
    description: "Метаописание страницы для поиска.",
    type: "Пост",
    icon: Search,
    instruction: groundedTemplate(
      "Подготовь три варианта SEO meta description примерно по 140–160 символов. Естественно включи заданное ключевое слово и пользу страницы. Не добавляй факты, которых нет в задаче или контексте.",
    ),
    placeholder:
      "О чём страница? Укажите ключевое слово и её основную пользу...",
  },
  {
    id: "brand-bio",
    name: "Brand Bio",
    description: "Краткое позиционирование бренда.",
    type: "Пост",
    icon: UserRound,
    instruction: groundedTemplate(
      "Напиши три кратких варианта bio бренда: кто вы, для кого работаете и чем полезны. Сделай формулировки компактными для профиля в соцсетях. Не выдумывай название, деятельность или достижения бренда.",
    ),
    placeholder: "Кто вы, кому помогаете и в чём особенность бренда?...",
  },
  {
    id: "offer-text",
    name: "Offer Text",
    description: "Предложение с понятными условиями.",
    type: "Реклама",
    icon: Tags,
    instruction: groundedTemplate(
      "Сформулируй оффер: для кого предложение, предоставленная польза, что входит, условия и следующий шаг. Не заполняй неизвестные состав и условия догадками. Если цена или сроки не заданы в задании или контексте, не придумывай их. Не обещай гарантированный результат.",
    ),
    placeholder: "Опишите предложение, его пользу и известные условия...",
  },
  {
    id: "reels-script",
    name: "Reels Script",
    description: "Сценарий короткого вертикального видео.",
    type: "Reels",
    icon: Clapperboard,
    instruction: groundedTemplate(
      "Напиши сценарий Reels на 30 секунд: зацепка в первые три секунды, последовательность сцен с примерным таймингом, текст в кадре и финальный CTA. Сценарий должен быть удобен для съёмки.",
    ),
    placeholder: "О чём Reels, кто зритель и какое действие ожидается?...",
  },
  {
    id: "product-description",
    name: "Product Description",
    description: "Описание товара через пользу.",
    type: "Реклама",
    icon: Package,
    instruction: groundedTemplate(
      "Создай описание товара: короткое вступление, характеристики из задания или контекста, польза каждой характеристики и CTA. Не выдумывай состав, сертификаты, размеры или свойства товара.",
    ),
    placeholder: "Опишите товар, реальные характеристики и покупателя...",
  },
  {
    id: "case-study",
    name: "Case Study",
    description: "Кейс: задача, подход и результат.",
    type: "Пост",
    icon: FileText,
    instruction: groundedTemplate(
      "Подготовь кейс по структуре: исходная задача, ограничения, решение, результат и вывод. Используй только предоставленные цифры. Если результатов нет, используй краткий плейсхолдер в разделе результата, не выдумывай метрики.",
    ),
    placeholder:
      "Расскажите о задаче клиента, решении и подтверждённых результатах...",
  },
] satisfies readonly WorkspaceTemplate[];

// The workspace keeps guest history local and signed-in history private in Supabase.
export default function AppPage() {
  const [params] = useSearchParams();
  const plan = params.get("plan");
  const { user, loading, authError, signOut } = useAuth();
  const workspace = useWorkspace(user, loading);
  const [selectedGeneration, setSelectedGeneration] =
    useState<GenerationRecord | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<WorkspaceTemplate | null>(null);
  const [signOutError, setSignOutError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [generatorBusy, setGeneratorBusy] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const mobileHistoryOpen = historyOpen && !workspace.limitOpen;
  const historyTrigger = useRef<HTMLButtonElement>(null);
  const historyPanel = useRef<HTMLDivElement>(null);
  const historyClose = useRef<HTMLButtonElement>(null);
  const account = user?.id ?? "guest";
  const email = user?.email || "Ваш аккаунт";
  const greetingName = user?.email?.split("@")[0] || "";
  const initial = user?.email?.charAt(0).toUpperCase() || "N";

  // Restored content cannot carry over to a different authenticated account.
  useEffect(() => {
    setSelectedGeneration(null);
    setSelectedTemplate(null);
    setGeneratorBusy(false);
    setSignOutError("");
    setHistoryOpen(false);
    setShowAllHistory(false);
  }, [account]);

  // Keep just one modal active if a generation opens the daily-limit dialog.
  useEffect(() => {
    if (workspace.limitOpen) setHistoryOpen(false);
  }, [workspace.limitOpen]);

  // Mobile dialog owns focus and freezes the page, including iOS scroll position.
  useEffect(() => {
    if (!mobileHistoryOpen) return;
    const body = document.body;
    const html = document.documentElement;
    const scrollY = window.scrollY;
    const previousBody = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    const previousHtmlOverflow = html.style.overflow;
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    html.style.overflow = "hidden";
    historyClose.current?.focus();

    function focusableControls(): HTMLElement[] {
      return Array.from(
        historyPanel.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]),a[href],[tabindex="0"]',
        ) ?? [],
      );
    }
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setHistoryOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const controls = focusableControls();
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first || !last) {
        event.preventDefault();
        historyPanel.current?.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    function keepFocus(event: FocusEvent) {
      if (
        event.target instanceof Node &&
        !historyPanel.current?.contains(event.target)
      ) {
        historyClose.current?.focus();
      }
    }
    const desktop = window.matchMedia("(min-width: 1280px)");
    function closeOnDesktop() {
      if (desktop.matches) setHistoryOpen(false);
    }
    closeOnDesktop();
    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", keydown);
    document.addEventListener("focusin", keepFocus);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("focusin", keepFocus);
      Object.assign(body.style, previousBody);
      html.style.overflow = previousHtmlOverflow;
      window.scrollTo({ top: scrollY, behavior: "instant" });
      if (historyTrigger.current?.isConnected)
        historyTrigger.current.focus({ preventScroll: true });
    };
  }, [mobileHistoryOpen]);

  async function handleSignOut() {
    setSigningOut(true);
    setSignOutError("");
    try {
      await signOut();
    } catch (error) {
      setSignOutError(
        error instanceof Error
          ? error.message
          : "Не удалось выйти. Попробуйте снова.",
      );
    } finally {
      setSigningOut(false);
    }
  }

  const restored =
    selectedGeneration?.user_id === (user?.id ?? null)
      ? selectedGeneration
      : null;
  const visibleRecords = showAllHistory
    ? workspace.records
    : workspace.records.slice(0, 5);
  const historyDisabled =
    generatorBusy || loading || signingOut || workspace.historyLoading;

  function selectHistory(record: GenerationRecord) {
    if (historyDisabled) return;
    setSelectedTemplate(null);
    setSelectedGeneration({ ...record });
    setHistoryOpen(false);
  }

  // Desktop and mobile share one rendering path and the same workspace records.
  function renderHistory(mobile: boolean) {
    const headingId = mobile
      ? "mobile-history-heading"
      : "desktop-history-heading";
    const listId = mobile
      ? "mobile-history-records"
      : "desktop-history-records";
    return (
      <>
        <div className="mb-4 flex items-start justify-between gap-2">
          <h2
            id={headingId}
            className="min-w-0 text-lg font-display leading-snug text-ink"
          >
            Последние генерации
          </h2>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={workspace.reloadHistory}
              disabled={workspace.historyLoading || loading || generatorBusy}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink/[0.08] text-muted hover:text-accent-ink disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              aria-label="Обновить историю"
            >
              <RefreshCw size={18} aria-hidden="true" />
            </button>
            {mobile && (
              <button
                ref={historyClose}
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink/[0.08] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                aria-label="Закрыть историю"
              >
                <X size={20} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
        <p className="mb-5 text-xs text-muted">
          {user ? "Облачная история" : "История в этом браузере"}
        </p>
        {workspace.historyError && (
          <div
            role="alert"
            className="mb-4 rounded-card border border-error/30 bg-white/80 p-4 text-sm"
          >
            <p className="break-words text-error">{workspace.historyError}</p>
            {!!workspace.pendingCount && (
              <button
                type="button"
                onClick={() => void workspace.retrySave()}
                disabled={workspace.saving}
                className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-ink/[0.08] px-3 py-2 text-ink disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                <RefreshCw size={15} aria-hidden="true" />
                {workspace.saving ? "Сохраняем…" : "Повторить сохранение"}
              </button>
            )}
          </div>
        )}
        {workspace.historyLoading && (
          <p role="status" className="mb-4 py-2 text-sm text-muted">
            Загружаем историю…
          </p>
        )}
        {!workspace.historyLoading && !workspace.records.length && (
          <p className="rounded-card border border-ink/[0.08] bg-white/80 p-5 text-sm leading-relaxed text-muted">
            Здесь появятся ваши готовые тексты. Выберите запись, чтобы вернуться
            к ней.
          </p>
        )}
        <ul id={listId} className="space-y-3">
          {visibleRecords.map((record) => (
            <li key={record.id}>
              <button
                type="button"
                onClick={() => selectHistory(record)}
                disabled={historyDisabled}
                aria-pressed={restored?.id === record.id}
                className={`min-h-11 w-full min-w-0 rounded-card border p-4 text-left transition-[transform,opacity] duration-150 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${restored?.id === record.id ? "border-accent/40 bg-accent/5" : "border-ink/[0.08] bg-white/80 hover:border-accent/30"}`}
              >
                <span className="mb-2 line-clamp-2 block break-words text-sm font-medium text-ink">
                  {stripTemplateSuffix(record.task)}
                </span>
                <span className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                  <span>{record.type}</span>
                  <time dateTime={record.created_at}>
                    {new Date(record.created_at).toLocaleString("ru-RU", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </time>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {workspace.records.length > 5 && (
          <button
            type="button"
            onClick={() => setShowAllHistory((value) => !value)}
            aria-expanded={showAllHistory}
            aria-controls={listId}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-ink/[0.08] px-4 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            {showAllHistory
              ? "Последние 5"
              : `Все записи (${workspace.records.length})`}
          </button>
        )}
      </>
    );
  }

  return (
    <div className="bg-bg text-ink min-h-screen font-[510]">
      <div aria-hidden={mobileHistoryOpen || undefined}>
        {/* Compact navigation and account controls. */}
        <header className="border-b border-ink/[0.08] bg-white/80">
          <div className="container-page flex min-h-20 flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="inline-flex min-h-11 min-w-11 items-center gap-2 text-sm text-muted hover:text-accent-ink"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Назад</span>
                <span className="sr-only sm:hidden">На главную</span>
              </Link>
              <Link to="/" className="inline-flex min-h-11 items-center text-xl font-display tracking-tight">
                Neura<span className="text-accent-ink">.</span>
              </Link>
            </div>
            <button
              ref={historyTrigger}
              type="button"
              onClick={() => setHistoryOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={mobileHistoryOpen}
              aria-controls="mobile-history-panel"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-ink/[0.08] px-3 py-2 text-sm text-ink xl:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              <History size={18} aria-hidden="true" />
              История
            </button>
            {loading ? (
              <span role="status" className="text-xs text-muted">
                Проверяем вход…
              </span>
            ) : user ? (
              <div className="flex min-w-0 max-w-full items-center gap-3">
                <span
                  title={email}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-xs text-accent-ink"
                  aria-label={`Аккаунт: ${email}`}
                >
                  {initial}
                </span>
                <span className="min-w-0 max-w-36 truncate text-sm text-muted sm:max-w-56">
                  {email}
                </span>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  disabled={signingOut}
                  className="btn-secondary min-h-11 shrink-0 px-3 py-2 text-sm"
                >
                  <LogOut size={16} />
                  {signingOut ? "Выходим…" : "Выйти"}
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn-secondary min-h-11 px-4 py-2 text-sm"
              >
                <LogIn size={16} />
                Войти
              </Link>
            )}
          </div>
        </header>
        <main className="container-page py-12 sm:py-16">
          {(authError || signOutError) && (
            <p
              role="alert"
              className="mb-6 rounded-xl border border-error/30 bg-card px-4 py-3 text-sm text-error"
            >
              {signOutError || authError}
            </p>
          )}
          <div className="mb-9">
            <p className="eyebrow mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-accent-ink" />
              Ваша рабочая область
            </p>
            <h1 className="text-[clamp(32px,5vw,72px)] font-display leading-tight tracking-tight break-words">
              {greetingName ? `Привет, ${greetingName}` : "Привет"}
            </h1>
            <p className="mt-4 text-lg font-[510] text-muted">
              Опишите задачу — найдём для неё нужные слова.
            </p>
            {(plan === "pro" || plan === "team") && (
              <p
                role="status"
                className="mt-4 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-muted"
              >
                Вы выбрали {plan === "pro" ? "Pro" : "Team"}. Сейчас доступен
                бесплатный план — платные подписки ещё не подключены.
              </p>
            )}
          </div>
          {!loading && !user && (
            <div className="bg-white/80 mb-6 flex flex-col gap-4 rounded-xl border border-ink/[0.08] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-3 text-sm text-muted">
                <Cloud size={20} className="shrink-0 text-accent-ink" />
                Войдите, чтобы сохранять историю на всех устройствах
              </p>
              <Link
                to="/auth"
                className="inline-flex min-h-11 items-center shrink-0 text-sm text-accent-ink hover:underline"
              >
                Войти или зарегистрироваться →
              </Link>
            </div>
          )}
          {/* Picking a template configures the editor without generation or quota use. */}
          <section aria-labelledby="templates-heading" className="mb-8">
            <h2
              id="templates-heading"
              className="mb-2 text-2xl font-display text-ink"
            >
              Шаблоны
            </h2>
            <p className="mb-5 text-sm text-muted">
              Выберите формат задачи, затем добавьте свои детали.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {TEMPLATES.map((template) => {
                const Icon = template.icon;
                const active = selectedTemplate?.id === template.id;
                return (
                  <button
                    key={template.id}
                    type="button"
                    disabled={
                      generatorBusy ||
                      loading ||
                      signingOut ||
                      workspace.historyLoading
                    }
                    aria-pressed={active}
                    onClick={() => {
                      if (
                        generatorBusy ||
                        loading ||
                        signingOut ||
                        workspace.historyLoading
                      )
                        return;
                      setSelectedGeneration(null);
                      setSelectedTemplate(template);
                    }}
                    className={`flex min-h-11 w-full min-w-0 items-start gap-3 rounded-card border bg-white/80 p-5 text-left transition-[transform,opacity] duration-150 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${active ? "border-accent" : "border-ink/[0.08] hover:border-accent/30"}`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? "bg-accent/20 text-accent-ink" : "bg-ink/[0.04] text-muted"}`}
                    >
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-[15px] font-display ${active ? "text-accent-ink" : "text-ink"}`}
                      >
                        {template.name}
                      </span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-muted">
                        {template.description}
                      </span>
                    </span>
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-muted"
                    />
                  </button>
                );
              })}
            </div>
          </section>

          <p role="status" className="mb-5 text-sm text-muted">
            {loading || workspace.historyLoading ? (
              "Загружаем рабочую область…"
            ) : (
              <>
                {workspace.usage.used} из {workspace.usage.limit} генераций
                сегодня ·{" "}
                {user ? "облачная история" : "история в этом браузере"}
              </>
            )}
          </p>
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0">
              <DemoSection
                key={account}
                variant="workspace"
                disabled={loading || signingOut || workspace.historyLoading}
                onBeforeGenerate={workspace.beforeGenerate}
                onGenerated={workspace.saveGeneration}
                onUsage={workspace.updateUsage}
                onLimitReached={workspace.openLimit}
                onBusyChange={setGeneratorBusy}
                selectedGeneration={restored}
                usage={workspace.usage}
                selectedTemplate={selectedTemplate}
                onTemplateReset={() => setSelectedTemplate(null)}
              />
            </div>
            <aside
              aria-labelledby="desktop-history-heading"
              className="hidden min-w-0 rounded-card border border-ink/[0.08] bg-white/80 p-5 xl:sticky xl:top-6 xl:block xl:max-h-[calc(100dvh-3rem)] xl:overflow-y-auto xl:overscroll-contain"
            >
              {renderHistory(false)}
            </aside>
          </div>
        </main>
        <footer className="container-page pb-8 text-xs text-muted">
          © {new Date().getFullYear()} Neura · Больше идей. Меньше рутины.
        </footer>
      </div>
      {mobileHistoryOpen && (
        <div
          ref={historyPanel}
          id="mobile-history-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-history-heading"
          tabIndex={-1}
          className="fixed inset-0 z-[90] overflow-y-auto overscroll-contain bg-bg text-ink px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] motion-reduce:transition-none xl:hidden"
        >
          {renderHistory(true)}
        </div>
      )}
      <LimitModal open={workspace.limitOpen} onClose={workspace.closeLimit} />
    </div>
  );
}
