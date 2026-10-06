import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types/database.js";
import type { DailyUsage } from "../src/lib/usage.js";

// Quota checks use the caller's JWT and anon key; no service-role key is needed.
export class QuotaError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly usage?: DailyUsage,
  ) {
    super(message);
    this.name = "QuotaError";
  }
}

export async function authorizeGeneration(
  authorization: string | undefined,
): Promise<DailyUsage | null> {
  if (!authorization) return null;
  const token = /^Bearer\s+(\S+)$/i.exec(authorization)?.[1];
  if (!token)
    throw new QuotaError(
      "Сессия недействительна. Войдите в аккаунт снова.",
      401,
      "INVALID_SESSION",
    );
  const url = process.env.VITE_SUPABASE_URL?.trim();
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey)
    throw new QuotaError(
      "Облачный аккаунт ещё не настроен. Попробуйте позже.",
      503,
      "SUPABASE_UNAVAILABLE",
    );
  const client = createClient<Database>(url, anonKey, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
      // Bound each Supabase request so it cannot consume the NVIDIA time budget.
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          signal: init?.signal
            ? AbortSignal.any([init.signal, AbortSignal.timeout(8_000)])
            : AbortSignal.timeout(8_000),
        }),
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) {
    if (error && (error.status === undefined || error.status >= 500)) {
      console.log("Supabase session verification failed", {
        message: error.message,
      });
      throw new QuotaError(
        "Не удалось проверить аккаунт. Попробуйте снова.",
        503,
        "SUPABASE_UNAVAILABLE",
      );
    }
    throw new QuotaError(
      "Сессия истекла. Войдите в аккаунт снова.",
      401,
      "INVALID_SESSION",
    );
  }
  const { data: rows, error: quotaError } =
    await client.rpc("reserve_generation");
  if (quotaError || !rows?.[0]) {
    console.log("Supabase quota check failed", {
      code: quotaError?.code,
      message: quotaError?.message,
    });
    throw new QuotaError(
      "Не удалось проверить дневной лимит. Убедитесь, что схема Supabase применена, и попробуйте снова.",
      503,
      "QUOTA_UNAVAILABLE",
    );
  }
  const row = rows[0];
  const usage = {
    used: row.used,
    limit: row.limit,
    reset_date: row.reset_date,
  };
  if (!row.allowed)
    throw new QuotaError(
      "Лимит исчерпан. Оформите Pro или вернитесь завтра",
      429,
      "DAILY_LIMIT_REACHED",
      usage,
    );
  return usage;
}
