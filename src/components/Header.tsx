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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0D0D0C]/80 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="/"
            className="text-text-primary font-bold text-lg tracking-tight"
          >
            Neura<span className="text-accent">.</span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-text-primary transition-colors duration-200"
                style={{ fontSize: "14px" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="/app"
              className="inline-flex items-center justify-center bg-[#F5F5F7] text-[#0D0D0C] rounded-full px-5 font-medium transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ minHeight: "40px", fontSize: "14px" }}
            >
              Попробовать бесплатно
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-text-primary p-2 -mr-2"
            aria-label="Открыть меню"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#0D0D0C]/95 backdrop-blur-2xl md:hidden">
          <div className="flex items-center justify-between px-6 h-16">
            <span className="text-text-primary font-bold text-lg">
              Neura<span className="text-accent">.</span>
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-text-primary p-2 -mr-2"
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
                className="text-text-primary text-2xl font-medium"
              >
                {link.label}
              </a>
            ))}

            <a
              href="/app"
              onClick={() => setMenuOpen(false)}
              className="mt-6 inline-flex items-center justify-center bg-[#F5F5F7] text-[#0D0D0C] rounded-full px-6 font-medium"
              style={{ minHeight: "52px", fontSize: "17px" }}
            >
              Попробовать бесплатно
            </a>
          </nav>
        </div>
      )}
    </>
  );
}