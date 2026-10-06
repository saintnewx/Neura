import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import {
  createGeneration,
  getGuestHistory,
  getPendingHistory,
  mergeHistory,
  writeGuestHistory,
  writePendingHistory,
} from "../lib/history";
import type { GenerationInput, GenerationRecord } from "../lib/history";
import {
  AUTH_LIMIT,
  GUEST_LIMIT,
  getGuestUsage,
  isToday,
  reserveGuestGeneration,
} from "../lib/usage";
import type { DailyUsage } from "../lib/usage";
import type { ContentType } from "../lib/api";

interface WorkspaceState {
  owner: string;
  records: GenerationRecord[];
  pending: GenerationRecord[];
  usage: DailyUsage;
  loading: boolean;
  error: string;
}

function emptyUsage(signedIn: boolean): DailyUsage {
  return {
    used: 0,
    limit: signedIn ? AUTH_LIMIT : GUEST_LIMIT,
    reset_date: new Date().toISOString().slice(0, 10),
  };
}

function message(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error)
    return String(error.message);
  return "Проверьте соединение и попробуйте снова.";
}

// Account changes invalidate pending reads, saves, and generation preflight requests.
export function useWorkspace(user: User | null, authLoading: boolean) {
  const owner = user?.id ?? "guest";
  const identity = useRef({ owner, version: 0 });
  if (identity.current.owner !== owner)
    identity.current = { owner, version: identity.current.version + 1 };
  const version = identity.current.version;
  const [state, setState] = useState<WorkspaceState>(() => ({
    owner,
    records: [],
    pending: [],
    usage: emptyUsage(Boolean(user)),
    loading: true,
    error: "",
  }));
  const stateRef = useRef(state);
  stateRef.current = state;
  const [limitOpen, setLimitOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reload, setReload] = useState(0);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const current = useCallback(
    () =>
      alive.current &&
      identity.current.owner === owner &&
      identity.current.version === version,
    [owner, version],
  );

  // Load only the current account's rows. Guest records are never silently uploaded.
  useEffect(() => {
    let cancelled = false;
    setLimitOpen(false);
    setSaving(false);
    setState((previous) => ({
      owner,
      records: previous.owner === owner ? previous.records : [],
      pending: previous.owner === owner ? previous.pending : [],
      usage:
        previous.owner === owner ? previous.usage : emptyUsage(Boolean(user)),
      loading: true,
      error: "",
    }));
    if (authLoading)
      return () => {
        cancelled = true;
      };
    if (!user) {
      setState((previous) => {
        const pending = previous.owner === owner ? previous.pending : [];
        return {
          owner,
          records: mergeHistory(getGuestHistory(), pending),
          pending,
          usage: getGuestUsage(),
          loading: false,
          error: pending.length
            ? "Текст готов, но браузер не разрешил сохранить историю. Не закрывайте страницу и повторите сохранение."
            : "",
        };
      });
      return () => {
        cancelled = true;
      };
    }
    const client = supabase;
    if (!client) {
      setState((previous) => ({
        ...previous,
        loading: false,
        error: "Supabase не настроен. Проверьте переменные окружения проекта.",
      }));
      return () => {
        cancelled = true;
      };
    }
    void (async () => {
      const [history, daily] = await Promise.allSettled([
        client
          .from("generations")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(100),
        client.rpc("get_daily_usage"),
      ]);
      if (cancelled || !current()) return;
      const errors: string[] = [];
      let cloud: GenerationRecord[] = [];
      if (history.status === "fulfilled" && !history.value.error) {
        cloud = (history.value.data ?? []).map((record) => ({
          ...record,
          type: record.type as ContentType,
        }));
      } else {
        const error =
          history.status === "rejected" ? history.reason : history.value.error;
        errors.push(`Не удалось загрузить облачную историю: ${message(error)}`);
      }
      let usage = emptyUsage(true);
      if (
        daily.status === "fulfilled" &&
        !daily.value.error &&
        daily.value.data?.[0]
      )
        usage = daily.value.data[0];
      else {
        const error =
          daily.status === "rejected" ? daily.reason : daily.value.error;
        errors.push(`Не удалось получить дневной лимит: ${message(error)}`);
      }
      setState((previous) => {
        // A slow initial read must not overwrite a text generated while it was pending.
        const remaining = mergeHistory(
          getPendingHistory(user.id),
          previous.owner === owner ? previous.pending : [],
        ).filter((record) => !cloud.some((saved) => saved.id === record.id));
        try {
          writePendingHistory(user.id, remaining);
        } catch {
          /* Keep the recovery queue in memory if browser storage is unavailable. */
        }
        const loadErrors = remaining.length
          ? [
              ...errors,
              "Есть тексты, которые ещё не сохранены в облаке. Повторите сохранение ниже.",
            ]
          : errors;
        const recent = previous.owner === owner ? previous.records : [];
        return {
          owner,
          records: mergeHistory(cloud, recent, remaining),
          pending: remaining,
          usage:
            previous.owner === owner &&
            previous.usage.used > usage.used &&
            isToday(previous.usage.reset_date)
              ? previous.usage
              : usage,
          loading: false,
          error: loadErrors.join(" "),
        };
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [owner, version, authLoading, reload, current, user]);

  // Guest counters and history refresh when another tab changes browser storage.
  useEffect(() => {
    if (user || authLoading) return;
    const sync = () => {
      if (current())
        setState((previous) => ({
          ...previous,
          records: mergeHistory(getGuestHistory(), previous.pending),
          usage: getGuestUsage(),
        }));
    };
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, [user, authLoading, current]);

  const updateUsage = useCallback(
    (usage: DailyUsage) => {
      if (current()) setState((previous) => ({ ...previous, usage }));
    },
    [current],
  );

  const openLimit = useCallback(() => {
    if (current()) setLimitOpen(true);
  }, [current]);

  // Authenticated reservations happen atomically on the server, never in the browser.
  const beforeGenerate = useCallback(async (): Promise<{
    accessToken?: string;
  } | null> => {
    if (authLoading || !current()) return null;
    if (!user) {
      const reservation = await reserveGuestGeneration();
      if (!current()) return null;
      updateUsage(reservation.usage);
      if (!reservation.allowed) {
        openLimit();
        return null;
      }
      return {};
    }
    const usage =
      stateRef.current.owner === owner
        ? stateRef.current.usage
        : emptyUsage(true);
    if (isToday(usage.reset_date) && usage.used >= usage.limit) {
      openLimit();
      return null;
    }
    if (!supabase) throw new Error("Supabase не настроен.");
    const { data, error } = await supabase.auth.getSession();
    if (!current()) return null;
    if (error) throw new Error(`Не удалось проверить вход: ${error.message}`);
    if (!data.session || data.session.user.id !== user.id)
      throw new Error("Сессия истекла. Войдите снова, чтобы продолжить.");
    return { accessToken: data.session.access_token };
  }, [authLoading, current, user, owner, updateUsage, openLimit]);

  const persistCloud = useCallback(async (record: GenerationRecord) => {
    if (!supabase || !record.user_id) throw new Error("Supabase не настроен.");
    const { user_id, ...input } = record;
    const { data, error } = await supabase
      .from("generations")
      .insert({ ...input, user_id })
      .select()
      .single();
    if (error?.code === "23505") {
      const existing = await supabase
        .from("generations")
        .select("*")
        .eq("id", record.id)
        .eq("user_id", user_id)
        .single();
      if (!existing.error && existing.data)
        return { ...existing.data, type: existing.data.type as ContentType };
    }
    if (error) throw new Error(error.message);
    return { ...data, type: data.type as ContentType } as GenerationRecord;
  }, []);

  // Preserve the generated text even if Supabase or localStorage is temporarily down.
  const saveGeneration = useCallback(
    async (input: GenerationInput): Promise<void> => {
      if (!current()) return;
      const record = createGeneration(input, user?.id ?? null);
      const previous =
        stateRef.current.owner === owner
          ? stateRef.current
          : { records: [], pending: [] };
      const records = mergeHistory(
        [record],
        previous.records,
        user ? [] : getGuestHistory(),
      );
      let pending = mergeHistory([record], previous.pending);
      setState((value) => ({ ...value, records, pending, error: "" }));
      if (!user) {
        try {
          writeGuestHistory(records);
          if (current())
            setState((value) => ({ ...value, pending: [], error: "" }));
        } catch {
          if (current())
            setState((value) => ({
              ...value,
              error:
                "Текст готов, но браузер не разрешил сохранить историю. Не закрывайте страницу и повторите сохранение.",
            }));
        }
        return;
      }
      try {
        writePendingHistory(user.id, pending);
      } catch {
        /* The visible result remains available for manual copying. */
      }
      try {
        const saved = await persistCloud(record);
        if (!current()) return;
        setState((value) => {
          pending = value.pending.filter((item) => item.id !== record.id);
          try {
            writePendingHistory(user.id, pending);
          } catch {
            /* Retry is idempotent if a recovery record remains. */
          }
          return {
            ...value,
            records: mergeHistory([saved], value.records),
            pending,
            error: pending.length ? value.error : "",
          };
        });
      } catch (error) {
        if (current())
          setState((value) => ({
            ...value,
            error: `Текст готов, но не сохранён в облаке: ${message(error)} Повторите сохранение.`,
          }));
      }
    },
    [current, user, owner, persistCloud],
  );

  const retrySave = useCallback(async () => {
    if (!current() || saving) return;
    const snapshot = stateRef.current;
    if (snapshot.owner !== owner || !snapshot.pending.length) return;
    setSaving(true);
    try {
      if (!user) {
        writeGuestHistory(mergeHistory(snapshot.records, getGuestHistory()));
        if (current())
          setState((value) => ({ ...value, pending: [], error: "" }));
        return;
      }
      for (const record of snapshot.pending) {
        if (!current()) return;
        const saved = await persistCloud(record);
        if (!current()) return;
        setState((value) => {
          const pending = value.pending.filter((item) => item.id !== record.id);
          try {
            writePendingHistory(user.id, pending);
          } catch {
            /* The queue is also retained in memory. */
          }
          return {
            ...value,
            records: mergeHistory([saved], value.records),
            pending,
            error: pending.length ? value.error : "",
          };
        });
      }
    } catch (error) {
      if (current())
        setState((value) => ({
          ...value,
          error: `Не удалось сохранить историю: ${message(error)}`,
        }));
    } finally {
      if (current()) setSaving(false);
    }
  }, [current, owner, user, saving, persistCloud]);

  const visible =
    state.owner === owner
      ? state
      : {
          ...state,
          records: [],
          pending: [],
          usage: emptyUsage(Boolean(user)),
          loading: true,
          error: "",
        };
  return {
    records: visible.records,
    historyLoading: visible.loading,
    historyError: visible.error,
    pendingCount: visible.pending.length,
    usage: isToday(visible.usage.reset_date)
      ? visible.usage
      : emptyUsage(Boolean(user)),
    beforeGenerate,
    saveGeneration,
    updateUsage,
    limitOpen: limitOpen && state.owner === owner,
    openLimit,
    closeLimit: () => setLimitOpen(false),
    retrySave,
    saving,
    reloadHistory: () => setReload((value) => value + 1),
  };
}
