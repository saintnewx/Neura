import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

interface ToastProps {
  open: boolean;
  onClose: () => void;
}

// Announce successful copying for two seconds.
export default function Toast({ open, onClose }: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(onClose, 2000);
    return () => window.clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0"
    >
      <div className="toast-enter flex items-center gap-3 whitespace-nowrap rounded-xl border border-accent/30 bg-bg-elevated px-6 py-3 text-base text-text shadow-2xl">
        <CheckCircle size={20} className="text-success" />
        Скопировано
      </div>
    </div>
  );
}
