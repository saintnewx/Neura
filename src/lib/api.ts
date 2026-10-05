// Supported formats are shared by both generator interfaces.
export const contentTypes = ["Пост", "Email", "Реклама", "Reels"] as const;
export type ContentType = (typeof contentTypes)[number];

// Only the same-origin server endpoint has access to the NVIDIA API key.
export async function generateContent(
  task: string,
  type: string,
): Promise<string> {
  let response: Response;
  try {
    response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, type }),
      signal: AbortSignal.timeout(55_000),
    });
  } catch (error) {
    throw new Error(
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError")
        ? "Генерация заняла слишком много времени. Попробуйте снова."
        : "Не удалось связаться с сервером. Проверьте подключение и попробуйте снова.",
    );
  }

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof data.error === "string" &&
      data.error.trim()
        ? data.error
        : "Не удалось сгенерировать текст. Попробуйте снова.";
    throw new Error(message);
  }
  if (
    typeof data !== "object" ||
    data === null ||
    !("content" in data) ||
    typeof data.content !== "string" ||
    !data.content.trim()
  ) {
    throw new Error(
      "Сервер вернул пустой или некорректный ответ. Попробуйте снова.",
    );
  }
  return data.content;
}
