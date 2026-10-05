import type { VercelRequest, VercelResponse } from "@vercel/node";

// Server-only NVIDIA configuration; the key never reaches the browser.
const NVIDIA_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "deepseek-ai/deepseek-v4.1-flash";
const SYSTEM_PROMPT =
  "Ты — профессиональный копирайтер. Пиши живо, конкретно, без воды. Учитывай тип контента: Пост/Email/Реклама/Reels.";
const CONTENT_TYPES = new Set(["Пост", "Email", "Реклама", "Reels"]);
const UPSTREAM_TIMEOUT_MS = 45_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Map provider failures to useful messages without exposing internal responses.
function upstreamError(status: number): { status: number; error: string } {
  if (status === 429) {
    return {
      status: 429,
      error: "Слишком много запросов. Подождите немного и попробуйте снова.",
    };
  }
  if (status === 402) {
    return {
      status: 503,
      error: "Лимит сервиса генерации исчерпан. Попробуйте позже.",
    };
  }
  if (status === 401 || status === 403) {
    return {
      status: 503,
      error: "Сервис генерации временно недоступен. Попробуйте позже.",
    };
  }
  if (status === 404) {
    return {
      status: 502,
      error: "Выбранная AI-модель сейчас недоступна. Попробуйте позже.",
    };
  }
  if (status === 408 || status === 504) {
    return {
      status: 504,
      error: "Генерация заняла слишком много времени. Попробуйте снова.",
    };
  }
  return {
    status: 502,
    error: "Не удалось получить текст от AI-сервиса. Попробуйте снова.",
  };
}

// Vercel Node.js Function: validate input, call NVIDIA, return JSON.
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response
      .status(405)
      .json({ error: "Используйте POST для генерации текста." });
    return;
  }

  let body: unknown;
  try {
    body = request.body;
    if (typeof body === "string") body = JSON.parse(body);
  } catch {
    response.status(400).json({ error: "Некорректный JSON в запросе." });
    return;
  }
  if (
    !isRecord(body) ||
    typeof body.task !== "string" ||
    !body.task.trim() ||
    body.task.length > 2000 ||
    typeof body.type !== "string" ||
    !CONTENT_TYPES.has(body.type)
  ) {
    response.status(400).json({
      error:
        "Опишите задачу (до 2000 символов) и выберите формат: Пост, Email, Реклама или Reels.",
    });
    return;
  }

  const apiKey = process.env.NVIDIA_API_KEY?.trim();
  if (!apiKey) {
    response.status(503).json({
      error: "Сервис генерации ещё не настроен. Попробуйте позже.",
    });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const upstream = await fetch(NVIDIA_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Тип контента: ${body.type}\nЗадача: ${body.task.trim()}`,
          },
        ],
        temperature: 0.8,
        max_tokens: 800,
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      const failure = upstreamError(upstream.status);
      response.status(failure.status).json({ error: failure.error });
      return;
    }

    const data: unknown = await upstream.json().catch(() => null);
    if (controller.signal.aborted) throw new Error("Request timed out");
    const choice =
      isRecord(data) && Array.isArray(data.choices)
        ? (data.choices[0] as unknown)
        : undefined;
    const message = isRecord(choice) ? choice.message : undefined;
    if (
      !isRecord(message) ||
      typeof message.content !== "string" ||
      !message.content.trim()
    ) {
      response.status(502).json({
        error:
          "AI-сервис вернул пустой или некорректный ответ. Попробуйте снова.",
      });
      return;
    }
    response.status(200).json({ content: message.content.trim() });
  } catch {
    response.status(controller.signal.aborted ? 504 : 502).json({
      error: controller.signal.aborted
        ? "Генерация заняла слишком много времени. Попробуйте снова."
        : "Не удалось связаться с AI-сервисом. Попробуйте снова.",
    });
  } finally {
    clearTimeout(timeout);
  }
}
