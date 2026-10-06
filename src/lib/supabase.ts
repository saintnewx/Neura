import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

// Public browser credentials are supplied by the Vercel Supabase integration.
function createSupabaseClient(): SupabaseClient<Database> | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    console.info(
      "Neura: Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable authentication and cloud history.",
    );
    return null;
  }

  // Invalid configuration must not prevent the anonymous workspace from opening.
  try {
    const parsedUrl = new URL(url);
    if (!["https:", "http:"].includes(parsedUrl.protocol)) {
      throw new Error("Supabase URL must use HTTP or HTTPS.");
    }
    return createClient<Database>(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (error) {
    console.info(
      "Neura: Supabase initialization failed. Anonymous mode is still available.",
      error instanceof Error ? error.message : "Invalid configuration",
    );
    return null;
  }
}

// Only public VITE_ credentials are ever used in the browser.
export const supabase = createSupabaseClient();
