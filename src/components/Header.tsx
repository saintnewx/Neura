import { useCallback, useState } from "react";
import { Menu, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu";

// Landing navigation shares destinations with the accessible mobile dialog.
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className="mn-header">
        <div className="mn-container mn-header-inner">
          <Link to="/" className="mn-brand" aria-label="Neura — на главную">
            <span className="mn-brand-mark" aria-hidden="true">n</span>Neura
          </Link>
          <nav className="mn-desktop-nav" aria-label="Основная навигация">
            <a href="#features">Возможности</a>
            <a href="#story">Как работает</a>
            <a href="#pricing">Тарифы</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="mn-header-actions">
            <Link to="/app" className="mn-button mn-button-primary">
              Начать<span className="mn-header-cta-extra"> создавать</span>
              <ArrowUpRight aria-hidden="true" />
            </Link>
            <button type="button" className="mn-menu-toggle" onClick={() => setMenuOpen(true)}
              aria-label="Открыть меню" aria-expanded={menuOpen} aria-controls="mobile-menu">
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
