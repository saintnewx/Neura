import { useEffect, useState } from "react";
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
  LogIn,
  LogOut,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import DemoSection from "../components/DemoSection";
import type { WorkspaceTemplate } from "../components/DemoSection";
import LimitModal from "../components/LimitModal";
import { useAuth } from "../hooks/useAuth";
import { useWorkspace } from "../hooks/useWorkspace";
import type { GenerationRecord } from "../lib/history";

// Catalog formats match the four existing API/DB content types.
const TEMPLATES = [
  {
    id: "instagram-post",
    name: "Instagram Post",
    description: "Пост с зацепкой и призывом к действию.",
    type: "Пост",
    icon: Instagram,
    instruction:
      "Создай пост для Instagram: сильная первая строка, короткие абзацы, конкретная польза и один призыв к действию. Добавь до трёх уместных хештегов. Не выдумывай факты.",
    placeholder: "Расскажите о бренде, теме поста и аудитории Instagram...",
  },
  {
    id: "telegram-announcement",
    name: "Telegram Announcement",
    description: "Ясный анонс для Telegram-канала.",
    type: "Пост",
    icon: Send,
    instruction:
      "Подготовь анонс для Telegram: ёмкий заголовок, что произойдёт и кому это полезно, затем один следующий шаг. Используй дату и ссылку только если они указаны в задаче.",
    placeholder:
      "Что вы анонсируете в Telegram? Укажите детали и следующий шаг...",
  },
  {
    id: "email-campaign",
    name: "Email Campaign",
    description: "Тема, прехедер и текст письма.",
    type: "Email",
    icon: Mail,
    instruction:
      "Напиши email-кампанию: тему письма, прехедер и основной текст с одним CTA. Начни с потребности читателя, покажи пользу предложения. Не используй ложную срочность.",
    placeholder:
      "Кому отправляем письмо, какое предложение и что должен сделать читатель?...",
  },
  {
    id: "landing-headline",
    name: "Landing Headline",
    description: "Первый экран с ясной ценностью.",
    type: "Реклама",
    icon: Heading,
    instruction:
      "Создай первый экран лендинга: три варианта заголовка, один подзаголовок и текст CTA-кнопки. Сформулируй пользу продукта для указанной аудитории без неподтверждённых обещаний.",
    placeholder:
      "Опишите продукт, аудиторию и ключевую пользу для первого экрана...",
  },
  {
    id: "ad-copy",
    name: "Ad Copy",
    description: "Короткие варианты рекламного текста.",
    type: "Реклама",
    icon: Megaphone,
    instruction:
      "Создай три коротких рекламных объявления с разными зацепками. Для каждого дай заголовок, основной текст и CTA. Опирайся на факты задачи, без выдуманных скидок или гарантий.",
    placeholder: "Что рекламируем, кому и на какой площадке?...",
  },
  {
    id: "content-plan",
    name: "Content Plan",
    description: "Темы и форматы на семь дней.",
    type: "Пост",
    icon: CalendarDays,
    instruction:
      "Составь контент-план на семь дней: для каждого дня укажи тему, формат, основную мысль и цель публикации. Чередуй образовательные, вовлекающие и продающие материалы.",
    placeholder:
      "Опишите нишу, аудиторию и цель контента на ближайшую неделю...",
  },
  {
    id: "seo-description",
    name: "SEO Description",
    description: "Метаописание страницы для поиска.",
    type: "Пост",
    icon: Search,
    instruction:
      "Подготовь три варианта SEO meta description примерно по 140–160 символов. Естественно включи заданное ключевое слово и пользу страницы. Не добавляй факты, которых нет в задаче.",
    placeholder:
      "О чём страница? Укажите ключевое слово и её основную пользу...",
  },
  {
    id: "brand-bio",
    name: "Brand Bio",
    description: "Краткое позиционирование бренда.",
    type: "Пост",
    icon: UserRound,
    instruction:
      "Напиши три кратких варианта bio бренда: кто вы, для кого работаете и чем полезны. Сделай формулировки компактными для профиля в соцсетях. Не выдумывай достижения.",
    placeholder: "Кто вы, кому помогаете и в чём особенность бренда?...",
  },
  {
    id: "offer-text",
    name: "Offer Text",
    description: "Предложение с понятными условиями.",
    type: "Реклама",
    icon: Tags,
    instruction:
      "Сформулируй оффер: для кого предложение, конкретная польза, что входит, условия и следующий шаг. Если цена или сроки не заданы, не придумывай их. Не обещай гарантированный результат.",
    placeholder: "Опишите предложение, его пользу и известные условия...",
  },
  {
    id: "reels-script",
    name: "Reels Script",
    description: "Сценарий короткого вертикального видео.",
    type: "Reels",
    icon: Clapperboard,
    instruction:
      "Напиши сценарий Reels на 30 секунд: зацепка в первые три секунды, последовательность сцен с примерным таймингом, текст в кадре и финальный CTA. Сценарий должен быть удобен для съёмки.",
    placeholder: "О чём Reels, кто зритель и какое действие ожидается?...",
  },
  {
    id: "product-description",
    name: "Product Description",
    description: "Описание товара через пользу.",
    type: "Реклама",
    icon: Package,
    instruction:
      "Создай описание товара: короткое вступление, характеристики из задачи, польза каждой характеристики и CTA. Не выдумывай состав, сертификаты, размеры или свойства товара.",
    placeholder: "Опишите товар, реальные характеристики и покупателя...",
  },
  {
    id: "case-study",
    name: "Case Study",
    description: "Кейс: задача, подход и результат.",
    type: "Пост",
    icon: FileText,
    instruction:
      "Подготовь кейс по структуре: исходная задача, ограничения, решение, результат и вывод. Используй только предоставленные цифры. Если результатов нет, обозначь, каких данных не хватает, не выдумывай метрики.",
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
  }, [account]);

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
  return (
    <div className="hero-glow min-h-screen font-[510]">
      {/* Compact navigation and account controls. */}
      <header className="border-b border-border">
        <div className="container-page flex min-h-20 flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Назад</span>
              <span className="sr-only sm:hidden">На главную</span>
            </Link>
            <Link to="/" className="text-xl font-extrabold tracking-tight">
              Neura<span className="text-accent">.</span>
            </Link>
          </div>
          {loading ? (
            <span role="status" className="text-xs text-muted">
              Проверяем вход…
            </span>
          ) : user ? (
            <div className="flex min-w-0 max-w-full items-center gap-3">
              <span
                title={email}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-xs text-accent"
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
                className="btn-secondary min-h-10 shrink-0 px-3 py-2 text-sm"
              >
                <LogOut size={16} />
                {signingOut ? "Выходим…" : "Выйти"}
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="btn-secondary min-h-10 px-4 py-2 text-sm"
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
            <Sparkles size={14} className="text-accent" />
            Ваша рабочая область
          </p>
          <h1 className="text-[clamp(32px,5vw,72px)] font-bold leading-tight tracking-tight break-words">
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
          <div className="glass-strong mb-6 flex flex-col gap-4 rounded-xl border border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-3 text-sm text-muted">
              <Cloud size={20} className="shrink-0 text-accent" />
              Войдите, чтобы сохранять историю на всех устройствах
            </p>
            <Link
              to="/auth"
              className="shrink-0 text-sm text-accent hover:underline"
            >
              Войти или зарегистрироваться →
            </Link>
          </div>
        )}
        {/* Picking a template configures the editor without generation or quota use. */}
        <section aria-labelledby="templates-heading" className="mb-8">
          <h2
            id="templates-heading"
            className="mb-2 text-2xl font-semibold text-text-primary"
          >
            Шаблоны
          </h2>
          <p className="mb-5 text-sm text-text-secondary">
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
                  className={`flex min-h-11 w-full min-w-0 items-start gap-3 rounded-2xl border bg-white/[0.03] p-5 text-left transition-[transform,opacity] duration-150 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${active ? "border-accent" : "border-white/[0.08] hover:border-accent/30"}`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? "bg-accent/20 text-accent" : "bg-white/5 text-text-secondary"}`}
                  >
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[15px] font-semibold ${active ? "text-accent" : "text-text-primary"}`}
                    >
                      {template.name}
                    </span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-text-secondary">
                      {template.description}
                    </span>
                  </span>
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-text-secondary"
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
              сегодня · {user ? "облачная история" : "история в этом браузере"}
            </>
          )}
        </p>
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
        {/* Browsable history restores the prompt, format, tone, and generated text. */}
        <section
          aria-labelledby="history-heading"
          className="mt-12 border-t border-border pt-10"
        >
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2
              id="history-heading"
              className="flex items-center gap-3 text-2xl font-[590] sm:text-3xl"
            >
              <History size={24} className="text-muted" />
              История генераций
            </h2>
            <button
              type="button"
              onClick={workspace.reloadHistory}
              disabled={workspace.historyLoading || loading || generatorBusy}
              className="rounded-lg p-2 text-muted hover:text-accent disabled:opacity-40"
              aria-label="Обновить историю"
            >
              <RefreshCw size={18} />
            </button>
          </div>
          {workspace.historyError && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-error/30 bg-card p-4 text-sm"
            >
              <p className="break-words text-error">{workspace.historyError}</p>
              {!!workspace.pendingCount && (
                <button
                  type="button"
                  onClick={() => void workspace.retrySave()}
                  disabled={workspace.saving}
                  className="btn-secondary mt-3 min-h-10 px-4 py-2 text-sm"
                >
                  <RefreshCw size={15} />
                  {workspace.saving ? "Сохраняем…" : "Повторить сохранение"}
                </button>
              )}
            </div>
          )}
          {workspace.historyLoading && (
            <p role="status" className="py-4 text-sm text-muted">
              Загружаем историю…
            </p>
          )}
          {!workspace.historyLoading && !workspace.records.length && (
            <p className="glass-strong rounded-xl border border-border px-6 py-8 text-center text-base text-muted">
              Здесь появятся ваши готовые тексты. Выберите запись, чтобы
              вернуться к ней.
            </p>
          )}
          {!!workspace.records.length && (
            <ul className="grid gap-3 md:grid-cols-2">
              {workspace.records.map((record) => (
                <li key={record.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(null);
                      setSelectedGeneration({ ...record });
                    }}
                    disabled={generatorBusy || loading}
                    aria-pressed={restored?.id === record.id}
                    className={`w-full rounded-xl border bg-card p-5 text-left transition-[transform,opacity] duration-150 ease-out hover:scale-[1.01] hover:border-border-hover disabled:scale-100 disabled:opacity-50 ${restored?.id === record.id ? "border-accent/50" : "border-border"}`}
                  >
                    <span className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                      <span>
                        {record.type} · {record.tone}
                      </span>
                      <time dateTime={record.created_at}>
                        {new Date(record.created_at).toLocaleString("ru-RU", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </time>
                    </span>
                    <span className="line-clamp-1 block text-base font-[590]">
                      {record.task}
                    </span>
                    <span className="mt-2 line-clamp-2 block text-sm leading-relaxed text-muted">
                      {record.result}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <footer className="container-page pb-8 text-xs text-muted">
        © {new Date().getFullYear()} Neura · Больше идей. Меньше рутины.
      </footer>
      <LimitModal open={workspace.limitOpen} onClose={workspace.closeLimit} />
    </div>
  );
}
