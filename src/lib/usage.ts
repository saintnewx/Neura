// Daily limits use UTC, matching the PostgreSQL quota functions.
export const GUEST_LIMIT = 5;
export const AUTH_LIMIT = 20;
const GUEST_USAGE_KEY = "neura.usage.v1";

export interface DailyUsage {
  used: number;
  limit: number;
  reset_date: string;
}

export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isToday(date: string): boolean {
  return date === todayUtc();
}

export function isDailyUsage(value: unknown): value is DailyUsage {
  if (typeof value !== "object" || value === null) return false;
  const usage = value as Partial<DailyUsage>;
  return (
    typeof usage.used === "number" &&
    Number.isInteger(usage.used) &&
    usage.used >= 0 &&
    typeof usage.limit === "number" &&
    Number.isInteger(usage.limit) &&
    usage.limit > 0 &&
    typeof usage.reset_date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(usage.reset_date)
  );
}

// Missing, expired, or malformed local values start a new guest day.
export function getGuestUsage(): DailyUsage {
  const fresh = { used: 0, limit: GUEST_LIMIT, reset_date: todayUtc() };
  try {
    const data: unknown = JSON.parse(
      localStorage.getItem(GUEST_USAGE_KEY) || "null",
    );
    if (isDailyUsage(data) && isToday(data.reset_date)) {
      return { ...data, limit: GUEST_LIMIT };
    }
  } catch {
    // Reserving a generation reports unavailable storage before starting AI work.
  }
  return fresh;
}

export async function reserveGuestGeneration(): Promise<{
  allowed: boolean;
  usage: DailyUsage;
}> {
  const reserve = () => {
    const usage = getGuestUsage();
    if (usage.used >= GUEST_LIMIT) return { allowed: false, usage };
    const next = { ...usage, used: usage.used + 1 };
    try {
      localStorage.setItem(GUEST_USAGE_KEY, JSON.stringify(next));
    } catch {
      throw new Error(
        "Браузер не разрешает сохранять дневной лимит. Разрешите localStorage или войдите в аккаунт.",
      );
    }
    return { allowed: true, usage: next };
  };
  // Serialize reservations across tabs when the browser supports Web Locks.
  if (navigator.locks) return navigator.locks.request(GUEST_USAGE_KEY, reserve);
  return reserve();
}

// The server supplies this code only for the app's daily quota, not NVIDIA 429s.
export class GenerationLimitError extends Error {
  constructor(
    message: string,
    public readonly usage?: DailyUsage,
  ) {
    super(message);
    this.name = "GenerationLimitError";
  }
}
