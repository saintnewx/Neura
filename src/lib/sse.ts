// Decode complete SSE events across arbitrary network and UTF-8 boundaries.
export async function* readSseData(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let dataLines: string[] = [];
  let eventSize = 0;

  function consumeLine(line: string): string | undefined {
    if (line.endsWith("\r")) line = line.slice(0, -1);
    if (!line) {
      const data = dataLines.length ? dataLines.join("\n") : undefined;
      dataLines = [];
      eventSize = 0;
      return data;
    }
    if (line.startsWith("data:")) {
      const data = line.slice(5).replace(/^ /, "");
      eventSize += data.length;
      if (eventSize > 65_536)
        throw new Error("Сервис вернул слишком большой фрагмент ответа.");
      dataLines.push(data);
    }
    // Comments (including heartbeat), event, id, and retry are not text data.
    return undefined;
  }

  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += done
        ? decoder.decode()
        : decoder.decode(value, { stream: true });
      let newline = buffer.indexOf("\n");
      while (newline !== -1) {
        const data = consumeLine(buffer.slice(0, newline));
        buffer = buffer.slice(newline + 1);
        if (data !== undefined) yield data;
        newline = buffer.indexOf("\n");
      }
      if (buffer.length > 65_536)
        throw new Error("Сервис вернул некорректный поток ответа.");
      if (done) break;
    }
    // Accept a final event without a trailing blank line.
    if (buffer) consumeLine(buffer);
    if (dataLines.length) yield dataLines.join("\n");
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}
