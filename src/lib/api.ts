import { readSseData } from "./sse";
import { GenerationLimitError, isDailyUsage } from "./usage";
import type { DailyUsage } from "./usage";

// Supported formats are shared by both generator interfaces.
export const contentTypes = ["Пост", "Email", "Реклама", "Reels"] as const;
export type ContentType = (typeof contentTypes)[number];

export interface GenerateOptions {
  accessToken?: string;
  tone?: string;
  onUsage?: (usage: DailyUsage) => void;
}

// Only the same-origin server endpoint has access to the NVIDIA API key.
export async function generateContent(
  task: string,
  type: string,
  onContent?: (content: string) => void,
  signal?: AbortSignal,
  options: GenerateOptions = {},
): Promise<string> {
  let response: Response;
  try {
    response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        ...(options.accessToken
          ? { Authorization: `Bearer ${options.accessToken}` }
          : {}),
      },
      body: JSON.stringify({ task, type, tone: options.tone || "Нейтральный" }),
      signal: signal
        ? AbortSignal.any([signal, AbortSignal.timeout(65_000)])
        : AbortSignal.timeout(65_000),
    });
  } catch (error) {
    throw new Error(
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError")
        ? "Генерация заняла слишком много времени. Попробуйте снова."
        : "Не удалось связаться с сервером. Проверьте подключение и попробуйте снова.",
    );
  }

  if (!response.ok) {
    const data: unknown = await response.json().catch(() => null);
    if (
      typeof data === "object" &&
      data !== null &&
      "usage" in data &&
      isDailyUsage(data.usage)
    ) {
      options.onUsage?.(data.usage);
    }
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof data.error === "string" &&
      data.error.trim()
        ? data.error
        : "Не удалось сгенерировать текст. Попробуйте снова.";
    if (
      typeof data === "object" &&
      data !== null &&
      "code" in data &&
      data.code === "DAILY_LIMIT_REACHED"
    ) {
      throw new GenerationLimitError(
        message,
        "usage" in data && isDailyUsage(data.usage) ? data.usage : undefined,
      );
    }
    throw new Error(message);
  }
  if (
    !response.body ||
    !response.headers.get("content-type")?.includes("text/event-stream")
  ) {
    throw new Error("Сервер не вернул потоковый ответ. Попробуйте снова.");
  }

  let content = "";
  let completed = false;
  try {
    for await (const payload of readSseData(response.body)) {
      if (payload.trim() === "[DONE]") {
        completed = true;
        break;
      }
      let data: unknown;
      try {
        data = JSON.parse(payload);
      } catch {
        throw new Error(
          "Сервер вернул некорректный поток ответа. Попробуйте снова.",
        );
      }
      if (typeof data !== "object" || data === null) {
        throw new Error(
          "Сервер вернул некорректный поток ответа. Попробуйте снова.",
        );
      }
      if ("error" in data && typeof data.error === "string")
        throw new Error(data.error);
      if ("usage" in data && isDailyUsage(data.usage))
        options.onUsage?.(data.usage);
      if ("content" in data && typeof data.content === "string") {
        content += data.content;
        onContent?.(content);
      }
    }
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    ) {
      throw new Error(
        "Генерация заняла слишком много времени. Попробуйте снова.",
      );
    }
    if (error instanceof TypeError) {
      throw new Error(
        "Соединение прервалось. Полученный текст сохранён; попробуйте снова.",
      );
    }
    throw error;
  }
  if (!completed)
    throw new Error(
      "Поток ответа прервался. Полученный текст сохранён; попробуйте снова.",
    );
  if (!content.trim())
    throw new Error("AI-сервис вернул пустой ответ. Попробуйте снова.");
  return content;
}
