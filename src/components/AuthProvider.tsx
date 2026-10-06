import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { hasSessionUser, initializeAuthSession } from "../lib/authSession";

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
  const sessionRevision = useRef(0);

  // Supabase callbacks only update React state: no awaited auth calls inside them.
  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }

    let active = true;
    let ready = false;
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, nextSession) => {
      console.log("[Neura auth] onAuthStateChange", {
        event,
        hasSession: Boolean(nextSession),
        user: hasSessionUser(nextSession)
          ? { id: nextSession!.user.id, email: nextSession!.user.email }
          : null,
      });
      // The explicit initial read also reports errors from SDK initialization.
      if (!active || event === "INITIAL_SESSION") return;
      sessionRevision.current += 1;
      setSession(hasSessionUser(nextSession) ? nextSession : null);
      setAuthError(null);
      // A stored account can emit SIGNED_IN before a different OAuth account finishes.
      if (ready) setLoading(false);
    });

    // Complete Google callbacks before enabling the guest or authenticated workspace.
    const initialRevision = sessionRevision.current;
    void initializeAuthSession()
      .then(({ session: restoredSession, error }) => {
        if (!active) return;
        setAuthError(error?.message ?? null);
        if (sessionRevision.current === initialRevision)
          setSession(restoredSession);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setAuthError(
          error instanceof Error
            ? error.message
            : "Не удалось проверить состояние входа.",
        );
      })
      .finally(() => {
        ready = true;
        if (active) setLoading(false);
      });

    // Restore state on returning to the tab, without replaying an OAuth callback.
    const refreshSession = () => {
      if (!active || !ready || document.visibilityState === "hidden") return;
      const revision = sessionRevision.current;
      void client.auth
        .getSession()
        .then(({ data, error }) => {
          if (!active || sessionRevision.current !== revision) return;
          if (error) {
            setAuthError(error.message);
            return;
          }
          setSession(hasSessionUser(data.session) ? data.session : null);
          if (data.session) setAuthError(null);
        })
        .catch((error: unknown) => {
          if (!active || sessionRevision.current !== revision) return;
          setAuthError(
            error instanceof Error
              ? error.message
              : "Не удалось проверить состояние входа.",
          );
        });
    };
    window.addEventListener("focus", refreshSession);
    document.addEventListener("visibilitychange", refreshSession);

    return () => {
      active = false;
      subscription.unsubscribe();
      window.removeEventListener("focus", refreshSession);
      document.removeEventListener("visibilitychange", refreshSession);
    };
  }, []);

  // Errors propagate so the caller can explain a failed logout without lying.
  const signOut = useCallback(async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Clear the account immediately even if the SDK event was missed by a consumer.
    sessionRevision.current += 1;
    setSession(null);
    setAuthError(null);
    setLoading(false);
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
