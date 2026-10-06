import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export interface AuthSessionResult {
  session: Session | null;
  error: Error | null;
}

// Some SDK versions return a throwing proxy when stored user metadata is absent.
export function hasSessionUser(session: Session | null): boolean {
  try {
    const id = session?.user?.id;
    return typeof id === "string" && id.length > 0;
  } catch {
    return false;
  }
}

function asError(error: unknown): Error {
  return error instanceof Error
    ? error
    : new Error("Не удалось восстановить сессию. Попробуйте войти снова.");
}

// Supabase owns callback processing; initialize() is already cached by the SDK.
export async function initializeAuthSession(): Promise<AuthSessionResult> {
  const client = supabase;
  if (!client) {
    console.log("[Neura auth] getSession", {
      supabaseConfigured: false,
      hasSession: false,
      user: null,
    });
    return { session: null, error: null };
  }

  let initializationError: Error | null = null;
  try {
    const { error } = await client.auth.initialize();
    initializationError = error;
    if (error) console.log("[Neura auth] initialize", { error: error.message });
  } catch (error) {
    initializationError = asError(error);
    console.log("[Neura auth] initialize", {
      error: initializationError.message,
    });
  }

  try {
    // Read only after the SDK has saved the Google callback or restored storage.
    const { data, error } = await client.auth.getSession();
    let session = data.session;
    if (error) {
      const sessionError = initializationError ?? error;
      console.log("[Neura auth] getSession", {
        hasSession: Boolean(session),
        error: sessionError.message,
      });
      return {
        session: hasSessionUser(session) ? session : null,
        error: sessionError,
      };
    }

    // Repair stored tokens with missing user data before exposing them to React.
    if (session && !hasSessionUser(session)) {
      const { data: restored, error: restoreError } =
        await client.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
      if (restoreError) return { session: null, error: restoreError };
      session = restored.session;
      if (!hasSessionUser(session)) {
        return {
          session: null,
          error: new Error("Не удалось загрузить пользователя. Войдите снова."),
        };
      }
    }

    // Diagnostic output deliberately excludes access/refresh/provider tokens.
    console.log("[Neura auth] getSession", {
      supabaseConfigured: true,
      hasSession: Boolean(session),
      user: hasSessionUser(session)
        ? { id: session!.user.id, email: session!.user.email }
        : null,
      error: initializationError?.message ?? null,
    });
    return { session, error: initializationError };
  } catch (error) {
    const sessionError = initializationError ?? asError(error);
    console.log("[Neura auth] getSession", {
      user: null,
      error: sessionError.message,
    });
    return { session: null, error: sessionError };
  }
}
