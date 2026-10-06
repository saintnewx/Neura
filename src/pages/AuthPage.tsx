import { Auth } from "@supabase/auth-ui-react";
import { ArrowLeft, Cloud, KeyRound, LoaderCircle } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

// Neura tokens keep the hosted Auth UI aligned with DESIGN.md.
const authTheme = {
  colors: {
    brand: "#00E5FF",
    brandAccent: "#00E5FF",
    brandButtonText: "#0B0D17",
    defaultButtonBackground: "#13162A",
    defaultButtonBackgroundHover: "#13162A",
    defaultButtonBorder: "#2A3050",
    defaultButtonText: "#E6E9F5",
    dividerBackground: "#2A3050",
    inputBackground: "#0B0D17",
    inputBorder: "#2A3050",
    inputBorderHover: "#00E5FF",
    inputBorderFocus: "#00E5FF",
    inputText: "#E6E9F5",
    inputLabelText: "#8B90B0",
    inputPlaceholder: "#8B90B0",
    anchorTextColor: "#00E5FF",
    anchorTextHoverColor: "#00E5FF",
    messageText: "#E6E9F5",
    messageBackground: "#13162A",
    messageBorder: "#2A3050",
    messageTextDanger: "#E6E9F5",
    messageBackgroundDanger: "#13162A",
    messageBorderDanger: "#2A3050",
  },
  fonts: {
    bodyFontFamily: "Inter, system-ui, sans-serif",
    buttonFontFamily: "Inter, system-ui, sans-serif",
    inputFontFamily: "Inter, system-ui, sans-serif",
    labelFontFamily: "Inter, system-ui, sans-serif",
  },
  fontSizes: {
    baseBodySize: "18px",
    baseInputSize: "16px",
    baseLabelSize: "14px",
    baseButtonSize: "16px",
  },
  radii: { borderRadiusButton: "12px", inputBorderRadius: "12px" },
  borderWidths: { buttonBorderWidth: "1px", inputBorderWidth: "1px" },
  space: {
    spaceSmall: "4px",
    spaceMedium: "8px",
    spaceLarge: "16px",
    labelBottomMargin: "8px",
    anchorBottomMargin: "4px",
    emailInputSpacing: "8px",
    socialAuthSpacing: "8px",
    inputPadding: "14px 16px",
    buttonPadding: "14px 16px",
  },
};

const authAppearance = {
  variables: { default: authTheme, dark: authTheme },
  style: {
    button: {
      fontWeight: 590,
      transition: "transform 150ms ease-out, opacity 150ms ease-out",
    },
    input: {
      fontWeight: 510,
      transition: "transform 150ms ease-out, opacity 150ms ease-out",
    },
    anchor: {
      fontWeight: 510,
      transition: "opacity 150ms ease-out",
    },
    label: { fontWeight: 510 },
    message: { fontWeight: 510, overflowWrap: "anywhere" as const },
  },
};

// Email/password and Google share Supabase's validated forms and confirmations.
const authLocalization = {
  variables: {
    sign_in: {
      email_label: "Email",
      password_label: "Пароль",
      email_input_placeholder: "you@company.com",
      password_input_placeholder: "Ваш пароль",
      button_label: "Войти",
      loading_button_label: "Входим…",
      social_provider_text: "Продолжить с {{provider}}",
      link_text: "Уже есть аккаунт? Войти",
    },
    sign_up: {
      email_label: "Email",
      password_label: "Пароль",
      email_input_placeholder: "you@company.com",
      password_input_placeholder: "Придумайте пароль",
      button_label: "Создать аккаунт",
      loading_button_label: "Создаём аккаунт…",
      social_provider_text: "Продолжить с {{provider}}",
      link_text: "Нет аккаунта? Зарегистрироваться",
      confirmation_text:
        "Проверьте почту: мы отправили ссылку для подтверждения.",
    },
    forgotten_password: {
      email_label: "Email",
      email_input_placeholder: "you@company.com",
      button_label: "Отправить ссылку",
      loading_button_label: "Отправляем…",
      link_text: "Забыли пароль?",
      confirmation_text:
        "Проверьте почту: мы отправили ссылку для смены пароля.",
    },
    update_password: {
      password_label: "Новый пароль",
      password_input_placeholder: "Введите новый пароль",
      button_label: "Сохранить пароль",
      loading_button_label: "Сохраняем…",
      confirmation_text: "Пароль обновлён.",
    },
  },
};

// /auth remains useful before credentials are configured and after OAuth returns.
export default function AuthPage() {
  const { user, loading, authError } = useAuth();
  if (user) return <Navigate to="/app" replace />;

  return (
    <div className="hero-glow min-h-screen">
      <header className="border-b border-line/50">
        <div className="container-page flex h-20 items-center justify-between">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 text-sm font-[510] text-muted transition-opacity duration-150 ease-out hover:text-accent"
          >
            <ArrowLeft size={18} aria-hidden="true" />К генератору
          </Link>
          <Link to="/" className="text-xl font-[590] tracking-tight">
            Neura<span className="text-accent">.</span>
          </Link>
        </div>
      </header>

      <main className="container-page flex justify-center py-16 sm:py-24">
        <section
          className="glass-strong w-full max-w-[480px] rounded-2xl border border-line p-6 sm:p-10"
          aria-labelledby="auth-title"
        >
          <div className="mb-8">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
              <KeyRound size={22} aria-hidden="true" />
            </div>
            <h1
              id="auth-title"
              className="text-3xl font-[590] leading-tight tracking-tight sm:text-4xl"
            >
              Ваши идеи — всегда рядом.
            </h1>
            <p className="mt-4 text-lg font-[510] leading-relaxed text-muted">
              Войдите, чтобы сохранять историю на всех устройствах и получать 20
              генераций в день.
            </p>
          </div>

          {loading ? (
            <p role="status" className="flex items-center gap-3 text-muted">
              <LoaderCircle size={18} aria-hidden="true" />
              Проверяем вход…
            </p>
          ) : supabase ? (
            <>
              {authError && (
                <p
                  role="alert"
                  className="mb-5 break-words rounded-xl border border-line bg-bg/70 p-4 text-sm text-text"
                >
                  {authError}
                </p>
              )}
              <Auth
                supabaseClient={supabase}
                providers={["google"]}
                appearance={authAppearance}
                localization={authLocalization}
                theme="dark"
                redirectTo={`${window.location.origin}/app`}
                showLinks
              />
            </>
          ) : (
            <div
              role="status"
              className="rounded-xl border border-line bg-bg/60 p-5"
            >
              <p className="font-[590]">Вход пока не настроен</p>
              <p className="mt-2 text-sm text-muted">
                Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в окружение
                Vercel и повторно разверните проект. Генератор доступен без
                входа.
              </p>
              <Link to="/app" className="btn-primary mt-5 w-full">
                Продолжить без входа
              </Link>
            </div>
          )}

          <p className="mt-7 flex items-start gap-2.5 border-t border-line pt-6 text-sm font-[510] leading-relaxed text-muted">
            <Cloud
              size={17}
              className="mt-0.5 shrink-0 text-accent"
              aria-hidden="true"
            />
            История вашего аккаунта видна только вам.
          </p>
        </section>
      </main>
    </div>
  );
}
