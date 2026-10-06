import { useEffect, useId, useRef } from "react";
import { Clock3, X } from "lucide-react";
import { Link } from "react-router-dom";

interface LimitModalProps {
  open: boolean;
  onClose: () => void;
}

// A focused dialog explains the limit without pretending a paid checkout exists.
export default function LimitModal({ open, onClose }: LimitModalProps) {
  const dialog = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    close.current?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
      }
      if (event.key !== "Tab") return;
      const controls = dialog.current?.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),[tabindex="0"]',
      );
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keydown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/85 p-5 backdrop-blur-md"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="glass-strong relative w-full max-w-lg rounded-2xl border border-line p-7 sm:p-9"
      >
        <button
          ref={close}
          type="button"
          aria-label="Закрыть сообщение о лимите"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-muted transition-[transform,opacity] duration-150 ease-out hover:scale-[1.02] hover:text-text"
        >
          <X size={20} />
        </button>
        <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
          <Clock3 size={24} />
        </span>
        <h2
          id={titleId}
          className="pr-2 text-2xl font-[590] leading-snug sm:text-3xl"
        >
          Лимит исчерпан. Оформите Pro или вернитесь завтра
        </h2>
        <p
          id={descriptionId}
          className="mt-4 text-base font-[510] leading-relaxed text-muted"
        >
          Дневной лимит обновится в 00:00 UTC. Платные подписки пока не
          подключены — посмотреть тарифы можно уже сейчас.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link to="/#pricing" onClick={onClose} className="btn-primary">
            Посмотреть тарифы
          </Link>
          <button type="button" onClick={onClose} className="btn-secondary">
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}
