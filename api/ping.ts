import type { VercelRequest, VercelResponse } from "@vercel/node";

// Lightweight health check with no NVIDIA calls or environment requirements.
export default function handler(
  _request: VercelRequest,
  response: VercelResponse,
): void {
  response.setHeader("Cache-Control", "no-store");
  response.status(200).json({ ok: true, time: Date.now() });
}
