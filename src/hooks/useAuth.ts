import { useContext, useEffect } from "react";
import { AuthContext } from "../components/AuthProvider";

// All consumers share AuthProvider rather than opening their own subscriptions.
export function useAuth() {
  const context = useContext(AuthContext);
  const user = context?.user ?? null;
  const loading = context?.loading;
  // Safari diagnostics show identity changes without exposing session tokens.
  useEffect(() => {
    console.log("[Neura auth] user", {
      user: user ? { id: user.id, email: user.email } : null,
      loading,
    });
  }, [user?.id, user?.email, loading]);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
