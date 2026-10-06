import { Component, useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

// Auth UI requires appearance.theme.dark when theme="dark", even with variables.
const authTheme = {
  colors: {
    brand: "#00E5FF",
    brandAccent: "#00E5FF",
    brandButtonText: "#0B0D17",
    defaultButtonBackground: "rgba(255,255,255,0.04)",
    defaultButtonBackgroundHover: "rgba(255,255,255,0.06)",
    defaultButtonBorder: "rgba(255,255,255,0.1)",
    defaultButtonText: "#E6E9F5",
    dividerBackground: "#2A3050",
    inputBackground: "#13162A",
    inputBorder: "#2A3050",
    inputBorderHover: "#00E5FF",
    inputBorderFocus: "#00E5FF",
    inputText: "#E6E9F5",
    inputLabelText: "#8B90B0",
    inputPlaceholder: "#8B90B0",
    anchorTextColor: "#00E5FF",
    anchorTextHoverColor: "#00E5FF",
    messageText: "#E6E9F5",
    messageBackground: "transparent",
    messageBorder: "transparent",
    messageTextDanger: "#FF6B6B",
    messageBackgroundDanger: "transparent",
    messageBorderDanger: "transparent",
  },
  fonts: {
    bodyFontFamily: "Inter, system-ui, sans-serif",
    buttonFontFamily: "Inter, system-ui, sans-serif",
    inputFontFamily: "Inter, system-ui, sans-serif",
    labelFontFamily: "Inter, system-ui, sans-serif",
  },
  fontSizes: {
    baseBodySize: "15px",
    baseInputSize: "16px",
    baseLabelSize: "13px",
    baseButtonSize: "15px",
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
    socialAuthSpacing: "0px",
    inputPadding: "12px 14px",
    buttonPadding: "12px 16px",
  },
};

const authAppearance = {
  theme: { default: authTheme, dark: authTheme },
  variables: { default: authTheme, dark: authTheme },
  style: {
    button: {
      height: "48px",
      minHeight: "48px",
      fontWeight: 590,
      backdropFilter: "blur(12px)",
      transition: "transform 150ms ease-out, opacity 150ms ease-out",
    },
    container: { margin: "0", gap: "0" },
    message: {
      fontSize: "13px",
      lineHeight: "1.5",
      padding: "8px 0",
      overflowWrap: "anywhere" as const,
    },
  },
};

// The card and a working back link remain visible if an auth widget fails to render.
class AuthPanelBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.error("Neura auth UI failed:", error.message);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function UnavailableAuth() {
  return (
    <div className="auth-notice" role="status">
      <p>Авторизация временно недоступна, работаем в гостевом режиме</p>
      <Link to="/app" className="auth-button mt-5">
        <ArrowLeft size={16} aria-hidden="true" />
        Назад
      </Link>
    </div>
  );
}

interface FieldErrors {
  email?: string;
  password?: string;
}

// Glass auth page shares the existing Supabase session and NVIDIA workspace.
export default function AuthPage() {
  const { user, loading, authError } = useAuth();
  const [registering, setRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const active = useRef(true);
  const busy = useRef(false);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  function switchView() {
    if (busy.current) return;
    setRegistering((value) => !value);
    setFieldErrors({});
    setFormError("");
    setConfirmation("");
    setPassword("");
  }

  // Validate fields locally; Supabase remains responsible for credentials and sessions.
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = supabase;
    if (!client || busy.current) return;
    const nextErrors: FieldErrors = {};
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))
      nextErrors.email = "Введите корректный email.";
    if (!password) nextErrors.password = "Введите пароль.";
    else if (registering && password.length < 6)
      nextErrors.password = "Пароль должен содержать минимум 6 символов.";
    setFieldErrors(nextErrors);
    setFormError("");
    setConfirmation("");
    if (Object.keys(nextErrors).length) return;
    busy.current = true;
    setSubmitting(true);
    try {
      const { data, error } = registering
        ? await client.auth.signUp({
            email: normalizedEmail,
            password,
            options: { emailRedirectTo: `${window.location.origin}/app` },
          })
        : await client.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });
      if (!active.current) return;
      if (error) {
        if (
          error.code === "invalid_credentials" ||
          error.code === "invalid_login_credentials"
        )
          setFormError("Неверный email или пароль.");
        else if (error.code === "email_not_confirmed")
          setFieldErrors({ email: "Подтвердите email по ссылке из письма." });
        else if (error.code === "user_already_exists")
          setFieldErrors({
            email: "Этот email уже зарегистрирован. Войдите в аккаунт.",
          });
        else if (error.code === "weak_password")
          setFieldErrors({ password: error.message });
        else setFormError(error.message);
      } else if (registering && !data.session) {
        setConfirmation(
          "Проверьте почту: мы отправили ссылку для подтверждения аккаунта.",
        );
        setPassword("");
      }
    } catch (error) {
      if (active.current)
        setFormError(
          error instanceof Error
            ? error.message
            : "Не удалось связаться с сервисом. Попробуйте снова.",
        );
    } finally {
      busy.current = false;
      if (active.current) setSubmitting(false);
    }
  }

  if (user) return <Navigate to="/app" replace />;

  return (
    <div className="auth-page">
      {/* Three fixed blurred gradients sit behind the interactive card. */}
      <div aria-hidden="true" className="auth-orb auth-orb-one" />
      <div aria-hidden="true" className="auth-orb auth-orb-two" />
      <div aria-hidden="true" className="auth-orb auth-orb-three" />
      <Link to="/app" className="auth-back">
        <ArrowLeft size={18} aria-hidden="true" />
        Назад
      </Link>
      <main className="auth-main">
        <section
          className="glass-strong auth-card"
          aria-labelledby="auth-title"
        >
          <Link to="/" className="auth-logo">
            Neura<span className="text-accent">.</span>
          </Link>
          <h1 id="auth-title" className="auth-heading">
            {registering ? "Создайте аккаунт" : "Войдите в Neura"}
          </h1>
          <p className="auth-subtitle">
            Сохраняйте историю на всех устройствах
          </p>
          {!supabase ? (
            <UnavailableAuth />
          ) : loading ? (
            <p
              role="status"
              className="auth-notice flex items-center justify-center gap-2"
            >
              <LoaderCircle
                size={18}
                className="auth-spinner"
                aria-hidden="true"
              />
              Проверяем вход…
            </p>
          ) : (
            <AuthPanelBoundary fallback={<UnavailableAuth />}>
              {/* Auth UI provides the Google icon and its OAuth flow; theme is explicit. */}
              <fieldset className="auth-social" disabled={submitting}>
                <Auth
                  supabaseClient={supabase}
                  theme="dark"
                  appearance={authAppearance}
                  providers={["google"]}
                  onlyThirdPartyProviders
                  showLinks={false}
                  redirectTo={`${window.location.origin}/app`}
                  localization={{
                    variables: {
                      sign_in: {
                        social_provider_text: "Продолжить с {{provider}}",
                      },
                      sign_up: {
                        social_provider_text: "Продолжить с {{provider}}",
                      },
                    },
                  }}
                />
              </fieldset>
              <div className="auth-divider" aria-hidden="true">
                <span>или</span>
              </div>
              <form
                className="auth-form"
                onSubmit={(event) => void submit(event)}
                noValidate
              >
                <div>
                  <label htmlFor="auth-email" className="auth-label">
                    Email
                  </label>
                  <input
                    id="auth-email"
                    className="auth-input"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@company.com"
                    value={email}
                    disabled={submitting}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setFieldErrors((errors) => ({
                        ...errors,
                        email: undefined,
                      }));
                      setFormError("");
                    }}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? "auth-email-error" : undefined
                    }
                    required
                  />
                  {fieldErrors.email && (
                    <p
                      id="auth-email-error"
                      role="alert"
                      className="auth-field-error"
                    >
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="auth-password" className="auth-label">
                    Пароль
                  </label>
                  <input
                    id="auth-password"
                    className="auth-input"
                    type="password"
                    autoComplete={
                      registering ? "new-password" : "current-password"
                    }
                    placeholder={
                      registering ? "Минимум 6 символов" : "Ваш пароль"
                    }
                    value={password}
                    disabled={submitting}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setFieldErrors((errors) => ({
                        ...errors,
                        password: undefined,
                      }));
                      setFormError("");
                    }}
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={
                      fieldErrors.password ? "auth-password-error" : undefined
                    }
                    required
                  />
                  {fieldErrors.password && (
                    <p
                      id="auth-password-error"
                      role="alert"
                      className="auth-field-error"
                    >
                      {fieldErrors.password}
                    </p>
                  )}
                  {(formError || authError) && (
                    <p role="alert" className="auth-field-error">
                      {formError || authError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="auth-button"
                  disabled={submitting}
                >
                  {submitting && (
                    <LoaderCircle
                      size={17}
                      className="auth-spinner"
                      aria-hidden="true"
                    />
                  )}
                  {submitting
                    ? registering
                      ? "Создаём аккаунт…"
                      : "Входим…"
                    : registering
                      ? "Зарегистрироваться"
                      : "Войти"}
                </button>
                {confirmation && (
                  <p role="status" className="auth-notice">
                    {confirmation}
                  </p>
                )}
              </form>
              <button
                type="button"
                className="auth-switch"
                onClick={switchView}
                disabled={submitting}
              >
                {registering
                  ? "Уже есть аккаунт? Войти"
                  : "Нет аккаунта? Зарегистрироваться"}
              </button>
            </AuthPanelBoundary>
          )}
        </section>
      </main>
    </div>
  );
}
