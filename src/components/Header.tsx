import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#story", label: "Как работает" },
  { href: "#features", label: "Возможности" },
  { href: "#pricing", label: "Тарифы" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-200 motion-reduce:transition-none ${
          scrolled
            ? "bg-glass-strong backdrop-blur-[16px] md:backdrop-blur-[24px] border-b border-ink/[0.06] shadow-glass"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-6 h-16 md:h-[72px] flex items-center justify-between">
          <a
            href="/"
            className="inline-flex min-h-11 items-center text-ink font-display text-xl tracking-tight"
          >
            Neura<span className="text-accent-ink">.</span>
          </a>

          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-muted hover:text-ink"
                style={{ fontSize: "14px" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="/app"
              className="inline-flex items-center justify-center bg-accent text-white rounded-full px-5 font-display transition-transform duration-200 motion-safe:hover:-translate-y-px motion-safe:active:scale-[0.97] motion-reduce:transition-none"
              style={{ minHeight: "44px", fontSize: "19px" }}
            >
              Попробовать бесплатно
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden flex h-11 w-11 items-center justify-center text-ink -mr-2"
            aria-label="Открыть меню"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-bg lg:hidden">
          <div className="flex items-center justify-between px-5 md:px-6 h-16 md:h-[72px]">
            <span className="text-ink font-bold text-lg">
              Neura<span className="text-accent-ink">.</span>
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="flex h-11 w-11 items-center justify-center text-ink -mr-2"
              aria-label="Закрыть меню"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex flex-col px-6 pt-8 gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center text-ink text-2xl font-display"
              >
                {link.label}
              </a>
            ))}

            <a
              href="/app"
              onClick={() => setMenuOpen(false)}
              className="mt-6 inline-flex items-center justify-center bg-accent text-white rounded-pill px-6 font-display"
              style={{ minHeight: "56px", fontSize: "19px" }}
            >
              Попробовать бесплатно
            </a>
          </nav>
        </div>
      )}
    </>
  );
}