// Supported formats are shared by both generator interfaces.
export const contentTypes = ["Пост", "Email", "Реклама", "Reels"] as const;
export type ContentType = (typeof contentTypes)[number];

// Demo API: latency and a deliberate 20% error rate for error-state testing.
export async function generateContent(
  task: string,
  type: string,
): Promise<string> {
  await new Promise<void>((resolve) => setTimeout(resolve, 1500));
  if (Math.random() < 0.2) throw new Error("Generation failed");
  return `[Демо-результат для "${task}"]\n\nФормат: ${type}\n\nЗдесь будет текст, сгенерированный AI...`;
}
