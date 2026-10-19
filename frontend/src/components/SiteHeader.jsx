import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowRight, Cpu, Menu, X } from "lucide-react";

/**
 * Shared header used across the public RigCheck pages.
 *
 * The mobile menu is controlled by React state so its open/closed
 * state stays synchronized with the rendered interface.
 */
export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Reuse the same navigation links on desktop and mobile.
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          to="/"
          className="brand"
          aria-label="RigCheck home"
          onClick={closeMobileMenu}
        >
          <span className="brand-mark" aria-hidden="true">
            <Cpu size={23} strokeWidth={1.8} />
            <span className="brand-check">✓</span>
          </span>

          <span className="brand-word">
            Rig<span>Check</span>
          </span>
        </Link>

        <nav
          className={`main-nav ${mobileMenuOpen ? "main-nav-open" : ""}`}
          aria-label="Main navigation"
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link-active" : ""}`
            }
            onClick={closeMobileMenu}
          >
            Home
          </NavLink>

          <a
            className="nav-link"
            href="/#game-discovery"
            onClick={closeMobileMenu}
          >
            Browse games
          </a>

          <a
            className="nav-link"
            href="/#how-it-works"
            onClick={closeMobileMenu}
          >
            How it works
          </a>

          <a
            className="nav-link"
            href="/#pc-builder"
            onClick={closeMobileMenu}
          >
            PC Builder
          </a>

          <Link
            to="/"
            className="mobile-primary-link"
            onClick={closeMobileMenu}
          >
            Check my PC <ArrowRight size={16} />
          </Link>
        </nav>

        <a className="header-cta" href="/#game-search">
          Check compatibility
          <ArrowRight size={16} />
        </a>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}