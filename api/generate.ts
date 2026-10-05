import type { VercelRequest, VercelResponse } from "@vercel/node";
import { once } from "node:events";
import { STATUS_CODES } from "node:http";
import { readSseData } from "../src/lib/sse.js";

// vercel.json also sets this duration for the standalone Node.js Function.
export const maxDuration = 60;

// Server-only NVIDIA configuration; the key never reaches the browser.
const NVIDIA_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "openai/gpt-oss-20b";
const SYSTEM_PROMPT =
  "Ты — профессиональный копирайтер. Пиши живо, конкретно, без воды. Учитывай тип контента: Пост/Email/Реклама/Reels.";
const CONTENT_TYPES = new Set(["Пост", "Email", "Реклама", "Reels"]);
const UPSTREAM_TIMEOUT_MS = 55_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Preserve provider diagnostics while removing any echoed authorization secret.
function redactKey(text: string, apiKey: string): string {
  for (const value of new Set([apiKey, JSON.stringify(apiKey).slice(1, -1)])) {
    if (value) text = text.split(value).join("[REDACTED]");
  }
  return text;
}

function providerMessage(value: unknown): string | undefined {
  if (typeof value === "string") return value.trim() || undefined;
  if (isRecord(value)) {
    for (const field of ["error", "message", "detail", "title"]) {
      const message = providerMessage(value[field]);
      if (message) return message;
    }
  }
  return undefined;
}

function describeProviderError(
  body: string,
  status?: number,
  statusText?: string,
): string {
  let message = body.trim();
  try {
    message = providerMessage(JSON.parse(body)) ?? message;
  } catch {
    /* Plain-text error bodies are also valid diagnostics. */
  }
  const label = status
    ? `${status} ${statusText || STATUS_CODES[status] || "NVIDIA API error"}`
    : "";
  return message
    ? label
      ? `${label}: ${message}`
      : message
    : label || "NVIDIA вернула ошибку без описания.";
}

function providerErrorStatus(
  data: Record<string, unknown>,
): number | undefined {
  const error = isRecord(data.error) ? data.error : {};
  for (const value of [
    data.status,
    data.status_code,
    data.code,
    error.status,
    error.status_code,
    error.code,
  ]) {
    const code = typeof value === "string" ? Number(value) : value;
    if (
      typeof code === "number" &&
      Number.isInteger(code) &&
      code >= 400 &&
      code <= 599
    )
      return code;
  }
  return undefined;
}

