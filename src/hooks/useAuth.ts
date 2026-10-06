import { useContext } from "react";
import { AuthContext } from "../components/AuthProvider";

// All consumers share AuthProvider rather than opening their own subscriptions.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
