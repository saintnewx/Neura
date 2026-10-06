import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

// A single shared subscription keeps the header, history, and generator in sync.
export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authError: string | null;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [authError, setAuthError] = useState<string | null>(null);

  // Supabase callbacks only update React state: no awaited auth calls inside them.
  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }

    let active = true;
    let sessionRevision = 0;
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      sessionRevision += 1;
      setSession(nextSession);
      setAuthError(null);
      setLoading(false);
    });

    // Ignore a stale initial read if a sign-in or sign-out event arrived first.
    const initialRevision = sessionRevision;
    void client.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active || sessionRevision !== initialRevision) return;
        setSession(data.session);
        setAuthError(error?.message ?? null);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (!active || sessionRevision !== initialRevision) return;
        setAuthError(
          error instanceof Error
            ? error.message
            : "Не удалось проверить состояние входа.",
        );
        setLoading(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Errors propagate so the caller can explain a failed logout without lying.
  const signOut = useCallback(async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      authError,
      signOut,
    }),
    [session, loading, authError, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
