import { contentTypes } from "./api";
import type { ContentType } from "./api";

// Guest history and unsaved cloud results stay in separate browser namespaces.
export const GUEST_HISTORY_KEY = "neura.generations.v1";
const PENDING_HISTORY_KEY = "neura.pending-generations.v1";
const HISTORY_LIMIT = 100;

export interface GenerationInput {
  task: string;
  type: ContentType;
  tone: string;
  result: string;
}

export interface GenerationRecord extends GenerationInput {
  id: string;
  user_id: string | null;
  created_at: string;
}

// Ignore malformed or outdated browser records instead of breaking the workspace.
function isGenerationRecord(value: unknown): value is GenerationRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    (record.user_id === null || typeof record.user_id === "string") &&
    typeof record.task === "string" &&
    typeof record.type === "string" &&
    contentTypes.includes(record.type as ContentType) &&
    typeof record.tone === "string" &&
    typeof record.result === "string" &&
    typeof record.created_at === "string" &&
    Number.isFinite(Date.parse(record.created_at))
  );
}

function readHistory(key: string, userId: string | null): GenerationRecord[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(raw)
      ? raw
          .filter(isGenerationRecord)
          .filter((record) => record.user_id === userId)
          .slice(0, HISTORY_LIMIT)
      : [];
  } catch {
    return [];
  }
}

export function getGuestHistory(): GenerationRecord[] {
  return readHistory(GUEST_HISTORY_KEY, null);
}

export function writeGuestHistory(records: GenerationRecord[]): void {
  localStorage.setItem(
    GUEST_HISTORY_KEY,
    JSON.stringify(
      records
        .filter((record) => record.user_id === null)
        .slice(0, HISTORY_LIMIT),
    ),
  );
}

export function getPendingHistory(userId: string): GenerationRecord[] {
  return readHistory(`${PENDING_HISTORY_KEY}.${userId}`, userId);
}

export function writePendingHistory(
  userId: string,
  records: GenerationRecord[],
): void {
  const key = `${PENDING_HISTORY_KEY}.${userId}`;
  const pending = records
    .filter((record) => record.user_id === userId)
    .slice(0, HISTORY_LIMIT);
  if (pending.length) localStorage.setItem(key, JSON.stringify(pending));
  else localStorage.removeItem(key);
}

// UUIDs make a retry safe if a previous insert succeeded before its response was lost.
export function createGeneration(
  input: GenerationInput,
  userId: string | null,
): GenerationRecord {
  return {
    ...input,
    id: crypto.randomUUID(),
    user_id: userId,
    created_at: new Date().toISOString(),
  };
}

export function mergeHistory(
  ...groups: GenerationRecord[][]
): GenerationRecord[] {
  const unique = new Map<string, GenerationRecord>();
  for (const group of groups)
    for (const record of group) unique.set(record.id, record);
  return [...unique.values()]
    .sort(
      (left, right) =>
        Date.parse(right.created_at) - Date.parse(left.created_at),
    )
    .slice(0, HISTORY_LIMIT);
}
