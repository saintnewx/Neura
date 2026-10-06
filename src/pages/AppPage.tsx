import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Cloud,
  History,
  LogIn,
  LogOut,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import DemoSection from "../components/DemoSection";
import LimitModal from "../components/LimitModal";
import { useAuth } from "../hooks/useAuth";
import { useWorkspace } from "../hooks/useWorkspace";
import type { GenerationRecord } from "../lib/history";

// The workspace keeps guest history local and signed-in history private in Supabase.
export default function AppPage() {
  const [params] = useSearchParams();
  const plan = params.get("plan");
  const { user, loading, authError, signOut } = useAuth();
  const workspace = useWorkspace(user, loading);
  const [selectedGeneration, setSelectedGeneration] =
    useState<GenerationRecord | null>(null);
  const [signOutError, setSignOutError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [generatorBusy, setGeneratorBusy] = useState(false);
  const account = user?.id ?? "guest";
  const email = user?.email || "Ваш аккаунт";
  const name =
    typeof user?.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : email;
  const initials = name
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  // Restored content cannot carry over to a different authenticated account.
  useEffect(() => {
    setSelectedGeneration(null);
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
      <header className="border-b border-line/50">
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
            <div className="flex items-center gap-3">
              <span
                title={email}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-xs text-accent"
                aria-label={`Аккаунт: ${email}`}
              >
                {initials || "N"}
              </span>
              <span className="hidden max-w-44 truncate text-sm text-muted md:inline">
                {email}
              </span>
              <button
                type="button"
                onClick={() => void handleSignOut()}
                disabled={signingOut}
                className="btn-secondary min-h-10 px-3 py-2 text-sm"
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
          <h1 className="text-4xl font-[590] leading-tight sm:text-5xl lg:text-[80px]">
            Начнём с идеи.
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
        />
        {/* Browsable history restores the prompt, format, tone, and generated text. */}
        <section
          aria-labelledby="history-heading"
          className="mt-12 border-t border-line/50 pt-10"
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
            <p className="glass-strong rounded-xl border border-line/50 px-6 py-8 text-center text-base text-muted">
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
                    onClick={() => setSelectedGeneration({ ...record })}
                    disabled={generatorBusy || loading}
                    aria-pressed={restored?.id === record.id}
                    className={`w-full rounded-xl border bg-card p-5 text-left transition-[transform,opacity] duration-150 ease-out hover:scale-[1.01] hover:border-accent/30 disabled:scale-100 disabled:opacity-50 ${restored?.id === record.id ? "border-accent/50" : "border-line/50"}`}
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