// Validate before opening the stream; validation errors retain JSON HTTP status.
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
  let timedOut = false;
  let disconnected = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, UPSTREAM_TIMEOUT_MS);
  const onClose = () => {
    if (!response.writableEnded) {
      disconnected = true;
      controller.abort();
    }
  };
  response.on("close", onClose);

  // Complete SSE frames can be sent independently without buffering the answer.
  async function writeFrame(frame: string): Promise<void> {
    if (response.destroyed || response.writableEnded)
      throw new Error("Client disconnected");
    if (!response.write(frame)) {
      await once(response, "drain", { signal: controller.signal });
    }
  }
  async function sendData(data: {
    content?: string;
    error?: string;
    status?: number;
  }): Promise<void> {
    await writeFrame(`data: ${JSON.stringify(data)}\n\n`);
  }

  // Flush headers and a comment before waiting for NVIDIA's first token.
  response.status(200);
  response.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  response.setHeader("Cache-Control", "no-cache, no-store, no-transform");
  response.setHeader("X-Accel-Buffering", "no");
  response.flushHeaders();
  const heartbeat = setInterval(() => {
    void writeFrame(": keep-alive\n\n").catch(() => controller.abort());
  }, 10_000);

  try {
    await writeFrame(": connected\n\n");
    const upstream = await fetch(NVIDIA_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
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
        stream: true,
      }),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      // Only failed/non-SSE responses are read in full; successful SSE stays incremental.
      const errorBody = redactKey(await upstream.text(), apiKey);
      console.log("NVIDIA HTTP error", {
        status: upstream.status,
        statusText: redactKey(
          upstream.statusText || STATUS_CODES[upstream.status] || "",
          apiKey,
        ),
        body: errorBody,
      });
      await sendData({
        error: redactKey(
          describeProviderError(
            errorBody,
            upstream.status,
            upstream.statusText,
          ),
          apiKey,
        ),
        status: upstream.status,
      });
      return;
    }
    if (
      !upstream.body ||
      !upstream.headers.get("content-type")?.includes("text/event-stream")
    ) {
      const errorBody = redactKey(await upstream.text(), apiKey);
      console.log("NVIDIA non-streaming response", {
        status: upstream.status,
        contentType: redactKey(
          upstream.headers.get("content-type") || "",
          apiKey,
        ),
        body: errorBody,
      });
      throw new Error(
        `NVIDIA вернула непотоковый ответ: ${describeProviderError(errorBody, upstream.status, upstream.statusText)}`,
      );
    }

    let hasContent = false;
    let completed = false;
    for await (const payload of readSseData(upstream.body)) {
      if (payload.trim() === "[DONE]") {
        if (!hasContent)
          throw new Error("AI-сервис вернул пустой ответ. Попробуйте снова.");
        await writeFrame("data: [DONE]\n\n");
        completed = true;
        break;
      }
      let data: unknown;
      try {
        data = JSON.parse(payload);
      } catch {
        const errorBody = redactKey(payload, apiKey);
        console.log("NVIDIA malformed SSE event", {
          status: upstream.status,
          body: errorBody,
        });
        throw new Error(`NVIDIA вернула некорректное событие: ${errorBody}`);
      }
      if (isRecord(data) && "error" in data) {
        const errorBody = redactKey(payload, apiKey);
        const status = providerErrorStatus(data);
        console.log("NVIDIA SSE error", {
          status: status ?? upstream.status,
          body: errorBody,
        });
        await sendData({
          error: describeProviderError(errorBody, status),
          status: status ?? 502,
        });
        return;
      }
      const choice =
        isRecord(data) && Array.isArray(data.choices)
          ? (data.choices[0] as unknown)
          : undefined;
      const delta = isRecord(choice) ? choice.delta : undefined;
      if (
        isRecord(delta) &&
        typeof delta.content === "string" &&
        delta.content
      ) {
        hasContent ||= Boolean(delta.content.trim());
        // Only visible content is forwarded; reasoning metadata stays on the server.
        await sendData({ content: delta.content });
      }
    }
    if (!completed)
      throw new Error("Соединение с AI-сервисом прервалось. Попробуйте снова.");
  } catch (error) {
    if (!disconnected && !response.destroyed) {
      // Include the failure object/stack in Vercel logs, never request headers.
      console.log(
        "NVIDIA generation failed",
        redactKey(
          JSON.stringify(
            error instanceof Error
              ? {
                  name: error.name,
                  message: error.message,
                  stack: error.stack,
                  cause: String(error.cause ?? ""),
                  timedOut,
                }
              : { error: String(error), timedOut },
          ),
          apiKey,
        ),
      );
      const message = timedOut
        ? "Генерация заняла слишком много времени. Полученный текст сохранён; попробуйте снова."
        : error instanceof TypeError
          ? "Не удалось связаться с AI-сервисом. Попробуйте снова."
          : error instanceof Error
            ? redactKey(error.message, apiKey)
            : "Генерация прервалась. Попробуйте снова.";
      await sendData({ error: message, status: timedOut ? 504 : 502 }).catch(
        () => undefined,
      );
    }
  } finally {
    clearTimeout(timeout);
    clearInterval(heartbeat);
    response.off("close", onClose);
    controller.abort();
    if (!response.destroyed && !response.writableEnded) response.end();
  }
}
