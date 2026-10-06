import { useState } from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu";

// Shared section navigation.
export const navigation = [
  { label: "Продукт", href: "#product" },
  { label: "Тарифы", href: "#pricing" },
  { label: "Отзывы", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

// Sticky header and mobile navigation trigger.
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] bg-[#0A0B14] px-6 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        К содержимому
      </a>
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0A0B14]/70 backdrop-blur-2xl">
        <div className="container-page relative flex h-[72px] items-center justify-between gap-6">
          <Link
            to="/"
            aria-label="Neura — на главную"
            className="inline-flex items-baseline text-[18px] font-bold leading-none tracking-tight"
          >
            Neura<span className="text-accent">.</span>
          </Link>
          <nav
            aria-label="Основная навигация"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[14px] font-medium text-muted hover:text-accent"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Link
            to="/app"
            className="stage-one-primary hidden min-h-[42px] items-center justify-center rounded-full px-6 py-2.5 text-[14px] font-semibold md:inline-flex"
          >
            Начать бесплатно
          </Link>
          <button
            type="button"
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] text-muted hover:text-accent md:hidden"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
