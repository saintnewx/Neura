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
        className="sr-only z-[70] bg-bg px-6 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        К содержимому
      </a>
      <header className="sticky top-0 z-40 border-b border-line/50 bg-bg/80 backdrop-blur-xl">
        <div className="container-page flex h-20 items-center justify-between gap-6">
          <Link
            to="/"
            aria-label="Neura — на главную"
            className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight"
          >
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-lg text-bg"
            >
              N
            </span>
            Neura<span className="text-accent">.</span>
          </Link>
          <nav
            aria-label="Основная навигация"
            className="hidden items-center gap-8 md:flex"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted transition-colors hover:text-text"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Link
            to="/app"
            className="btn-primary hidden min-h-10 px-5 py-2.5 text-sm md:inline-flex"
          >
            Попробовать бесплатно
          </Link>
          <button
            type="button"
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-line md:hidden"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
