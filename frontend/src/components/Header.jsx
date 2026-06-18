import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { COMPANY } from "@/lib/company";
import Logo from "@/components/Logo";

const navLinks = [
  { to: "/", label: "Főoldal", testId: "nav-home" },
  { to: "/szolgaltatasok", label: "Szolgáltatások", testId: "nav-services" },
  { to: "/kapcsolat", label: "Kapcsolat", testId: "nav-contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-white/85 backdrop-blur-xl"
      data-testid="site-header"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-3">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2 sm:gap-3 min-w-0"
            data-testid="logo-link"
            onClick={() => setOpen(false)}
          >
            <Logo size={40} className="shrink-0 group-hover:rotate-3 transition-transform duration-300" />
            <div className="leading-none min-w-0">
              <div className="font-display text-base sm:text-lg font-extrabold tracking-tight truncate">
                BENOTEK-BAU
              </div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-muted-foreground mt-1 truncate">
                Kft. · Gépi vakolás
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" data-testid="desktop-nav">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                data-testid={l.testId}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-1 h-[3px] bg-primary" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${COMPANY.phoneRaw}`}
              data-testid="header-phone-link"
              className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              {COMPANY.phone}
            </a>
            <Link
              to="/kapcsolat"
              data-testid="header-cta-button"
              className="bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-orange-600 hover:-translate-y-0.5 transition-all duration-300"
            >
              Árajánlat
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground"
            onClick={() => setOpen((v) => !v)}
            data-testid="mobile-menu-toggle"
            aria-label="Menü"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t border-border bg-white"
          data-testid="mobile-nav"
        >
          <nav className="px-6 py-6 flex flex-col gap-2">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                data-testid={`mobile-${l.testId}`}
                className={({ isActive }) =>
                  `px-3 py-3 text-base font-semibold uppercase tracking-wider border-l-4 ${
                    isActive
                      ? "border-primary text-foreground bg-muted"
                      : "border-transparent text-muted-foreground"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <a
              href={`tel:${COMPANY.phoneRaw}`}
              className="mt-2 px-3 py-3 text-base font-semibold text-foreground border-l-4 border-primary"
              data-testid="mobile-phone-link"
            >
              {COMPANY.phone}
            </a>
            <Link
              to="/kapcsolat"
              onClick={() => setOpen(false)}
              data-testid="mobile-cta"
              className="mt-2 bg-primary text-primary-foreground text-center py-3 font-bold uppercase tracking-wider"
            >
              Árajánlat kérése
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
