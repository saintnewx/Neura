import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

// Modal menu: scroll lock, Escape, focus trap, and focus restoration.
export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const items =
        dialogRef.current?.querySelectorAll<HTMLElement>("a, button");
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const handleResize = () => {
      if (window.innerWidth >= 768) onClose();
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResize);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  // Portaling avoids the sticky header's backdrop stacking context.
  return createPortal(
    <div
      id="mobile-menu"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Меню навигации"
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#08090A]/95 p-6 backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between">
        <span className="text-[18px] font-bold leading-none tracking-tight">
          Neura<span className="text-accent">.</span>
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть меню"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted hover:text-accent"
        >
          <X />
        </button>
      </div>
      <nav
        className="my-auto flex shrink-0 flex-col gap-8 py-8"
        aria-label="Мобильная навигация"
      >
        {[
          ["Продукт", "#product"],
          ["Тарифы", "#pricing"],
          ["Отзывы", "#testimonials"],
          ["FAQ", "#faq"],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            onClick={onClose}
            className="text-[32px] font-semibold tracking-tight text-text hover:text-accent"
          >
            {label}
          </a>
        ))}
        <Link
          to="/app"
          onClick={onClose}
          className="stage-one-primary mt-4 inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-base font-semibold"
        >
          Начать бесплатно
        </Link>
      </nav>
      <p className="eyebrow">Больше идей. Меньше рутины.</p>
    </div>,
    document.body,
  );
}
